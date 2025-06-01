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
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axios";

interface Novedad {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  brigada_id: number;
}

export default function JefeNovedadesPage() {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [filteredNovedades, setFilteredNovedades] = useState<Novedad[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        setIsLoading(true);

        // Obtener datos del usuario logueado
        const userResponse = await axiosInstance.get("/auth/profile");
        const jefeId: number = userResponse.data.id_ideam;

        // Obtener brigada asociada al jefe
        const brigadaResponse = await axiosInstance.get(
          `/brigadas/jefe/${jefeId}`
        );
        const brigada = brigadaResponse.data;

        if (brigada && brigada.id) {
          // Obtener novedades asociadas a la brigada
          const novedadesResponse = await axiosInstance.get<Novedad[]>(
            `/novedades/1`
          );

          setNovedades(novedadesResponse.data);
          setFilteredNovedades(novedadesResponse.data);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se encontró la brigada asociada al jefe.",
          });
          setNovedades([]);
          setFilteredNovedades([]);
        }
      } catch (error) {
        console.error("Error al cargar novedades:", error);

        // Datos simulados mientras se arregla el backend
        const data: Novedad[] = [
          {
            id: 1,
            titulo: "Condiciones climáticas adversas",
            descripcion:
              "Lluvia intensa en el sector A que dificulta la recolección de muestras.",
            fecha: "2024-01-15T10:30:00.000Z",
            brigada_id: 1,
          },
          {
            id: 2,
            titulo: "Especie no identificada encontrada",
            descripcion:
              "Se encontró una especie que no coincide con el catálogo. Se requiere análisis adicional.",
            fecha: "2024-01-15T09:15:00.000Z",
            brigada_id: 1,
          },
          {
            id: 3,
            titulo: "Problema con equipo GPS",
            descripcion:
              "El GPS principal presenta fallas. Se está utilizando el equipo de respaldo.",
            fecha: "2024-01-14T16:45:00.000Z",
            brigada_id: 1,
          },
        ];

        setNovedades(data);
        setFilteredNovedades(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNovedades();
  }, [toast]);

  useEffect(() => {
    const filtered = novedades.filter((novedad) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        novedad.titulo.toLowerCase().includes(lowerSearch) ||
        novedad.descripcion.toLowerCase().includes(lowerSearch)
      );
    });

    setFilteredNovedades(filtered);
  }, [searchTerm, novedades]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={["jefe de brigada"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
            <h1 className="text-3xl font-bold tracking-tight">
              Novedades de la Brigada
            </h1>
            <Link href="/dashboard/jefe/novedades/nueva" passHref>
              <Button className="bg-green-700 hover:bg-green-800" asChild>
                <a>
                  <Plus className="mr-2 h-4 w-4" /> Nueva Novedad
                </a>
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar novedades por título o descripción..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Buscar novedades"
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredNovedades.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-2">
                    No se encontraron novedades
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm
                      ? "Intenta con otros términos de búsqueda"
                      : "Aún no hay novedades registradas"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNovedades.map((novedad) => (
                <Card
                  key={novedad.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{novedad.titulo}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatFecha(novedad.fecha)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {novedad.descripcion}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <User className="h-3 w-3" />
                        Brigada #{novedad.brigada_id}
                      </Badge>
                      <Link
                        href={`/dashboard/jefe/novedades/${novedad.id}`}
                        passHref
                      >
                        <Button size="sm" variant="outline" asChild>
                          <a>Ver detalles</a>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
