"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import AuthGuard from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Loader2, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// Definir interfaces para TypeScript
interface Inventario {
  id: string | number;
  investigacion_id: string | null;
  nombre_material: string;
  cantidad: string | number;
  observaciones: string | null;
}

interface Investigacion {
  id: string | number;
  nombre: string;
}

export default function AdminInventarioPage() {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [filteredInventarios, setFilteredInventarios] = useState<Inventario[]>(
    []
  );
  const [investigaciones, setInvestigaciones] = useState<Investigacion[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filtroInvestigacion, setFiltroInvestigacion] =
    useState<string>("todas");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [inventarioToDelete, setInventarioToDelete] =
    useState<Inventario | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Cargar inventarios e investigaciones en paralelo
      const [inventariosResponse, investigacionesResponse] = await Promise.all([
        axiosInstance.get("/inventarios"),
        axiosInstance.get("/investigaciones"),
      ]);

      setInventarios(inventariosResponse.data);
      setFilteredInventarios(inventariosResponse.data);
      setInvestigaciones(investigacionesResponse.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los datos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar inventarios según los criterios de búsqueda
    const filtered = inventarios.filter((inventario) => {
      // Filtro por texto de búsqueda
      const matchesSearch =
        inventario.nombre_material
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (inventario.investigacion_id &&
          inventario.investigacion_id
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (inventario.observaciones &&
          inventario.observaciones
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      // Filtro por investigación
      const matchesInvestigacion =
        filtroInvestigacion === "todas" ||
        (filtroInvestigacion === "sin_asignar" &&
          !inventario.investigacion_id) ||
        inventario.investigacion_id?.toString() === filtroInvestigacion;

      // Filtro por estado
      const matchesEstado =
        filtroEstado === "todos" ||
        (inventario.observaciones &&
          inventario.observaciones
            .toLowerCase()
            .includes(filtroEstado.toLowerCase()));

      return matchesSearch && matchesInvestigacion && matchesEstado;
    });

    setFilteredInventarios(filtered);
  }, [searchTerm, filtroInvestigacion, filtroEstado, inventarios]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (inventario: Inventario) => {
    setInventarioToDelete(inventario);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!inventarioToDelete) return;

    try {
      await axiosInstance.delete(`/inventarios/${inventarioToDelete.id}`);

      toast({
        title: "Material eliminado",
        description:
          "El material ha sido eliminado exitosamente del inventario.",
      });

      // Actualizar la lista de inventarios
      fetchData();
    } catch (error) {
      console.error("Error al eliminar material:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el material del inventario.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setInventarioToDelete(null);
    }
  };

  const getInvestigacionNombre = (id: string | null) => {
    if (!id) return "No asignado";
    const investigacion = investigaciones.find(
      (inv) => inv.id.toString() === id.toString()
    );
    return investigacion ? investigacion.nombre : `ID: ${id}`;
  };

  const getEstadoBadge = (observaciones: string | null) => {
    if (!observaciones) return <Badge variant="outline">Sin estado</Badge>;

    const estado = observaciones.toLowerCase();
    if (estado.includes("nuevo")) {
      return <Badge className="bg-green-100 text-green-800">Nuevo</Badge>;
    } else if (estado.includes("buen estado")) {
      return <Badge className="bg-blue-100 text-blue-800">Buen estado</Badge>;
    } else if (estado.includes("regular")) {
      return <Badge className="bg-yellow-100 text-yellow-800">Regular</Badge>;
    } else if (estado.includes("requiere mantenimiento")) {
      return (
        <Badge className="bg-orange-100 text-orange-800">
          Requiere mantenimiento
        </Badge>
      );
    } else if (estado.includes("dañado")) {
      return <Badge className="bg-red-100 text-red-800">Dañado</Badge>;
    }
    return <Badge variant="outline">{observaciones}</Badge>;
  };

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={["administrador"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={["administrador"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
            <Link href="/dashboard/admin/inventario/nueva">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nuevo Inventario
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por material, investigación o estado..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filtroInvestigacion}
                onValueChange={setFiltroInvestigacion}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por investigación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">
                    Todas las investigaciones
                  </SelectItem>
                  <SelectItem value="sin_asignar">Sin asignar</SelectItem>
                  {investigaciones.map((inv) => (
                    <SelectItem key={inv.id} value={String(inv.id)}>
                      {inv.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="buen estado">Buen estado</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="requiere mantenimiento">
                    Requiere mantenimiento
                  </SelectItem>
                  <SelectItem value="dañado">Dañado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">Material</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Investigación
                  </th>
                  <th className="py-3 px-4 text-center font-medium">
                    Cantidad
                  </th>
                  <th className="py-3 px-4 text-left font-medium">Estado</th>
                  <th className="py-3 px-4 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventarios.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No se encontraron materiales en el inventario
                    </td>
                  </tr>
                ) : (
                  filteredInventarios.map((inventario) => (
                    <tr
                      key={inventario.id}
                      className="border-t hover:bg-muted/50"
                    >
                      <td className="py-3 px-4 font-medium">
                        {inventario.nombre_material}
                      </td>
                      <td className="py-3 px-4">
                        {getInvestigacionNombre(inventario.investigacion_id)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {inventario.cantidad}
                      </td>
                      <td className="py-3 px-4">
                        {getEstadoBadge(inventario.observaciones)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/admin/inventario/editar/${inventario.id}`}
                          >
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(inventario)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-sm text-muted-foreground">
            Mostrando {filteredInventarios.length} de {inventarios.length}{" "}
            materiales
          </div>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente el material "
                {inventarioToDelete?.nombre_material}" del inventario.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    </AuthGuard>
  );
}
