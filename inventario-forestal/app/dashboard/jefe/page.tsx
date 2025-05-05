import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Clock, AlertTriangle, Users, Leaf, Camera, Plus } from "lucide-react"
import Link from "next/link"

export default function JefeDashboard() {
  return (
    <DashboardLayout role="jefe" userName="Juan Pérez">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Panel de Jefe de Brigada</h1>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/jefe/tareas/nueva">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
              </Button>
            </Link>
          </div>
        </div>

        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle>Investigación Actual</CardTitle>
            <CardDescription>Detalles de la investigación asignada a tu brigada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Evaluación de Biodiversidad en Bosque Tropical</h3>
                <p className="text-sm text-muted-foreground">ID: INV-2023-042 • Inicio: 12/04/2023</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progreso general:</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tareas completadas:</span>
                    <span className="font-medium">24/35</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Días restantes:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/dashboard/jefe/investigaciones/INV-2023-042">
                  <Button variant="outline">Ver detalles</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">11</div>
              <p className="text-xs text-muted-foreground">De un total de 35 tareas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Miembros de Brigada</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Brigada Norte</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Muestras Recolectadas</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">+12 en la última semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fotografías Tomadas</CardTitle>
              <Camera className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">86</div>
              <p className="text-xs text-muted-foreground">+23 en la última semana</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tareas Recientes</CardTitle>
            <CardDescription>Estado de las tareas asignadas a los miembros de tu brigada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Recolección de muestras en Sector A",
                  assignee: "María López",
                  role: "Botánico",
                  status: "completada",
                  date: "Hoy",
                },
                {
                  title: "Fotografiar especies en Sector B",
                  assignee: "Pedro Gómez",
                  role: "Auxiliar Técnico",
                  status: "en-progreso",
                  date: "Hoy",
                },
                {
                  title: "Registro de condiciones ambientales",
                  assignee: "Luis Ramírez",
                  role: "Auxiliar Técnico",
                  status: "pendiente",
                  date: "Mañana",
                },
                {
                  title: "Actualización de inventario",
                  assignee: "Pedro Gómez",
                  role: "Auxiliar Técnico",
                  status: "pendiente",
                  date: "Mañana",
                },
                {
                  title: "Identificación de especies en Sector C",
                  assignee: "María López",
                  role: "Botánico",
                  status: "pendiente",
                  date: "22/04/2023",
                },
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      {task.status === "completada" && <CheckSquare className="h-4 w-4 text-green-500" />}
                      {task.status === "en-progreso" && <Clock className="h-4 w-4 text-amber-500" />}
                      {task.status === "pendiente" && <AlertTriangle className="h-4 w-4 text-gray-400" />}
                      <p className="font-medium">{task.title}</p>
                    </div>
                    <div className="flex gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">
                        Asignada a: {task.assignee} ({task.role})
                      </p>
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
              <Link href="/dashboard/jefe/tareas">
                <Button variant="outline">Ver todas las tareas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Miembros de la Brigada</CardTitle>
            <CardDescription>Personal asignado a tu brigada para la investigación actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "María López",
                  role: "Botánico",
                  tasks: { total: 8, completed: 5 },
                  status: "activo",
                },
                {
                  name: "Pedro Gómez",
                  role: "Auxiliar Técnico",
                  tasks: { total: 10, completed: 6 },
                  status: "activo",
                },
                {
                  name: "Luis Ramírez",
                  role: "Auxiliar Técnico",
                  tasks: { total: 7, completed: 3 },
                  status: "activo",
                },
                {
                  name: "Ana Martínez",
                  role: "Coinvestigador",
                  tasks: { total: 5, completed: 2 },
                  status: "activo",
                },
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                      <span className="font-medium text-green-800 dark:text-green-200">{member.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Tareas: {member.tasks.completed}/{member.tasks.total}
                    </p>
                    <div className="mt-1">
                      <Progress value={(member.tasks.completed / member.tasks.total) * 100} className="h-2 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
