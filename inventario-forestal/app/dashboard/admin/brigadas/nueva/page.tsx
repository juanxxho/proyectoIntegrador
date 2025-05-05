"use client"

import type React from "react"
import axiosInstance from "@/lib/axios"  // Ajusta la ruta de acuerdo a la ubicación de tu archivo
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import AuthGuard from "@/components/auth/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function NuevaBrigadaPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    jefe_brigada_id: "",
    botanico_id: "",
    auxiliar_id: "",
    coinvestigador_id: ""
  })
  const [expertos, setExpertos] = useState({
    jefe_brigada: [],
    botanico: [],
    auxiliar: [],
    coinvestigador: []
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  useEffect(() => {
    const fetchExpertos = async () => {
      try {
        // Llamamos a la API para obtener los expertos
        const roles = ["jefe de brigada", "botanico", "auxiliar", "coinvestigador"];
        const resultados = await Promise.all(
          roles.map((rol) =>
            fetch(`http://localhost/brigadas/expertos/${encodeURIComponent(rol)}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }).then((res) => res.json())
          )
        );
  
        // Llamamos a la API para obtener todas las brigadas actuales y los expertos que ya están asignados
        const brigadasRes = await fetch("http://localhost/brigadas", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const brigadas = await brigadasRes.json();
  
        // Obtener los IDs de los expertos ya asignados
        const expertosAsignados = brigadas.flatMap((brigada: any) => [
          brigada.jefe_brigada_id,
          brigada.botanico_id,
          brigada.auxiliar_id,
          brigada.coinvestigador_id
        ]);
  
        // Filtrar los expertos que ya están asignados
        const nuevosExpertos = resultados.map((expertoData: any, index: number) => {
          return expertoData.expertos.filter((experto: any) => !expertosAsignados.includes(experto.id));
        });
  
        // Actualizar el estado con los expertos filtrados
        setExpertos({
          jefe_brigada: nuevosExpertos[0],
          botanico: nuevosExpertos[1],
          auxiliar: nuevosExpertos[2],
          coinvestigador: nuevosExpertos[3]
        });
  
      } catch (err) {
        console.error("Error al cargar expertos", err);
      }
    };
  
    fetchExpertos();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {

        const estado = "Sin Asignar"
        await axiosInstance.post("/brigadas", {
            nombre: formData.nombre,
            estado,    
            jefe_brigada_id: formData.jefe_brigada_id,
            botanico_id: formData.botanico_id,
            auxiliar_id: formData.auxiliar_id,
            coinvestigador_id: formData.coinvestigador_id

        })

      toast({
        title: "Brigada creada",
        description: "La brigada ha sido creada exitosamente.",
      })

      router.push("/dashboard/admin/brigadas")
    } catch (error) {
      console.error("Error al crear brigada:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la brigada. Intenta nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard allowedRoles={["administrador"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/admin/brigadas">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Nueva Brigada</h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información de la Brigada</CardTitle>
              <CardDescription>Completa los datos para crear una nueva brigada</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la Brigada</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      placeholder="Ej: Brigada Norte"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Jefe de Brigada", name: "jefe_brigada_id", data: expertos.jefe_brigada },
                    { label: "Botánico", name: "botanico_id", data: expertos.botanico },
                    { label: "Auxiliar", name: "auxiliar_id", data: expertos.auxiliar },
                    { label: "Coinvestigador", name: "coinvestigador_id", data: expertos.coinvestigador }
                  ].map((campo) => (
                    <div className="space-y-2" key={campo.name}>
                      <Label htmlFor={campo.name}>{campo.label}</Label>
                      <Select
                        value={formData[campo.name as keyof typeof formData]}
                        onValueChange={(value) => handleSelectChange(campo.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Selecciona un ${campo.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {campo.data.map((experto: any) => (
                            <SelectItem key={experto.id} value={experto.id.toString()}>
                              {experto.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Link href="/dashboard/admin/brigadas">
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" /> Crear Brigada
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
