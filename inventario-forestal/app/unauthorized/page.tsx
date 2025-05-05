"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Si el usuario no está autenticado, redirigir al login
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Función para obtener la ruta del dashboard según el rol
  const getDashboardPath = () => {
    if (!user) return "/login"

    switch (user.role) {
      case "administrador":
        return "/dashboard/admin"
      case "jefe_brigada":
        return "/dashboard/jefe"
      case "botanico":
        return "/dashboard/botanico"
      case "auxiliar":
        return "/dashboard/auxiliar"
      case "coinvestigador":
        return "/dashboard/coinvestigador"
      default:
        return "/login"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4">
      <Card className="w-full max-w-md border-red-200 dark:border-red-800">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-red-700 dark:text-red-300" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Acceso Denegado</CardTitle>
          <CardDescription className="text-center">No tienes permisos para acceder a esta sección</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Tu rol actual ({user?.role}) no tiene los permisos necesarios para acceder a esta página. Por favor,
            contacta al administrador si crees que deberías tener acceso.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="bg-green-700 hover:bg-green-800">
            <Link href={getDashboardPath()}>Volver a mi Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
