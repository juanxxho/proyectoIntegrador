"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import AuthGuard from "@/components/auth/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

// Definir interfaces para TypeScript
interface Investigacion {
  id: string | number;
  nombre: string;
}

interface Material {
  id: number;
  nombre_material: string;
  cantidad: string;
  observaciones: string;
}

export default function NuevoInventarioPage() {
  const [investigacionId, setInvestigacionId] = useState<string>("");
  const [materiales, setMateriales] = useState<Material[]>([
    {
      id: 1,
      nombre_material: "",
      cantidad: "",
      observaciones: "",
    },
  ]);
  const [investigaciones, setInvestigaciones] = useState<Investigacion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingInvestigaciones, setIsLoadingInvestigaciones] =
    useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();

  // Opciones predefinidas para materiales
  const materialesPreDefinidos = [
    { id: "gps", nombre: "GPS Garmin" },
    { id: "brujula", nombre: "Brújula" },
    { id: "cinta_metrica", nombre: "Cinta métrica" },
    { id: "camara", nombre: "Cámara fotográfica" },
    { id: "binoculares", nombre: "Binoculares" },
    { id: "clinometro", nombre: "Clinómetro" },
    { id: "barreno", nombre: "Barreno" },
    { id: "radio", nombre: "Radio comunicador" },
    { id: "machete", nombre: "Machete" },
    { id: "bolsas", nombre: "Bolsas para muestras" },
    { id: "libreta", nombre: "Libreta de campo" },
    { id: "lapiz", nombre: "Lápices" },
    { id: "regla", nombre: "Regla" },
    { id: "linterna", nombre: "Linterna" },
    { id: "pilas", nombre: "Pilas" },
  ];

  // Cargar investigaciones al iniciar
  useEffect(() => {
    const fetchInvestigaciones = async () => {
      try {
        const response = await axiosInstance.get("/investigaciones");
        setInvestigaciones(response.data);
      } catch (error) {
        console.error("Error al cargar investigaciones:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las investigaciones.",
        });
      } finally {
        setIsLoadingInvestigaciones(false);
      }
    };

    fetchInvestigaciones();
  }, [toast]);

  const handleMaterialChange = (id: number, field: string, value: string) => {
    setMateriales((prevMateriales) =>
      prevMateriales.map((material) =>
        material.id === id ? { ...material, [field]: value } : material
      )
    );
  };

  const handleAddMaterial = () => {
    const newId =
      materiales.length > 0
        ? Math.max(...materiales.map((material) => material.id)) + 1
        : 1;
    setMateriales([
      ...materiales,
      {
        id: newId,
        nombre_material: "",
        cantidad: "",
        observaciones: "",
      },
    ]);
  };

  const handleRemoveMaterial = (id: number) => {
    if (materiales.length > 1) {
      setMateriales(materiales.filter((material) => material.id !== id));
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe haber al menos un material en el inventario.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar que todos los materiales tengan nombre y cantidad
      const materialesIncompletos = materiales.filter(
        (material) => !material.nombre_material.trim() || !material.cantidad
      );

      if (materialesIncompletos.length > 0) {
        throw new Error("Todos los materiales deben tener nombre y cantidad");
      }

      // Preparar datos para enviar al backend
      const datosInventario = {
        investigacion_id: investigacionId || null,
        materiales: materiales.map((material) => ({
          nombre_material: material.nombre_material,
          cantidad: material.cantidad,
          observaciones: material.observaciones,
        })),
      };

      await axiosInstance.post("/inventarios/crear-multiple", datosInventario);

      toast({
        title: "Inventario creado",
        description: `Se han agregado ${materiales.length} materiales al inventario exitosamente.`,
      });

      router.push("/dashboard/admin/inventario");
    } catch (error: any) {
      console.error("Error al crear inventario:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message ||
          "No se pudo crear el inventario. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={["administrador"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/admin/inventario">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">
                Nuevo Inventario
              </h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información del Inventario</CardTitle>
              <CardDescription>
                Agrega múltiples materiales al inventario. Todos los materiales
                se asociarán con la misma investigación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="investigacion_id">Investigación</Label>
                  <Select
                    value={investigacionId}
                    onValueChange={setInvestigacionId}
                    disabled={isLoadingInvestigaciones}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingInvestigaciones
                            ? "Cargando..."
                            : "Selecciona una investigación"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {investigaciones.map((inv) => (
                        <SelectItem key={inv.id} value={String(inv.id)}>
                          {inv.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Investigación a la que se asignarán todos los materiales
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Materiales del Inventario
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddMaterial}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Agregar Material
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {materiales.map((material) => (
                      <div
                        key={material.id}
                        className="grid grid-cols-1 gap-4 border p-4 rounded-md"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`material-${material.id}-nombre`}>
                              Nombre del Material *
                            </Label>
                            <Select
                              value={material.nombre_material}
                              onValueChange={(value) =>
                                handleMaterialChange(
                                  material.id,
                                  "nombre_material",
                                  value
                                )
                              }
                            >
                              <SelectTrigger
                                id={`material-${material.id}-nombre`}
                              >
                                <SelectValue placeholder="Selecciona un material" />
                              </SelectTrigger>
                              <SelectContent>
                                {materialesPreDefinidos.map((mat) => (
                                  <SelectItem key={mat.id} value={mat.nombre}>
                                    {mat.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`material-${material.id}-cantidad`}>
                              Cantidad *
                            </Label>
                            <Select
                              value={material.cantidad}
                              onValueChange={(value) =>
                                handleMaterialChange(
                                  material.id,
                                  "cantidad",
                                  value
                                )
                              }
                            >
                              <SelectTrigger
                                id={`material-${material.id}-cantidad`}
                              >
                                <SelectValue placeholder="Selecciona cantidad" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 50, 100,
                                ].map((num) => (
                                  <SelectItem key={num} value={String(num)}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor={`material-${material.id}-observaciones`}
                            >
                              Estado
                            </Label>
                            <Select
                              value={material.observaciones}
                              onValueChange={(value) =>
                                handleMaterialChange(
                                  material.id,
                                  "observaciones",
                                  value
                                )
                              }
                            >
                              <SelectTrigger
                                id={`material-${material.id}-observaciones`}
                              >
                                <SelectValue placeholder="Selecciona estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Nuevo">Nuevo</SelectItem>
                                <SelectItem value="Buen estado">
                                  Buen estado
                                </SelectItem>
                                <SelectItem value="Regular">Regular</SelectItem>
                                <SelectItem value="Requiere mantenimiento">
                                  Requiere mantenimiento
                                </SelectItem>
                                <SelectItem value="Dañado">Dañado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMaterial(material.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Eliminar material
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link href="/dashboard/admin/inventario">
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-green-700 hover:bg-green-800"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Creando...
                      </>
                    ) : (
                      `Crear ${materiales.length} ${
                        materiales.length === 1 ? "material" : "materiales"
                      }`
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
