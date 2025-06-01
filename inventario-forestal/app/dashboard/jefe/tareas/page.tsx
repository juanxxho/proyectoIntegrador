"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import AuthGuard from "@/components/auth/auth-guard";
import axiosInstance from "@/lib/axios"; // Asegurate de tener esto arriba 👆
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Tarea {
  id: string;
  tipo_tarea: string;
  asignado_a: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_investigacion: string;
}

export default function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filteredTareas, setFilteredTareas] = useState<Tarea[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const id_investigacion = "1";

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        setIsLoading(true);

        const response = await axiosInstance.get(
          `/tareas/investigacion/${id_investigacion}`
        );
        setTareas(response.data);
        setFilteredTareas(response.data);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las tareas.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTareas();
  }, [toast]);

  useEffect(() => {
    // Filtrar tareas según los criterios de búsqueda y estado
    const filtered = tareas.filter((tarea: Tarea) => {
      const matchesSearch =
        tarea.tipo_tarea.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarea.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarea.asignado_a.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "todos" || tarea.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredTareas(filtered);
  }, [searchTerm, statusFilter, tareas]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus =
      currentStatus === "pendiente"
        ? "en-progreso"
        : currentStatus === "en-progreso"
        ? "completada"
        : "completada";

    try {
      // Cuando el backend esté funcionando, descomenta esto:
      // await axiosInstance.put(`/tareas/${id}`, { estado: newStatus })

      // Actualizar el estado localmente
      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.id === id ? { ...tarea, estado: newStatus } : tarea
        )
      );
      setFilteredTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.id === id ? { ...tarea, estado: newStatus } : tarea
        )
      );
      toast({
        title: "Tarea actualizada",
        description: `La tarea ${id} ha sido marcada como ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado de la tarea.",
      });
    }
  };

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={["ADMIN", "jefe de brigada"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={["ADMIN", "jefe de brigada"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Tareas</h1>
            <Link href="/dashboard/jefe/tareas/crear">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar tareas..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en-progreso">En progreso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Tareas</CardTitle>
              <CardDescription>
                Gestiona las tareas de tu brigada
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTareas.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-2">
                    No se encontraron tareas
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Intenta con otros criterios de búsqueda
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTareas.map((tarea: Tarea) => (
                    <div
                      key={tarea.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          {tarea.estado === "completada" && (
                            <CheckSquare className="h-4 w-4 text-green-500" />
                          )}
                          {tarea.estado === "en-progreso" && (
                            <Clock className="h-4 w-4 text-amber-500" />
                          )}
                          {tarea.estado === "pendiente" && (
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                          )}
                          <p className="font-medium">{tarea.tipo_tarea}</p>
                          <Badge
                            variant={
                              tarea.estado === "completada"
                                ? "default"
                                : tarea.estado === "en-progreso"
                                ? "secondary"
                                : "outline"
                            }
                            className="ml-2"
                          >
                            {tarea.estado}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-1">
                          <p className="text-xs text-muted-foreground">
                            ID: {tarea.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Asignada a: {tarea.asignado_a}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Inicio: {tarea.fecha_inicio}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Fin: {tarea.fecha_fin}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ref: {tarea.id_investigacion}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/jefe/tareas/${tarea.id}`}>
                          <Button size="sm" variant="outline">
                            Detalles
                          </Button>
                        </Link>
                        {tarea.estado !== "completada" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                              handleUpdateStatus(tarea.id, tarea.estado)
                            }
                          >
                            {tarea.estado === "pendiente"
                              ? "Iniciar"
                              : "Completar"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
