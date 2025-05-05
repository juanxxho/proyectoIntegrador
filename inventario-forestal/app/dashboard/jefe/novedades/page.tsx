"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

export default function JefeNovedadesPage() {
  const [novedades, setNovedades] = useState([])
  const [filteredNovedades, setFilteredNovedades] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        setIsLoading(true)

        // En una implementación real, esta sería una llamada a tu microservicio
        // const response = await axios.get("/novedades/brigada")
        // setNovedades(response.data)

        // Simulamos datos para la demostración
        const data = [
          {
            id: "NOV-001",
            titulo: "Condiciones climáticas adversas",
            descripcion: "Lluvia intensa en el sector A que dificulta la recolección de muestras.",
            autor: "Juan Pérez",
            rol: "jefe_brigada",
            fecha: "Hoy, 10:30",
            tipo: "clima",
            investigacion: "INV-2023-042",
          },
          {
            id: "NOV-002",
            titulo: "Especie no identificada encontrada",
            descripcion: "Se encontró una especie que no coincide con el catálogo. Se requiere análisis adicional.",
            autor: "María López",
            rol: "botanico",
            fecha: "Hoy, 09:15",
            tipo: "hallazgo",
            investigacion: "INV-2023-042",
          },
          {
            id: "NOV-003",
            titulo: "Problema con equipo GPS",
            descripcion: "El GPS principal presenta fallas. Se está utilizando el equipo de respaldo.",
            autor: "Pedro Gómez",
            rol: "auxiliar",
            fecha: "Ayer, 16:45",
            tipo: "equipo",
            investigacion: "INV-2023-042",
          },
        ]

        setNovedades(data)
        setFilteredNovedades(data)
      } catch (error) {
        console.error("Error al cargar novedades:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las novedades.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNovedades()
  }, [toast])

  useEffect(() => {
    // Filtrar novedades según los criterios de búsqueda y tipo
    const filtered = novedades.filter((novedad: any) => {
      const matchesSearch =
        novedad.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        novedad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        novedad.autor.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "todos" || novedad.tipo === typeFilter

      return matchesSearch && matchesType
    })

    setFilteredNovedades(filtered)
  }, [searchTerm, typeFilter, novedades])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value)
  }

  const getTipoNovedad = (tipo: string) => {
    switch (tipo) {
      case "clima":
        return { label: "Clima", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" }
      case "hallazgo":
        return { label: "Hallazgo", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" }
      case "equipo":
        return { label: "Equipo", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" }
      case "acceso":
        return { label: "Acceso", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" }
      case "personal":
        return { label: "Personal", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" }
      default:
        return { label: "Otro", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" }
    }
  }

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={["jefe_brigada"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard allowedRoles={["jefe_brigada"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Novedades</h1>
            <Link href="/dashboard/jefe/novedades/crear">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nueva Novedad
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar novedades..."
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
                  <SelectItem value="clima">Clima</SelectItem>
                  <SelectItem value="hallazgo">Hallazgo</SelectItem>
                  <SelectItem value="equipo">Equipo</SelectItem>
                  <SelectItem value="acceso">Acceso</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredNovedades.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-2">No se encontraron novedades</p>
                  <p className="text-sm text-muted-foreground">Intenta con otros criterios de búsqueda</p>
                </CardContent>
              </Card>
            ) : (
              filteredNovedades.map((novedad: any) => (
                <Card key={novedad.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {novedad.titulo}
                      <Badge className={getTipoNovedad(novedad.tipo).color}>{getTipoNovedad(novedad.tipo).label}</Badge>
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{novedad.autor.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{novedad.autor}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{novedad.descripcion}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">{novedad.fecha}</span>
                      <Link href={`/dashboard/jefe/novedades/${novedad.id}`}>
                        <Button size="sm">Ver detalles</Button>
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
