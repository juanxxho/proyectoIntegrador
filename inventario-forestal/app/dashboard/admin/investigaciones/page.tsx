"use client"

import type React from "react"
import axiosInstance from "@/lib/axios"  // Ajusta la ruta de acuerdo a la ubicación de tu archivo
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import AuthGuard from "@/components/auth/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Clock, AlertTriangle, Plus, Search, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"



export default function InvestigacionesPage() {
  const [investigaciones, setInvestigaciones] = useState([])
  const [filteredInvestigaciones, setFilteredInvestigaciones] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [brigadas, setBrigadas] = useState<{ id: number, nombre: string }[]>([])

  const fetchBrigadas = async () => {
    try {
      const response = await axiosInstance.get("/brigadas")
      setBrigadas(response.data)
    } catch (error) {
      console.error("Error al cargar brigadas:", error)
    }
  }
  useEffect(() => {
    const fetchInvestigaciones = async () => {
      try {
        setIsLoading(true)
  
        const response = await axiosInstance.get("/investigaciones")
        const data = response.data
  
        setInvestigaciones(data)
        setFilteredInvestigaciones(data)
      } catch (error) {
        console.error("Error al cargar investigaciones:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las investigaciones.",
        })
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchInvestigaciones()
    fetchBrigadas()
  }, [toast])
  useEffect(() => {
    // Filtrar investigaciones según los criterios de búsqueda y estado
    const filtered = investigaciones.filter((inv: any) => {
      const nombre = inv.nombre ?? ""
      const id = inv.id?.toString() ?? ""
    
      const matchesSearch =
        nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.toLowerCase().includes(searchTerm.toLowerCase())
    
      const matchesStatus = statusFilter === "todos" || inv.estado === statusFilter
    
      return matchesSearch && matchesStatus
    })
    
    

    setFilteredInvestigaciones(filtered)
  }, [searchTerm, statusFilter, investigaciones])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
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
            <h1 className="text-3xl font-bold tracking-tight">Investigaciones</h1>
            <Link href="/dashboard/admin/investigaciones/nueva">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nueva Investigación
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar investigaciones..."
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
                  <SelectItem value="en-progreso">En progreso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredInvestigaciones.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-2">No se encontraron investigaciones</p>
                  <p className="text-sm text-muted-foreground">Intenta con otros criterios de búsqueda</p>
                </CardContent>
              </Card>
            ) : (
              filteredInvestigaciones.map((investigacion: any) => (
                <Card key={investigacion.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{investigacion.nombre}</CardTitle>
                        <CardDescription className="mt-1">ID: {investigacion.id}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        {investigacion.estado === "en-progreso" && (
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                          >
                            <Clock className="mr-1 h-3 w-3" /> En progreso
                          </Badge>
                        )}
                        {investigacion.estado === "completada" && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Completada
                          </Badge>
                        )}
                        {investigacion.estado === "pendiente" && (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          >
                            <AlertTriangle className="mr-1 h-3 w-3" /> Pendiente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{investigacion.descripcion}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Brigada</p>
                        <p className="text-sm text-muted-foreground">  {brigadas.find(b => b.id === investigacion.brigada_id)?.nombre || "Sin asignar"}</p>


                      </div>
                      <div>
                        <p className="text-sm font-medium">Fecha de inicio</p>
                        <p className="text-sm text-muted-foreground">{investigacion.fecha_inicio}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Fecha de finalización</p>
                        <p className="text-sm text-muted-foreground">  {investigacion.fechaFin || "No ha terminado"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Municipio</p>
                        <p className="text-sm text-muted-foreground">  {investigacion.municipio}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Departamento</p>
                        <p className="text-sm text-muted-foreground">  {investigacion.departamento}</p>
                      </div>
                    </div>

                    {investigacion.estado !== "pendiente" && (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progreso:</span>
                          <span className="font-medium">{investigacion.progreso}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${investigacion.estado === "completada" ? "bg-green-500" : "bg-amber-500"}`}
                            style={{ width: `${investigacion.progreso}%` }}
                          />
                        </div>
                      </div>
                    )}

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
