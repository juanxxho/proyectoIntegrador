"use client";

import React, { useState, useEffect } from "react";
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
import { Loader2, Leaf, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

const CODIGOS_PREDEFINIDOS = ["COD-001", "COD-002", "COD-003"];
const ESPECIES_PREDEFINIDAS = [
  "Quercus robur",
  "Pinus sylvestris",
  "Eucalyptus globulus",
];

export default function NuevaMuestraPage() {
  const [formData, setFormData] = useState({
    codigo: "",
    especie: "",
    ubicacion: "",
    fecha: "",
    botanico_id: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Setear fecha actual
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, fecha: today }));

    // Obtener ubicación actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
          setFormData((prev) => ({ ...prev, ubicacion: coords }));
        },
        (error) => {
          console.error("Error al obtener ubicación:", error);
        }
      );
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post("/muestras", formData);

      toast({
        title: "Muestra registrada",
        description: "La muestra ha sido registrada exitosamente.",
      });

      router.push("/dashboard/botanico/muestras");
    } catch (error) {
      console.error("Error al registrar muestra:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar la muestra. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={["botanico"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/botanico/muestras">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Nueva Muestra</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Completa los datos mínimos para registrar una nueva muestra.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <select
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Selecciona un código</option>
                    {CODIGOS_PREDEFINIDOS.map((codigo) => (
                      <option key={codigo} value={codigo}>
                        {codigo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especie">Especie</Label>
                  <select
                    id="especie"
                    name="especie"
                    value={formData.especie}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Selecciona una especie</option>
                    {ESPECIES_PREDEFINIDAS.map((especie) => (
                      <option key={especie} value={especie}>
                        {especie}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación (coordenadas)</Label>
                  <Input
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    readOnly
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    name="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Link href="/dashboard/botanico/muestras">
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
                        Registrando...
                      </>
                    ) : (
                      <>
                        <Leaf className="mr-2 h-4 w-4" />
                        Registrar Muestra
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
