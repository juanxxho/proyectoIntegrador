import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Leaf, ClipboardList, Users, FileSpreadsheet, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        <header className="py-12 text-center">
          <h1 className="text-4xl font-bold text-green-800 dark:text-green-300 mb-4">
            Sistema de Inventario Forestal Nacional
          </h1>
          <p className="text-xl text-green-700 dark:text-green-400 max-w-2xl mx-auto">
            Plataforma integral para la gestión de investigaciones, brigadas y recursos forestales
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-green-600 dark:text-green-400" />
                Investigaciones
              </CardTitle>
              <CardDescription>Gestión completa del ciclo de vida de investigaciones forestales</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Cree, asigne y supervise investigaciones en diferentes etapas, desde la planificación hasta la
                finalización.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                Brigadas
              </CardTitle>
              <CardDescription>Administración eficiente de equipos de campo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Organice brigadas, asigne roles y gestione la disponibilidad para optimizar el trabajo de campo.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                Muestras
              </CardTitle>
              <CardDescription>Registro detallado de especímenes y observaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Capture datos botánicos, fotografías y observaciones de campo con precisión y facilidad.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
                Inventarios
              </CardTitle>
              <CardDescription>Control completo de recursos y equipamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Mantenga un registro actualizado del inventario asignado a cada brigada durante el trabajo de campo.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                Permisos por Rol
              </CardTitle>
              <CardDescription>Acceso personalizado según responsabilidades</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Interfaces adaptadas para cada rol: Administrador, Jefe de Brigada, Botánico, Auxiliar Técnico y
                Coinvestigador.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-16">
          <Link href="/login">
            <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white">
              Iniciar Sesión <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
