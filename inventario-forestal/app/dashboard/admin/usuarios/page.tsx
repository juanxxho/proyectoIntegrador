"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MoreHorizontal, User, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [filteredUsuarios, setFilteredUsuarios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setIsLoading(true)

        // En una implementación real, esta sería una llamada a tu microservicio
        // const response = await axios.get("/usuarios")
        // setUsuarios(response.data)

        // Simulamos datos para la demostración
        const data = [
          {
            id: "USR-001",
            nombre: "Juan Pérez",
            email: "juan.perez@ejemplo.com",
            rol: "JEFE_BRIGADA",
            brigada: "Brigada Norte",
            estado: "activo",
          },
          {
            id: "USR-002",
            nombre: "María López",
            email: "maria.lopez@ejemplo.com",
            rol: "BOTANICO",
            brigada: "Brigada Norte",
            estado: "activo",
          },
          {
            id: "USR-003",
            nombre: "Pedro Gómez",
            email: "pedro.gomez@ejemplo.com",
            rol: "AUXILIAR_TECNICO",
            brigada: "Brigada Norte",
            estado: "activo",
          },
          {
            id: "USR-004",
            nombre: "Ana Martínez",
            email: "ana.martinez@ejemplo.com",
            rol: "COINVESTIGADOR",
            brigada: "Brigada Norte",
            estado: "activo",
          },
          {
            id: "USR-005",
            nombre: "Carlos Mendoza",
            email: "carlos.mendoza@ejemplo.com",
            rol: "JEFE_BRIGADA",
            brigada: "Brigada Sur",
            estado: "activo",
          },
          {
            id: "USR-006",
            nombre: "Laura Torres",
            email: "laura.torres@ejemplo.com",
            rol: "BOTANICO",
            brigada: "Brigada Sur",
            estado: "activo",
          },
          {
            id: "USR-007",
            nombre: "Admin Sistema",
            email: "admin@ejemplo.com",
            rol: "administrador",
            brigada: null,
            estado: "activo",
          },
        ]

        setUsuarios(data)
        setFilteredUsuarios(data)
      } catch (error) {
        console.error("Error al cargar usuarios:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los usuarios.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsuarios()
  }, [toast])

  useEffect(() => {
    // Filtrar usuarios según los criterios de búsqueda y rol
    const filtered = usuarios.filter((usuario: any) => {
      const matchesSearch =
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "todos" || usuario.rol === roleFilter

      return matchesSearch && matchesRole
    })

    setFilteredUsuarios(filtered)
  }, [searchTerm, roleFilter, usuarios])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value)
  }

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    try {
      // En una implementación real, esta sería una llamada a tu microservicio
      // await axios.delete(`/usuarios/${userToDelete}`)

      // Simulamos la eliminación
      setUsuarios(usuarios.filter((user: any) => user.id !== userToDelete))

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
      })
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el usuario.",
      })
    } finally {
      setUserToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const getRolTitle = (rol: string) => {
    const roles: Record<string, string> = {
      administrador: "Administrador",
      JEFE_BRIGADA: "Jefe de Brigada",
      BOTANICO: "Botánico",
      AUXILIAR_TECNICO: "Auxiliar Técnico",
      COINVESTIGADOR: "Coinvestigador",
    }
    return roles[rol] || rol
  }

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={["administrador"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard allowedRoles={["administrador"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
            <Link href="/register">
              <Button className="bg-green-700 hover:bg-green-800">
                <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar usuarios..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={handleRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los roles</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                  <SelectItem value="JEFE_BRIGADA">Jefe de Brigada</SelectItem>
                  <SelectItem value="BOTANICO">Botánico</SelectItem>
                  <SelectItem value="AUXILIAR_TECNICO">Auxiliar Técnico</SelectItem>
                  <SelectItem value="COINVESTIGADOR">Coinvestigador</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsuarios.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-2">No se encontraron usuarios</p>
                  <p className="text-sm text-muted-foreground">Intenta con otros criterios de búsqueda</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                    <div className="col-span-5">Usuario</div>
                    <div className="col-span-2">Rol</div>
                    <div className="col-span-3">Brigada</div>
                    <div className="col-span-1">Estado</div>
                    <div className="col-span-1 text-right">Acciones</div>
                  </div>
                  {filteredUsuarios.map((usuario: any) => (
                    <div key={usuario.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b last:border-0">
                      <div className="col-span-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                              {usuario.nombre.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{usuario.nombre}</p>
                            <p className="text-sm text-muted-foreground">{usuario.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="font-normal">
                          <User className="mr-1 h-3 w-3" />
                          {getRolTitle(usuario.rol)}
                        </Badge>
                      </div>
                      <div className="col-span-3">{usuario.brigada || "-"}</div>
                      <div className="col-span-1">
                        <Badge variant={usuario.estado === "activo" ? "success" : "secondary"}>{usuario.estado}</Badge>
                      </div>
                      <div className="col-span-1 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/admin/usuarios/${usuario.id}`}>Ver detalles</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/admin/usuarios/${usuario.id}/editar`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(usuario.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    </AuthGuard>
  )
}
