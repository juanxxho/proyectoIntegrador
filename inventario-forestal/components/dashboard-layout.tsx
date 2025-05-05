"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Leaf,
  ClipboardList,
  Users,
  FileSpreadsheet,
  Menu,
  LogOut,
  Home,
  Camera,
  CheckSquare,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

interface DashboardLayoutProps {
  children: React.ReactNode
  role: string
  userName?: string
}

export function DashboardLayout({ children, role, userName = "Usuario" }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Inicio",
      href: `/dashboard/${role}`,
      icon: <Home className="h-5 w-5" />,
      roles: ["administrador", "jefe", "botanico", "auxiliar", "coinvestigador"],
    },
    {
      title: "Investigaciones",
      href: `/dashboard/${role}/investigaciones`,
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["administrador", "jefe", "botanico", "coinvestigador"],
    },
    {
      title: "Brigadas",
      href: `/dashboard/${role}/brigadas`,
      icon: <Users className="h-5 w-5" />,
      roles: ["administrador", "jefe"],
    },
    {
      title: "Tareas",
      href: `/dashboard/${role}/tareas`,
      icon: <CheckSquare className="h-5 w-5" />,
      roles: ["administrador", "jefe", "botanico", "auxiliar", "coinvestigador"],
    },
    {
      title: "Muestras",
      href: `/dashboard/${role}/muestras`,
      icon: <Leaf className="h-5 w-5" />,
      roles: ["administrador", "botanico"],
    },
    {
      title: "Fotografías",
      href: `/dashboard/${role}/fotografias`,
      icon: <Camera className="h-5 w-5" />,
      roles: ["administrador", "auxiliar"],
    },
    {
      title: "Inventario",
      href: `/dashboard/${role}/inventario`,
      icon: <FileSpreadsheet className="h-5 w-5" />,
      roles: ["administrador", "auxiliar"],
    },
    {
      title: "Usuarios",
      href: `/dashboard/${role}/usuarios`,
      icon: <User className="h-5 w-5" />,
      roles: ["administrador"],
    },
  ]

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role))

  const roleTitle =
    {
      administrador: "Administrador",
      jefe: "Jefe de Brigada",
      botanico: "Botánico",
      auxiliar: "Auxiliar Técnico",
      coinvestigador: "Coinvestigador",
    }[role] || "Usuario"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setOpen(false)}>
                <Leaf className="h-6 w-6 text-green-600" />
                <span>Inventario Forestal</span>
              </Link>
              <div className="my-4 border-t"></div>
              {filteredNavItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground",
                    pathname === item.href ? "bg-muted text-foreground" : "",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="hidden md:inline">Inventario Forestal Nacional</span>
        </Link>
        <div className="flex-1"></div>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{roleTitle}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/perfil">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm font-medium">
            {filteredNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                  pathname === item.href ? "bg-muted text-foreground" : "",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
