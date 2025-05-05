'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context" // Importa el AuthProvider
import { useState, useEffect, type ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Asegurarnos de que estamos en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // No renderizar nada hasta que estemos en el cliente
  if (!mounted) {
    return null
  }

  return (
    <AuthProvider> {/* Envuelve con AuthProvider */}
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}
