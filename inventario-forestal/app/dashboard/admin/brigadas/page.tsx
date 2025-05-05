"use client"

import type React from "react"
import axiosInstance from "@/lib/axios"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import AuthGuard from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"


export default function BrigadasPage() {
  const [brigadas, setBrigadas] = useState([])
  const [filteredBrigadas, setFilteredBrigadas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBrigada, setSelectedBrigada] = useState(null)  // Para guardar la brigada seleccionada
  const { toast } = useToast()

interface Investigador {
  id: number;
  nombre: string;
  rol: string;
}

interface Brigada {
  id: number;
  nombre: string;
  estado: string;
  jefe_brigada?: Investigador;
  botanico?: Investigador;
  auxiliar?: Investigador;
  coinvestigador?: Investigador;
}
  useEffect(() => {
    const fetchBrigadas = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        const response = await axiosInstance.get("/brigadas", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        setBrigadas(response.data)
        setFilteredBrigadas(response.data)
      } catch (error) {
        console.error("Error al cargar brigadas:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las brigadas.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchBrigadas()
  }, [toast])

  useEffect(() => {
    const filtered = brigadas.filter((brigada: any) => {
      const matchesSearch =
        brigada.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brigada.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "todos" || brigada.estado === statusFilter
      return matchesSearch && matchesStatus
    })

    setFilteredBrigadas(filtered)
  }, [searchTerm, statusFilter, brigadas])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
  }

  const handleViewDetails = async (brigadaId: number) => {
    try {
      const response = await axiosInstance.get(`/brigadas/${brigadaId}`)
      setSelectedBrigada(response.data)  // Guardar la brigada seleccionada
    } catch (error) {
      console.error("Error al cargar los detalles de la brigada:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los detalles de la brigada.",
      })
    }
  }

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={["administrador"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard allowedRoles={["administrador"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Brigadas</h1>
            <Link href="/dashboard/admin/brigadas/nueva">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nueva Brigada
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar brigadas..."
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
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="ocupada">Ocupada</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredBrigadas.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-2">No se encontraron brigadas</p>
                  <p className="text-sm text-muted-foreground">Intenta con otros criterios de búsqueda</p>
                </CardContent>
              </Card>
            ) : (
              filteredBrigadas.map((brigada: any) => (
                <Card key={brigada.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{brigada.nombre}</CardTitle>
                        <CardDescription className="mt-1">ID: {brigada.id}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className={
                            brigada.estado === "ocupada"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          }
                        >
                          {brigada.estado === "ocupada" ? "Ocupada" : "Disponible"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {brigada.estado === "ocupada" && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Investigación asignada:</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm">{brigada.investigacionTitulo}</p>
                          <Badge variant="outline">{brigada.investigacion}</Badge>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => handleViewDetails(brigada.id)}>Ver detalles</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Sección de detalles de la brigada */}
          {selectedBrigada && (
            <div className="fixed top-0 left-0 right-0 bg-white p-4 shadow-lg z-50">
              <h2 className="text-2xl font-semibold mb-4">Detalles de la Brigada</h2>
              <ul>
  {Object.entries(selectedBrigada).map(([key, value]) => {
    if (key !== "id" && key !== "nombre" && key !== "estado") {
      const investigador = value as Investigador; // Esto le dice a TypeScript que 'value' es un 'Investigador'
      return (
        <li key={key} className="mb-2">
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
          <ul>
            <li>ID: {investigador.id}</li>
            <li>Nombre: {investigador.nombre}</li>
            <li>Rol: {investigador.rol}</li>
          </ul>
        </li>
      )
    }
  })}
</ul>

              <Button onClick={() => setSelectedBrigada(null)}>Cerrar</Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
