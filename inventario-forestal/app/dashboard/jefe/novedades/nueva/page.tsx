"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import  AuthGuard  from "@/components/auth/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Bell, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CrearNovedadPage() {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "",
    investigacion: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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
      // En una implementación real, esta sería una llamada a tu microservicio
      // const response = await axios.post("/novedades/crear", formData)

      // Simulamos una respuesta exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Novedad creada",
        description: "La novedad ha sido creada exitosamente.",
      })

      router.push("/dashboard/jefe/novedades")
    } catch (error) {
      console.error("Error al crear novedad:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la novedad. Intenta nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard allowedRoles={["jefe_brigada"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/jefe/novedades">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Crear Novedad</h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información de la Novedad</CardTitle>
              <CardDescription>Completa los datos para crear una nueva novedad</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    placeholder="Ej: Condiciones climáticas adversas"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Describe los detalles de la novedad"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Novedad</Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clima">Clima</SelectItem>
                      <SelectItem value="hallazgo">Hallazgo</SelectItem>
                      <SelectItem value="equipo">Equipo</SelectItem>
                      <SelectItem value="acceso">Acceso</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investigacion">Investigación</Label>
                  <Select
                    value={formData.investigacion}
                    onValueChange={(value) => handleSelectChange("investigacion", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una investigación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INV-2023-042">INV-2023-042: Evaluación de Biodiversidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Link href="/dashboard/jefe/novedades">
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...
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
  )
}
