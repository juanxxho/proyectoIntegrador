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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function CrearNovedadPage() {
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      /* await axiosInstance.post("/novedades", {
        descripcion,
        fecha: new Date().toISOString(),
        brigada_id: 1,
      });*/

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
          <div className="flex items-center gap-2">
            <Link href="/dashboard/jefe/novedades">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Crear Novedad</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nueva Novedad</CardTitle>
              <CardDescription>
                Reporta cualquier situación importante que haya ocurrido durante
                las actividades de campo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción Detallada</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Incluye lugar, hora, personas involucradas, acciones tomadas, etc."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Bell className="mr-2 h-4 w-4" />
                        Crear Novedad
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
