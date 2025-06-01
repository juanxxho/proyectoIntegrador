"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

// Actualizado para coincidir con el modelo del backend
interface User {
  id: string;
  email: string;
  role:
    | "administrador"
    | "jefe de brigada"
    | "botanico"
    | "auxiliar"
    | "coinvestigador";
  name?: string; // Agregamos name como propiedad opcional
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // Verificar si estamos en el navegador antes de acceder a localStorage
    if (typeof window !== "undefined") {
      // Verificar si hay un usuario en localStorage al cargar la página
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing user from localStorage:", e);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post("/auth/login", { email, password });

      // Extraer el token de la respuesta
      const { token, message } = response.data;

      // Decodificar el token para obtener la información del usuario
      // Nota: En producción, deberías validar el token en el servidor
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const userData = JSON.parse(jsonPayload);

      // Crear objeto de usuario a partir del token decodificado
      const user = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
      };

      // Guardar token y datos de usuario en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      setUser(user);

      toast({
        title: "Inicio de sesión exitoso",
        description: message || "Has iniciado sesión correctamente",
      });

      // Redirigir según el rol
      router.push(`/dashboard/${getRolePath(user.role)}`);
    } catch (error: any) {
      console.error("Error de inicio de sesión:", error);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description:
          error.response?.data?.message ||
          "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, role: string) => {
    try {
      setLoading(true);
      const response = await axios.post("/auth/register", {
        email,
        password,
        role,
      });

      toast({
        title: "Registro exitoso",
        description:
          response.data.message ||
          "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
      });

      router.push("/login");
    } catch (error: any) {
      console.error("Error de registro:", error);
      toast({
        variant: "destructive",
        title: "Error de registro",
        description:
          error.response?.data?.message ||
          "No se pudo crear la cuenta. Por favor, inténtalo de nuevo.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    router.push("/login");

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  const isAuthenticated = !!user;

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Función auxiliar para obtener la ruta del dashboard según el rol
  const getRolePath = (role: string) => {
    switch (role) {
      case "administrador":
        return "admin";
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
  };

  // No renderizar nada hasta que estemos en el cliente
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
