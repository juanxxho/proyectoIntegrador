import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Clock, AlertTriangle, Leaf, Plus, MapPin } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge" 

export default function BotanicoDashboard() {
  return (
    <DashboardLayout role="botanico" userName="María López">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Panel de Botánico</h1>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/botanico/muestras/nueva">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nueva Muestra
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
                    <span className="font-medium">5/8</span>
                  </div>
                  <Progress value={62.5} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Muestras recolectadas:</span>
                    <span className="font-medium">28/40</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/dashboard/botanico/investigaciones/INV-2023-042">
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
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">De un total de 8 tareas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Muestras Recolectadas</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">+8 en la última semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Especies Identificadas</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">+5 en la última semana</p>
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
                  title: "Recolección de muestras en Sector A",
                  status: "completada",
                  date: "Hoy",
                  priority: "alta",
                },
                {
                  title: "Identificación de especies en Sector B",
                  status: "en-progreso",
                  date: "Hoy",
                  priority: "alta",
                },
                {
                  title: "Registro de especies endémicas",
                  status: "pendiente",
                  date: "Mañana",
                  priority: "media",
                },
                {
                  title: "Análisis de muestras recolectadas",
                  status: "pendiente",
                  date: "22/04/2023",
                  priority: "baja",
                },
                {
                  title: "Identificación de especies en Sector C",
                  status: "pendiente",
                  date: "23/04/2023",
                  priority: "media",
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
              <Link href="/dashboard/botanico/tareas">
                <Button variant="outline">Ver todas las tareas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Muestras Recientes</CardTitle>
            <CardDescription>Últimas muestras botánicas recolectadas por ti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: "M-2023-156",
                  name: "Ceiba pentandra",
                  commonName: "Ceiba",
                  location: "Sector A, Punto 3",
                  date: "Hoy",
                  status: "procesada",
                },
                {
                  id: "M-2023-155",
                  name: "Swietenia macrophylla",
                  commonName: "Caoba",
                  location: "Sector A, Punto 2",
                  date: "Hoy",
                  status: "procesada",
                },
                {
                  id: "M-2023-154",
                  name: "Tabebuia rosea",
                  commonName: "Roble",
                  location: "Sector A, Punto 1",
                  date: "Ayer",
                  status: "procesada",
                },
                {
                  id: "M-2023-153",
                  name: "Especie no identificada",
                  commonName: "Pendiente",
                  location: "Sector B, Punto 4",
                  date: "Ayer",
                  status: "pendiente",
                },
                {
                  id: "M-2023-152",
                  name: "Cordia alliodora",
                  commonName: "Laurel",
                  location: "Sector B, Punto 3",
                  date: "18/04/2023",
                  status: "procesada",
                },
                {
                  id: "M-2023-151",
                  name: "Especie no identificada",
                  commonName: "Pendiente",
                  location: "Sector B, Punto 2",
                  date: "18/04/2023",
                  status: "pendiente",
                },
              ].map((sample, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{sample.name}</CardTitle>
                      <Badge variant={sample.status === "procesada" ? "outline" : "secondary"}>{sample.status}</Badge>
                    </div>
                    <CardDescription>
                      {sample.commonName} • ID: {sample.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{sample.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{sample.date}</span>
                    </div>
                    <div className="mt-4">
                      <Link href={`/dashboard/botanico/muestras/${sample.id}`}>
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
              <Link href="/dashboard/botanico/muestras">
                <Button variant="outline">Ver todas las muestras</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
