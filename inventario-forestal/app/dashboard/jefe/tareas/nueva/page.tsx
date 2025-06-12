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
import { Loader2, CheckSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

interface Investigacion {
  id: number;
  nombre: string;
}

interface MiembroBrigada {
  id: number;
  nombre: string;
  rol: string;
}

export default function JefeNuevaTareaPage() {
  const [formData, setFormData] = useState({
    id_investigacion: "",
    tipo_tarea: "",
    asignado_a: "",
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    estado: "pendiente",
  });
  const [investigaciones, setInvestigaciones] = useState<Investigacion[]>([]);
  const [miembrosBrigada, setMiembrosBrigada] = useState<MiembroBrigada[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const token = localStorage.getItem("token");

        // Cargar investigaciones
        const investigacionesResponse = await axiosInstance.get(
          "/investigaciones"
        );
        setInvestigaciones(investigacionesResponse.data);

        // Obtener información del usuario logueado para saber qué brigada lidera
        const userResponse = await fetch("http://localhost/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await userResponse.json();

        // Buscar la brigada donde este usuario es jefe
        const brigadasResponse = await fetch("http://localhost/brigadas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const brigadas = await brigadasResponse.json();

        const miBrigada = brigadas.find(
          (brigada: any) => brigada.jefe_brigada_id === userData.id
        );

        if (miBrigada) {
          // Cargar los miembros de la brigada
          const miembros: MiembroBrigada[] = [];

          // Agregar botánico si existe
          if (miBrigada.botanico_id) {
            const botanicoResponse = await fetch(
              `http://localhost/usuarios/${miBrigada.botanico_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const botanico = await botanicoResponse.json();
            miembros.push({
              id: botanico.id,
              nombre: botanico.nombre,
              rol: "Botánico",
            });
          }

          // Agregar auxiliar si existe
          if (miBrigada.auxiliar_id) {
            const auxiliarResponse = await fetch(
              `http://localhost/usuarios/${miBrigada.auxiliar_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const auxiliar = await auxiliarResponse.json();
            miembros.push({
              id: auxiliar.id,
              nombre: auxiliar.nombre,
              rol: "Auxiliar Técnico",
            });
          }

          // Agregar coinvestigador si existe
          if (miBrigada.coinvestigador_id) {
            const coinvestigadorResponse = await fetch(
              `http://localhost/usuarios/${miBrigada.coinvestigador_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const coinvestigador = await coinvestigadorResponse.json();
            miembros.push({
              id: coinvestigador.id,
              nombre: coinvestigador.nombre,
              rol: "Coinvestigador",
            });
          }

          setMiembrosBrigada(miembros);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos necesarios.",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        id_investigacion: Number.parseInt(formData.id_investigacion),
        tipo_tarea: formData.tipo_tarea,
        asignado_a: Number.parseInt(formData.asignado_a), // Enviamos el ID del usuario
        fecha_inicio: formData.fecha_inicio.toISOString().split("T")[0],
        fecha_fin: formData.fecha_fin.toISOString().split("T")[0],
        estado: formData.estado,
      };

      console.log("Enviando datos:", dataToSend);

      await axiosInstance.post("/tareas/crear", dataToSend);

      toast({
        title: "Tarea asignada",
        description: "La tarea ha sido asignada exitosamente.",
      });

      router.push("/dashboard/jefe/tareas");
    } catch (error) {
      console.error("Error al crear tarea:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo asignar la tarea. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tiposTarea = [
    "Recolección de muestras",
    "Fotografía de especies",
    "Medición de árboles",
    "Registro de coordenadas",
    "Identificación de especies",
    "Análisis de suelo",
    "Inventario de equipos",
    "Mantenimiento de equipos",
    "Elaboración de reportes",
    "Supervisión de campo",
  ];

  if (isLoadingData) {
    return (
      <AuthGuard allowedRoles={["jefe_brigada"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Cargando datos...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={["jefe_brigada"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/jefe/tareas">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">
                Asignar Nueva Tarea
              </h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información de la Tarea</CardTitle>
              <CardDescription>
                Asigna una nueva tarea a los miembros de tu brigada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="id_investigacion">Investigación</Label>
                    <Select
                      value={formData.id_investigacion}
                      onValueChange={(value) =>
                        handleSelectChange("id_investigacion", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una investigación" />
                      </SelectTrigger>
                      <SelectContent>
                        {investigaciones.map((inv) => (
                          <SelectItem key={inv.id} value={inv.id.toString()}>
                            {inv.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo_tarea">Tipo de Tarea</Label>
                    <Select
                      value={formData.tipo_tarea}
                      onValueChange={(value) =>
                        handleSelectChange("tipo_tarea", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de tarea" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposTarea.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asignado_a">
                    Asignar a (Miembro de la Brigada)
                  </Label>
                  <Select
                    value={formData.asignado_a}
                    onValueChange={(value) =>
                      handleSelectChange("asignado_a", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un miembro de tu brigada" />
                    </SelectTrigger>
                    <SelectContent>
                      {miembrosBrigada.length > 0 ? (
                        miembrosBrigada.map((miembro) => (
                          <SelectItem
                            key={miembro.id}
                            value={miembro.id.toString()}
                          >
                            {miembro.nombre} ({miembro.rol})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No hay miembros disponibles en tu brigada
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.fecha_inicio && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.fecha_inicio ? (
                            format(formData.fecha_inicio, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona fecha de inicio</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.fecha_inicio}
                          onSelect={(date) =>
                            handleDateChange("fecha_inicio", date)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_fin">Fecha de Fin</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.fecha_fin && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.fecha_fin ? (
                            format(formData.fecha_fin, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona fecha de fin</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.fecha_fin}
                          onSelect={(date) =>
                            handleDateChange("fecha_fin", date)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link href="/dashboard/jefe/tareas">
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-green-700 hover:bg-green-800"
                    disabled={
                      isLoading ||
                      !formData.id_investigacion ||
                      !formData.tipo_tarea ||
                      !formData.asignado_a
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Asignando...
                      </>
                    ) : (
                      <>
                        <CheckSquare className="mr-2 h-4 w-4" /> Asignar Tarea
                      </>
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
