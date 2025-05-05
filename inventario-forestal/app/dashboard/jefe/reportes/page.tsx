"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import AuthGuard from "@/components/auth/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Download, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ReportesPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    tipo: "",
    investigacion: "",
    formato: "pdf",
    comentarios: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [reporteGenerado, setReporteGenerado] = useState(false)
  const { toast } = useToast()

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

    if (!formData.tipo || !formData.investigacion || !date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, completa los campos obligatorios.",
      })
      return
    }

    try {
      setIsGenerating(true)

      // En una implementación real, esta sería una llamada a tu microservicio
      // const response = await axios.post("/reportes/generar", {
      //   ...formData,
      //   fecha: date.toISOString(),
      // })

      // Simulamos una respuesta exitosa
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setReporteGenerado(true)

      toast({
        title: "Reporte generado",
        description: "El reporte ha sido generado exitosamente.",
      })
    } catch (error) {
      console.error("Error al generar el reporte:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo generar el reporte. Por favor, inténtalo de nuevo.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AuthGuard allowedRoles={["administrador", "jefe_brigada"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold tracking-tight">Generación de Reportes</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Generar Nuevo Reporte</CardTitle>
                  <CardDescription>Configura los parámetros para generar un reporte</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de Reporte *</Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value) => handleSelectChange("tipo", value)}
                        required
                      >
                        <SelectTrigger id="tipo">
                          <SelectValue placeholder="Selecciona un tipo de reporte" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="avance">Avance de Investigación</SelectItem>
                          <SelectItem value="muestras">Muestras Recolectadas</SelectItem>
                          <SelectItem value="tareas">Estado de Tareas</SelectItem>
                          <SelectItem value="inventario">Inventario</SelectItem>
                          <SelectItem value="completo">Reporte Completo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investigacion">Investigación *</Label>
                      <Select
                        value={formData.investigacion}
                        onValueChange={(value) => handleSelectChange("investigacion", value)}
                        required
                      >
                        <SelectTrigger id="investigacion">
                          <SelectValue placeholder="Selecciona una investigación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INV-2023-042">INV-2023-042 - Evaluación de Biodiversidad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha de Corte *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="formato">Formato</Label>
                      <Select value={formData.formato} onValueChange={(value) => handleSelectChange("formato", value)}>
                        <SelectTrigger id="formato">
                          <SelectValue placeholder="Selecciona un formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comentarios">Comentarios Adicionales</Label>
                      <Textarea
                        id="comentarios"
                        name="comentarios"
                        placeholder="Añade comentarios o notas para incluir en el reporte"
                        rows={3}
                        value={formData.comentarios}
                        onChange={handleChange}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generando reporte...
                        </>
                      ) : (
                        "Generar Reporte"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Reportes Recientes</CardTitle>
                  <CardDescription>Últimos reportes generados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reporteGenerado && (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">
                              {formData.tipo === "avance" && "Avance de Investigación"}
                              {formData.tipo === "muestras" && "Muestras Recolectadas"}
                              {formData.tipo === "tareas" && "Estado de Tareas"}
                              {formData.tipo === "inventario" && "Inventario"}
                              {formData.tipo === "completo" && "Reporte Completo"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {date ? format(date, "dd/MM/yyyy", { locale: es }) : ""}
                            </p>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Avance de Investigación</p>
                          <p className="text-xs text-muted-foreground">15/04/2023</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Muestras Recolectadas</p>
                          <p className="text-xs text-muted-foreground">10/04/2023</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Estado de Tareas</p>
                          <p className="text-xs text-muted-foreground">05/04/2023</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
