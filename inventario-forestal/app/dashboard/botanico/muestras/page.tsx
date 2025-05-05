"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import AuthGuard from "@/components/auth/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function MuestrasPage() {
  const [muestras, setMuestras] = useState([])
  const [filteredMuestras, setFilteredMuestras] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMuestras = async () => {
      try {
        setIsLoading(true)

        // En una implementación real, esta sería una llamada a tu microservicio
        // const response = await axios.get("/muestras")
        // setMuestras(response.data)

        // Simulamos datos para la demostración
        const data = [
          {
            id: "M-2023-156",
            nombre: "Ceiba pentandra",
            nombreComun: "Ceiba",
            ubicacion: "Sector A, Punto 3",
            fecha: "Hoy",
            estado: "procesada",
            investigacion: "INV-2023-042",
          },
          {
            id: "M-2023-155",
            nombre: "Swietenia macrophylla",
            nombreComun: "Caoba",
            ubicacion: "Sector A, Punto 2",
            fecha: "Hoy",
            estado: "procesada",
            investigacion: "INV-2023-042",
          },
          {
            id: "M-2023-154",
            nombre: "Tabebuia rosea",
            nombreComun: "Roble",
            ubicacion: "Sector A, Punto 1",
            fecha: "Ayer",
            estado: "procesada",
            investigacion: "INV-2023-042",
          },
          {
            id: "M-2023-153",
            nombre: "Especie no identificada",
            nombreComun: "Pendiente",
            ubicacion: "Sector B, Punto 4",
            fecha: "Ayer",
            estado: "pendiente",
            investigacion: "INV-2023-042",
          },
          {
            id: "M-2023-152",
            nombre: "Cordia alliodora",
            nombreComun: "Laurel",
            ubicacion: "Sector B, Punto 3",
            fecha: "18/04/2023",
            estado: "procesada",
            investigacion: "INV-2023-042",
          },
          {
            id: "M-2023-151",
            nombre: "Especie no identificada",
            nombreComun: "Pendiente",
            ubicacion: "Sector B, Punto 2",
            fecha: "18/04/2023",
            estado: "pendiente",
            investigacion: "INV-2023-042",
          },
        ]

        setMuestras(data)
        setFilteredMuestras(data)
      } catch (error) {
        console.error("Error al cargar muestras:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las muestras.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMuestras()
  }, [toast])

  useEffect(() => {
    // Filtrar muestras según los criterios de búsqueda y estado
    const filtered = muestras.filter((muestra: any) => {
      const matchesSearch =
        muestra.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        muestra.nombreComun.toLowerCase().includes(searchTerm.toLowerCase()) ||
        muestra.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "todos" || muestra.estado === statusFilter

      return matchesSearch && matchesStatus
    })

    setFilteredMuestras(filtered)
  }, [searchTerm, statusFilter, muestras])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
  }

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={["administrador", "botanico"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard allowedRoles={["administrador", "botanico"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Muestras Botánicas</h1>
            <Link href="/dashboard/botanico/muestras/nueva">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nueva Muestra
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar muestras..."
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
                  <SelectItem value="procesada">Procesada</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMuestras.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-2">No se encontraron muestras</p>
                  <p className="text-sm text-muted-foreground">Intenta con otros criterios de búsqueda</p>
                </CardContent>
              </Card>
            ) : (
              filteredMuestras.map((muestra: any) => (
                <Card key={muestra.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{muestra.nombre}</CardTitle>
                      <Badge variant={muestra.estado === "procesada" ? "outline" : "secondary"}>{muestra.estado}</Badge>
                    </div>
                    <CardDescription>
                      {muestra.nombreComun} • ID: {muestra.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{muestra.ubicacion}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{muestra.fecha}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Investigación:</span>
                      <span>{muestra.investigacion}</span>
                    </div>
                    <div className="mt-4">
                      <Link href={`/dashboard/botanico/muestras/${muestra.id}`}>
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
