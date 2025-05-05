"use client"

import type React from "react"
import axios from "@/lib/axios"
import axiosInstance from "@/lib/axios"  // Ajusta la ruta de acuerdo a la ubicación de tu archivo
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import AuthGuard from "@/components/auth/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function NuevaInvestigacionPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    titulo: "",
    municipio: "",
    departamento: "",
    brigada: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [brigadas, setBrigadas] = useState<any[]>([]) // lista de brigadas desde backend
  const router = useRouter()
  const { toast } = useToast()

  
  useEffect(() => {
    const fetchBrigadas = async () => {
      try {
        const response = await axiosInstance.get("/brigadas")
        setBrigadas(response.data)
      } catch (error) {
        console.error("Error al obtener brigadas:", error)
      }
    }

    fetchBrigadas()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!formData.titulo || !date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, completa los campos obligatorios.",
      })
      return
    }
  
    try {
      setIsSubmitting(true)
  

      const estado = "pendiente"
      const id_brigada = formData.brigada !== "ninguna" ? formData.brigada : null
  
      // Usamos axiosInstance en lugar de axios directamente
      await axiosInstance.post("/investigaciones", {
        nombre: formData.titulo,
        fecha_inicio: date.toISOString().split("T")[0],
        estado,
        brigada_id: id_brigada,
        municipio: formData.municipio,
        departamento: formData.departamento,
      })
      
      toast({
        title: "Investigación creada",
        description: "La investigación ha sido creada exitosamente.",
      })
  
      router.push("/dashboard/admin/investigaciones")
    } catch (error) {
      console.error("Error al crear la investigación:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la investigación. Por favor, inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthGuard allowedRoles={["administrador"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin/investigaciones">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Nueva Investigación</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Ingresa los datos básicos de la nueva investigación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título de la Investigación *</Label>
                    <Input
                      id="titulo"
                      name="titulo"
                      placeholder="Ingresa el título de la investigación"
                      value={formData.titulo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id">ID de la Investigación</Label>
                    <Input id="id" placeholder="INV-2023-043" disabled />
                    <p className="text-xs text-muted-foreground">El ID se generará automáticamente</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha de Inicio *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                      <Calendar  mode="single"  selected={date}  onDayClick={setDate}  initialFocus  disabled={(day) => day < new Date()}/>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>


            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Asignación de Brigada</CardTitle>
                <CardDescription>Selecciona la brigada que realizará el trabajo de campo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brigada">Brigada</Label>
                  <Select value={formData.brigada} onValueChange={(value) => handleSelectChange("brigada", value)}>
                    <SelectTrigger id="brigada">
                      <SelectValue placeholder="Selecciona una brigada" />
                    </SelectTrigger>
                    <SelectContent>
                      {brigadas.map((brigada) => (
                        <SelectItem key={brigada.id} value={brigada.id.toString()}>
                          {brigada.nombre}
                        </SelectItem>
                      ))}
                      <SelectItem value="ninguna">No asignar brigada ahora</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Solo se muestran las brigadas disponibles</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
                <CardDescription>Ingresa los datos de ubicación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="municipio">Municipio *</Label>
                  <Input
                    id="municipio"
                    name="municipio"
                    placeholder="Ingresa el municipio"
                    value={formData.municipio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento *</Label>
                  <Input
                    id="departamento"
                    name="departamento"
                    placeholder="Ingresa el departamento"
                    value={formData.departamento}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 mt-6">
              <Link href="/dashboard/admin/investigaciones">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Investigación"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
