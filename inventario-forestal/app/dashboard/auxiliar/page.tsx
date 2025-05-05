import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Clock, AlertTriangle, Camera, FileSpreadsheet, Plus, MapPin } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AuxiliarDashboard() {
  return (
    <DashboardLayout role="auxiliar" userName="Pedro Gómez">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Panel de Auxiliar Técnico</h1>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/auxiliar/fotografias/nueva">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nueva Fotografía
              </Button>
            </Link>
          </div>
        </div>

        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle>Investigación Actual</CardTitle>
            <CardDescription>Detalles de la investigación en la que estás participando</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Evaluación de Biodiversidad en Bosque Tropical</h3>
                <p className="text-sm text-muted-foreground">ID: INV-2023-042 • Brigada Norte • Jefe: Juan Pérez</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tus tareas completadas:</span>
                    <span className="font-medium">6/10</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Fotografías tomadas:</span>
                    <span className="font-medium">32/50</span>
                  </div>
                  <Progress value={64} className="h-2" />
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/dashboard/auxiliar/investigaciones/INV-2023-042">
                  <Button variant="outline">Ver detalles</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">De un total de 10 tareas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fotografías Tomadas</CardTitle>
              <Camera className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">+12 en la última semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado del Inventario</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Completo</div>
              <p className="text-xs text-muted-foreground">Actualizado: Hoy</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tus Tareas</CardTitle>
            <CardDescription>Estado de las tareas asignadas a ti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Fotografiar especies en Sector B",
                  status: "en-progreso",
                  date: "Hoy",
                  priority: "alta",
                },
                {
                  title: "Actualización de inventario",
                  status: "pendiente",
                  date: "Mañana",
                  priority: "alta",
                },
                {
                  title: "Registro de condiciones ambientales",
                  status: "pendiente",
                  date: "Mañana",
                  priority: "media",
                },
                {
                  title: "Fotografiar Sector C",
                  status: "pendiente",
                  date: "22/04/2023",
                  priority: "media",
                },
                {
                  title: "Mantenimiento de equipos",
                  status: "completada",
                  date: "Ayer",
                  priority: "baja",
                },
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      {task.status === "completada" && <CheckSquare className="h-4 w-4 text-green-500" />}
                      {task.status === "en-progreso" && <Clock className="h-4 w-4 text-amber-500" />}
                      {task.status === "pendiente" && <AlertTriangle className="h-4 w-4 text-gray-400" />}
                      <p className="font-medium">{task.title}</p>
                      <Badge
                        variant={
                          task.priority === "alta" ? "destructive" : task.priority === "media" ? "default" : "outline"
                        }
                        className="ml-2"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">Fecha: {task.date}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Detalles
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link href="/dashboard/auxiliar/tareas">
                <Button variant="outline">Ver todas las tareas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventario</CardTitle>
            <CardDescription>Estado del inventario asignado a tu brigada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Inventario de Brigada Norte</h3>
                <Badge variant="outline">Actualizado: Ayer</Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    category: "Equipos de Medición",
                    items: [
                      { name: "GPS", quantity: 2, status: "completo" },
                      { name: "Medidor de pH", quantity: 1, status: "completo" },
                      { name: "Termómetro", quantity: 3, status: "completo" },
                      { name: "Clinómetro", quantity: 1, status: "completo" },
                    ],
                  },
                  {
                    category: "Equipos Fotográficos",
                    items: [
                      { name: "Cámara DSLR", quantity: 1, status: "completo" },
                      { name: "Lentes", quantity: 3, status: "completo" },
                      { name: "Trípode", quantity: 1, status: "completo" },
                      { name: "Tarjetas SD", quantity: 4, status: "completo" },
                    ],
                  },
                  {
                    category: "Herramientas de Campo",
                    items: [
                      { name: "Machetes", quantity: 2, status: "completo" },
                      { name: "Palas", quantity: 2, status: "completo" },
                      { name: "Tijeras de podar", quantity: 3, status: "completo" },
                      { name: "Bolsas de muestras", quantity: 50, status: "bajo" },
                    ],
                  },
                ].map((category, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex justify-between items-center text-sm">
                            <span>{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span>{item.quantity}</span>
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  item.status === "completo"
                                    ? "bg-green-500"
                                    : item.status === "bajo"
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                }`}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Link href="/dashboard/auxiliar/inventario">
                  <Button variant="outline">Gestionar inventario</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fotografías Recientes</CardTitle>
            <CardDescription>Últimas fotografías tomadas por ti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: "F-2023-086",
                  title: "Ceiba pentandra - Vista general",
                  location: "Sector A, Punto 3",
                  date: "Hoy",
                  type: "Especie",
                },
                {
                  id: "F-2023-085",
                  title: "Ceiba pentandra - Detalle de hojas",
                  location: "Sector A, Punto 3",
                  date: "Hoy",
                  type: "Detalle",
                },
                {
                  id: "F-2023-084",
                  title: "Swietenia macrophylla - Vista general",
                  location: "Sector A, Punto 2",
                  date: "Hoy",
                  type: "Especie",
                },
                {
                  id: "F-2023-083",
                  title: "Panorámica Sector A",
                  location: "Sector A, Punto 1",
                  date: "Ayer",
                  type: "Paisaje",
                },
                {
                  id: "F-2023-082",
                  title: "Condiciones del suelo Sector B",
                  location: "Sector B, Punto 1",
                  date: "Ayer",
                  type: "Ambiente",
                },
                {
                  id: "F-2023-081",
                  title: "Tabebuia rosea - Detalle de flores",
                  location: "Sector A, Punto 1",
                  date: "Ayer",
                  type: "Detalle",
                },
              ].map((photo, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Camera className="h-8 w-8" />
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{photo.title}</CardTitle>
                    </div>
                    <CardDescription>
                      ID: {photo.id} • Tipo: {photo.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{photo.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{photo.date}</span>
                    </div>
                    <div className="mt-4">
                      <Link href={`/dashboard/auxiliar/fotografias/${photo.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link href="/dashboard/auxiliar/fotografias">
                <Button variant="outline">Ver todas las fotografías</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
