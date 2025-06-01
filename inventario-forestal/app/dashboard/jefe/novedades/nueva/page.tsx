"use client";

import type React from "react";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function CrearNovedadPage() {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post("/novedades", {
        descripcion: formData.descripcion,
        fecha: new Date(),
        brigada_id: 1, // ¡hardcodeado y funciona!
      });

      toast({
        title: "Novedad creada",
        description: "La novedad ha sido creada exitosamente.",
      });

      router.push("/dashboard/jefe/novedades");
    } catch (error) {
      console.error("Error al crear novedad:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la novedad. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={["jefe de brigada"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/jefe/novedades">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">
                Crear Novedad
              </h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nueva Novedad</CardTitle>
              <CardDescription>
                Reporta cualquier situación importante que haya ocurrido durante
                las actividades de campo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título de la Novedad</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    placeholder="Ej: Condiciones climáticas adversas en sector A"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    maxLength={100}
                  />
                  <p className="text-sm text-muted-foreground">
                    Máximo 100 caracteres. Sé específico y claro.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción Detallada</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Describe en detalle lo ocurrido, incluyendo ubicación, hora, personas involucradas y cualquier acción tomada..."
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={6}
                    required
                    minLength={20}
                  />
                  <p className="text-sm text-muted-foreground">
                    Mínimo 20 caracteres. Incluye todos los detalles relevantes.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Información automática
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• La fecha y hora se registrarán automáticamente</li>
                    <li>• Se asociará a tu brigada actual</li>
                    <li>• Tu nombre aparecerá como autor de la novedad</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-2">
                  <Link href="/dashboard/jefe/novedades">
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
                      <>
                        <Bell className="mr-2 h-4 w-4" /> Crear Novedad
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
