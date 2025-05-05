// auth-guard.tsx
import type React from "react"
;('"use client')
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function AuthGuard({ children, allowedRoles = [] }: AuthGuardProps) {
  const { isAuthenticated, hasRole, loading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        router.push("/unauthorized")
      } else {
        setChecking(false)
      }
    }
  }, [isAuthenticated, hasRole, router, loading, allowedRoles])

  if (loading || checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}