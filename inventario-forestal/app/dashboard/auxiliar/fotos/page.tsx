"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import AuthGuard from "@/components/auth/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Camera, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function FotosPage() {
  const [fotos, setFotos] = useState([])
  const [filteredFotos, setFilteredFotos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        setIsLoading(true)

        // En una implementación real, esta sería una llamada a tu microservicio
        // const response = await axios.get("/fotos")
        // setFotos(response.data)

        // Simulamos datos para la demostración
        const data = [
          {
            id: "F-2023-086",
            titulo: "Ceiba pentandra - Vista general",
            ubicacion: "Sector A, Punto 3",
            fecha: "Hoy",
            tipo: "Especie",
            investigacion: "INV-2023-042",
          },
          {
            id: "F-2023-085",
            titulo: "Ceiba pentandra - Detalle de hojas",
            ubicacion: "Sector A, Punto 3",
            fecha: "Hoy",
            tipo: "Detalle",
            investigacion: "INV-2023-042",
          },
          {
            id: "F-2023-084",
            titulo: "Swietenia macrophylla - Vista general",
            ubicacion: "Sector A, Punto 2",
            fecha: "Hoy",
            tipo: "Especie",
            investigacion: "INV-2023-042",
          },
          {
            id: "F-2023-083",
            titulo: "Panorámica Sector A",
            ubicacion: "Sector A, Punto 1",
            fecha: "Ayer",
            tipo: "Paisaje",
            investigacion: "INV-2023-042",
          },
          {
            id: "F-2023-082",
            titulo: "Condiciones del suelo Sector B",
            ubicacion: "Sector B, Punto 1",
            fecha: "Ayer",
            tipo: "Ambiente",
            investigacion: "INV-2023-042",
          },
          {
            id: "F-2023-081",
            titulo: "Tabebuia rosea - Detalle de flores",
            ubicacion: "Sector A, Punto 1",
            fecha: "Ayer",
            tipo: "Detalle",
            investigacion: "INV-2023-042",
          },
        ]

        setFotos(data)
        setFilteredFotos(data)
      } catch (error) {
        console.error("Error al cargar fotos:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las fotografías.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFotos()
  }, [toast])

  useEffect(() => {
    // Filtrar fotos según los criterios de búsqueda y tipo
    const filtered = fotos.filter((foto: any) => {
      const matchesSearch =
        foto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        foto.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "todos" || foto.tipo === typeFilter

      return matchesSearch && matchesType
    })

    setFilteredFotos(filtered)
  }, [searchTerm, typeFilter, fotos])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value)
  }

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={["administrador", "auxiliar"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard allowedRoles={["administrador", "auxiliar"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Fotografías</h1>
            <Link href="/dashboard/auxiliar/fotos/nueva">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nueva Fotografía
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar fotografías..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="Especie">Especie</SelectItem>
                  <SelectItem value="Detalle">Detalle</SelectItem>
                  <SelectItem value="Paisaje">Paisaje</SelectItem>
                  <SelectItem value="Ambiente">Ambiente</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFotos.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-2">No se encontraron fotografías</p>
                  <p className="text-sm text-muted-foreground">Intenta con otros criterios de búsqueda</p>
                </CardContent>
              </Card>
            ) : (
              filteredFotos.map((foto: any) => (
                <Card key={foto.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Camera className="h-8 w-8" />
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{foto.titulo}</CardTitle>
                    </div>
                    <CardDescription>
                      ID: {foto.id} • Tipo: {foto.tipo}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{foto.ubicacion}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{foto.fecha}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Investigación:</span>
                      <span>{foto.investigacion}</span>
                    </div>
                    <div className="mt-4">
                      <Link href={`/dashboard/auxiliar/fotos/${foto.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Ver detalles
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
  )
}
