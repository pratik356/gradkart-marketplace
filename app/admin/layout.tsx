"use client"

import type React from "react" // force redeploy

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client
    const checkAuth = () => {
      if (typeof window === "undefined") return;
      const adminAuth = localStorage.getItem("adminAuth")

      if (pathname === "/admin" || pathname === "/admin/") {
        // Allow access to login page
        setIsAuthenticated(true)
        setLoading(false)
        return
      }

      if (adminAuth === "true") {
        setIsAuthenticated(true)
      } else {
        router.push("/admin")
      }
      setLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="w-screen h-screen min-h-0 min-w-0 bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col p-0 m-0 overflow-y-auto">
      {children}
    </div>
  )
}
