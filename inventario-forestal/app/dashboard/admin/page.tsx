"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import AuthGuard from "@/components/auth/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList,
  Users,
  Leaf,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    investigaciones: 0,
    brigadas: 0,
    muestras: 0,
    inventarios: 0,
  });
  const [investigaciones, setInvestigaciones] = useState([]);
  const [brigadas, setBrigadas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        setStats({
          investigaciones: 12,
          brigadas: 8,
          muestras: 342,
          inventarios: 8,
        });

        setInvestigaciones([
        ]);

        setBrigadas([
        ]);

        setTareas([
        ]);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos del dashboard.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Dependencias vacías

  if (isLoading) {
    return (
      <AuthGuard allowedRoles={["administrador"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={["administrador"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Panel de Administrador</h1>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/admin/investigaciones/nueva">
                <Button className="bg-green-700 hover:bg-green-800">
                  <Plus className="mr-2 h-4 w-4" /> Nueva Investigación
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investigaciones Activas</CardTitle>
                <ClipboardList className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.investigaciones}</div>
                <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Brigadas Asignadas</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.brigadas}</div>
                <p className="text-xs text-muted-foreground">+1 desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Muestras Recolectadas</CardTitle>
                <Leaf className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.muestras}</div>
                <p className="text-xs text-muted-foreground">+86 desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventarios Activos</CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inventarios}</div>
                <p className="text-xs text-muted-foreground">+1 desde el mes pasado</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="investigaciones">
            <TabsList>
              <TabsTrigger value="investigaciones">Investigaciones</TabsTrigger>
              <TabsTrigger value="brigadas">Brigadas</TabsTrigger>
              <TabsTrigger value="tareas">Tareas</TabsTrigger>
            </TabsList>
            <TabsContent value="investigaciones">
              {/* Aquí agregas las investigaciones */}
            </TabsContent>
            <TabsContent value="brigadas">
              {/* Aquí agregas las brigadas */}
            </TabsContent>
            <TabsContent value="tareas">
              {/* Aquí agregas las tareas */}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
