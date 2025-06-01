"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  BarChart,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
  roles: string[];
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, hasRole } = useAuth();

  // Determinar el rol para la ruta
  const rolePath = user?.role ? getRolePath(user.role) : "";

  const navItems: NavItem[] = [
    {
      title: "Inicio",
      href: `/dashboard/${rolePath}`,
      icon: <Home className="h-5 w-5" />,
      roles: [
        "administrador",
        "jefe de brigada",
        "botanico",
        "auxiliar",
        "coinvestigador",
      ],
    },
    {
      title: "Investigaciones",
      href: `/dashboard/${rolePath}/investigaciones`,
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["administrador"],
    },
    {
      title: "Brigadas",
      href: `/dashboard/${rolePath}/brigadas`,
      icon: <Users className="h-5 w-5" />,
      roles: ["administrador"],
    },
    {
      title: "Tareas",
      href: `/dashboard/${rolePath}/tareas`,
      icon: <CheckSquare className="h-5 w-5" />,
      roles: ["jefe de brigada", "auxiliar", "coinvestigador"],
    },
    {
      title: "Muestras",
      href: `/dashboard/${rolePath}/muestras`,
      icon: <Leaf className="h-5 w-5" />,
      roles: ["botanico"],
    },
    {
      title: "Fotografías",
      href: `/dashboard/${rolePath}/fotos`,
      icon: <Camera className="h-5 w-5" />,
      roles: ["administrador", "auxiliar"],
    },
    {
      title: "Novedades",
      href: `/dashboard/${rolePath}/novedades`,
      icon: <Bell className="h-5 w-5" />,
      roles: ["jefe de brigada"],
    },
    {
      title: "Reportes",
      href: `/dashboard/${rolePath}/reportes`,
      icon: <BarChart className="h-5 w-5" />,
      roles: ["administrador", "jefe de brigada"],
    },
    {
      title: "Inventario",
      href: `/dashboard/${rolePath}/inventario`,
      icon: <FileSpreadsheet className="h-5 w-5" />,
      roles: ["administrador", "auxiliar"],
    },
    {
      title: "Usuarios",
      href: `/dashboard/${rolePath}/usuarios`,
      icon: <User className="h-5 w-5" />,
      roles: ["administrador"],
    },
  ];

  // Filtrar elementos de navegación según el rol del usuario
  const filteredNavItems = navItems.filter((item) => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  // Función auxiliar para obtener la ruta del dashboard según el rol
  function getRolePath(role: string) {
    switch (role) {
      case "administrador":
        return "administrador";
      case "jefe de brigada":
        return "jefe";
      case "botanico":
        return "botanico";
      case "auxiliar":
        return "auxiliar";
      case "coinvestigador":
        return "coinvestigador";
      default:
        return "";
    }
  }

  // Obtener el título del rol para mostrar
  const roleMap = {
    administrador: "administrador",
    jefe: "Jefe de Brigada",
    botanico: "Botánico",
    auxiliar: "Auxiliar Técnico",
    coinvestigador: "Coinvestigador",
  } as const;

  const roleTitle = roleMap[user?.role as keyof typeof roleMap] || "Usuario";
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
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setOpen(false)}
              >
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
                    pathname === item.href ? "bg-muted text-foreground" : ""
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
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "Usuario"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {roleTitle}
                </p>
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
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
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
                  pathname === item.href ? "bg-muted text-foreground" : ""
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
  );
}
