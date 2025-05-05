"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import AuthGuard from "@/components/auth/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Save } from "lucide-react"
import axios from "@/lib/axios"
import { useToast } from "@/components/ui/use-toast"

export default function PerfilPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/auth/profile")
        setProfile(response.data)
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          bio: response.data.bio || "",
        })
      } catch (error) {
        console.error("Error al cargar el perfil:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la información del perfil.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSaving(true)
      // En una implementación real, aquí se enviarían los datos al backend
      // await axios.put("/auth/profile", formData)

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente.",
      })
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la información del perfil.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleTitle = (role: string) => {
    const roles: Record<string, string> = {
      administrador: "Administrador",
      jefe_brigada: "Jefe de Brigada",
      botanico: "Botánico",
      auxiliar: "Auxiliar Técnico",
      coinvestigador: "Coinvestigador",
    }
    return roles[role] || role
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información personal</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">El correo electrónico no se puede cambiar</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografía</Label>
                      <Input id="bio" name="bio" value={formData.bio} onChange={handleChange} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar cambios
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalles de la cuenta</CardTitle>
                  <CardDescription>Información sobre tu cuenta y rol</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-medium">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                      <div>
                        <p className="text-sm font-medium">Rol</p>
                        <p className="text-sm text-muted-foreground">{user ? getRoleTitle(user.role) : ""}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Estado</p>
                        <p className="text-sm text-muted-foreground">Activo</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">ID de usuario</p>
                        <p className="text-sm text-muted-foreground">{user?.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Fecha de registro</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
