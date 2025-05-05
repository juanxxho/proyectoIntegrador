"use client"

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import  AuthGuard  from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axios"

// Definir interfaces para TypeScript
interface Investigacion {
  id: string | number
  nombre: string
}

interface FormData {
  investigacion_id: string
  nombre_material: string
  cantidad: string
  observaciones: string
}

export default function NuevoInventarioPage() {
  const [formData, setFormData] = useState<FormData>({
    investigacion_id: "",
    nombre_material: "",
    cantidad: "",
    observaciones: "",
  })
  const [investigaciones, setInvestigaciones] = useState<Investigacion[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingInvestigaciones, setIsLoadingInvestigaciones] = useState<boolean>(true)
  const { toast } = useToast()
  const router = useRouter()

  // Opciones predefinidas para materiales
  const materialesPreDefinidos = [
    { id: "gps", nombre: "GPS Garmin" },
    { id: "brujula", nombre: "Brújula" },
    { id: "cinta_metrica", nombre: "Cinta métrica" },
    { id: "camara", nombre: "Cámara fotográfica" },
    { id: "binoculares", nombre: "Binoculares" },
    { id: "clinometro", nombre: "Clinómetro" },
    { id: "barreno", nombre: "Barreno" },
    { id: "radio", nombre: "Radio comunicador" },
    { id: "machete", nombre: "Machete" },
    { id: "bolsas", nombre: "Bolsas para muestras" },
  ]

  // Cargar investigaciones al iniciar
  useEffect(() => {
    const fetchInvestigaciones = async () => {
      try {
        const response = await axiosInstance.get("/investigaciones")
        setInvestigaciones(response.data)
      } catch (error) {
        console.error("Error al cargar investigaciones:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las investigaciones.",
        })
      } finally {
        setIsLoadingInvestigaciones(false)
      }
    }

    fetchInvestigaciones()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await axiosInstance.post("/inventarios", formData)

      toast({
        title: "Inventario creado",
        description: "El material ha sido agregado al inventario exitosamente.",
      })

      router.push("/dashboard/admin/inventario")
    } catch (error) {
      console.error("Error al crear inventario:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el inventario. Intenta nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard allowedRoles={["administrador"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/admin/inventario">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Nuevo Material de Inventario</h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información del Material</CardTitle>
              <CardDescription>Completa los datos para agregar un nuevo material al inventario</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="investigacion_id">Investigación</Label>
                    <Select 
                      value={formData.investigacion_id} 
                      onValueChange={(value) => handleSelectChange("investigacion_id", value)}
                      disabled={isLoadingInvestigaciones}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingInvestigaciones ? "Cargando..." : "Selecciona una investigación"} />
                      </SelectTrigger>
                      <SelectContent>
                        {investigaciones.map((inv) => (
                          <SelectItem key={inv.id} value={String(inv.id)}>
                            {inv.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Investigación a la que se asignará este material</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre_material">Nombre del Material</Label>
                    <Select
                      value={formData.nombre_material}
                      onValueChange={(value) => handleSelectChange("nombre_material", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materialesPreDefinidos.map((material) => (
                          <SelectItem key={material.id} value={material.nombre}>
                            {material.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Select
                      value={formData.cantidad}
                      onValueChange={(value) => handleSelectChange("cantidad", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una cantidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Select
                    value={formData.observaciones}
                    onValueChange={(value) => handleSelectChange("observaciones", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado del material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nuevo">Nuevo</SelectItem>
                      <SelectItem value="Buen estado">Buen estado</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Requiere mantenimiento">Requiere mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Link href="/dashboard/admin/inventario">
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...
                      </>
                    ) : (
                      "Agregar Material"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
