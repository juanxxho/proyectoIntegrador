"use client";

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
import { Loader2, ArrowLeft, CalendarIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

interface MiembroBrigada {
  id: number;
  nombre: string;
  rol: string;
}

export default function JefeNuevaTareaPage() {
  const [formData, setFormData] = useState({
    tipo_tarea: "",
    asignado_a: "",
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    estado: "pendiente",
    id_investigacion: null as number | null,
  });

  const [miembrosBrigada, setMiembrosBrigada] = useState<MiembroBrigada[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchMiembrosBrigada = async () => {
      try {
        setIsLoadingData(true);
        const token = localStorage.getItem("token");

        const userResponse = await axiosInstance.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userResponse.data;

        const brigadasResponse = await axiosInstance.get("/brigadas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const brigadas = brigadasResponse.data;

        const miBrigada = brigadas.find(
          (brigada) => brigada.jefe_brigada_id === userData.user.id_ideam
        );

        if (miBrigada) {
          console.log("Brigada encontrada:", miBrigada);

          let idInvestigacion = miBrigada.id_investigacion;

          if (!idInvestigacion && miBrigada.id) {
            try {
              const investigacionResponse = await axiosInstance.get(
                `/investigaciones/brigada/${miBrigada.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              idInvestigacion = investigacionResponse.data?.id || null;
            } catch (fetchError) {
              console.warn(
                "No se pudo obtener id_investigacion desde API:",
                fetchError
              );
            }
          }

          setFormData((prev) => ({
            ...prev,
            id_investigacion: idInvestigacion,
          }));

          const miembrosResponse = await axiosInstance.get(
            `/brigadas/miembros/${miBrigada.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setMiembrosBrigada(miembrosResponse.data);
        }
      } catch (error) {
        console.error("Error cargando miembros de brigada:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchMiembrosBrigada();
  }, []);

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
        tipo_tarea: formData.tipo_tarea,
        asignado_a: Number(formData.asignado_a),
        fecha_inicio: formData.fecha_inicio.toISOString().split("T")[0],
        fecha_fin: formData.fecha_fin.toISOString().split("T")[0],
        estado: formData.estado,
        id_investigacion: formData.id_investigacion,
      };

      console.log("Datos a enviar:", dataToSend);
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

  if (isLoadingData) {
    return (
      <AuthGuard allowedRoles={["jefe de brigada"]}>
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
    <AuthGuard allowedRoles={["jefe de brigada"]}>
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
                    disabled={miembrosBrigada.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un miembro de tu brigada" />
                    </SelectTrigger>
                    <SelectContent>
                      {miembrosBrigada.map((miembro) => (
                        <SelectItem
                          key={miembro.id}
                          value={miembro.id.toString()}
                        >
                          {miembro.nombre} ({miembro.rol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {miembrosBrigada.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      No hay miembros disponibles en tu brigada.
                    </p>
                  )}
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
                          {formData.fecha_inicio
                            ? format(formData.fecha_inicio, "PPP", {
                                locale: es,
                              })
                            : "Selecciona fecha de inicio"}
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
                          {formData.fecha_fin
                            ? format(formData.fecha_fin, "PPP", {
                                locale: es,
                              })
                            : "Selecciona fecha de fin"}
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

                <div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Asignando...
                      </>
                    ) : (
                      "Asignar Tarea"
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
