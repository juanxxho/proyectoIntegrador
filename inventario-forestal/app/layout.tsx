// app/layout.tsximport type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { AuthProvider } from "@/context/auth-context"  // Agrega esta línea

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Inventario Forestal Nacional",
  description: "Plataforma para la gestión del Inventario Forestal Nacional",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
        <AuthProvider>
          {children}
          </AuthProvider>
        </Providers>

      </body>
    </html>
  )
}