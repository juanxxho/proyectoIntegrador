"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor, completa todos los campos.")
      return
    }

    try {
      setIsLoading(true)
      await login(email, password)
    } catch (error: any) {
      // El error ya se maneja en el contexto de autenticación
      console.error("Error en el formulario de login:", error)
      setError(error.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4">
      <Card className="w-full max-w-md border-green-200 dark:border-green-800">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">Accede al Sistema de Inventario Forestal Nacional</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm dark:bg-red-900/50 dark:text-red-300">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-green-700 dark:text-green-400 hover:underline">
              Regístrate
            </Link>
          </div>
          <Link href="/" className="text-sm text-center text-green-700 dark:text-green-400 hover:underline">
            Volver a la página principal
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
