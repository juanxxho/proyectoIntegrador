import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Clock, AlertTriangle, ClipboardList, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function CoinvestigadorDashboard() {
  return (
    <DashboardLayout role="coinvestigador" userName="Ana Martínez">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Panel de Coinvestigador</h1>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/coinvestigador/observaciones/nueva">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nueva Observación
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
                    <span className="font-medium">2/5</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Observaciones registradas:</span>
                    <span className="font-medium">8/15</span>
                  </div>
                  <Progress value={53.3} className="h-2" />
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/dashboard/coinvestigador/investigaciones/INV-2023-042">
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
              <p className="text-xs text-muted-foreground">De un total de 5 tareas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Observaciones</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+3 en la última semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investigaciones</CardTitle>
              <ClipboardList className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Activa actualmente</p>
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
                  title: "Registro de observaciones en Sector A",
                  status: "completada",
                  date: "Ayer",
                  priority: "alta",
                },
                {
                  title: "Análisis de datos preliminares",
                  status: "en-progreso",
                  date: "Hoy",
                  priority: "alta",
                },
                {
                  title: "Registro de observaciones en Sector B",
                  status: "pendiente",
                  date: "Mañana",
                  priority: "media",
                },
                {
                  title: "Colaboración en informe semanal",
                  status: "pendiente",
                  date: "22/04/2023",
                  priority: "media",
                },
                {
                  title: "Revisión de metodología",
                  status: "completada",
                  date: "15/04/2023",
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
              <Link href="/dashboard/coinvestigador/tareas">
                <Button variant="outline">Ver todas las tareas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observaciones Recientes</CardTitle>
            <CardDescription>Últimas observaciones registradas por ti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "OBS-2023-032",
                  title: "Interacción de especies en Sector A",
                  date: "Hoy",
                  type: "Ecológica",
                },
                {
                  id: "OBS-2023-031",
                  title: "Condiciones del suelo en Sector A",
                  date: "Hoy",
                  type: "Ambiental",
                },
                {
                  id: "OBS-2023-030",
                  title: "Patrones de crecimiento en Ceiba pentandra",
                  date: "Ayer",
                  type: "Botánica",
                },
                {
                  id: "OBS-2023-029",
                  title: "Evidencia de actividad humana en Sector B",
                  date: "Ayer",
                  type: "Antropogénica",
                },
                {
                  id: "OBS-2023-028",
                  title: "Variación de temperatura en microhábitats",
                  date: "18/04/2023",
                  type: "Ambiental",
                },
              ].map((observation, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <p className="font-medium">{observation.title}</p>
                      <Badge variant="outline" className="ml-2">
                        {observation.type}
                      </Badge>
                    </div>
                    <div className="flex gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">ID: {observation.id}</p>
                      <p className="text-xs text-muted-foreground">Fecha: {observation.date}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link href="/dashboard/coinvestigador/observaciones">
                <Button variant="outline">Ver todas las observaciones</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
