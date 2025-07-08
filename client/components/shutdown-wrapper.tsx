"use client"

import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import ShutdownBanner from "./shutdown-banner"

interface ShutdownWrapperProps {
  children: React.ReactNode
}

export default function ShutdownWrapper({ children }: ShutdownWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isShutdownActive, setIsShutdownActive] = useState(false)

  useEffect(() => {
    // Simple shutdown check without complex loading states
    try {
      const storedShutdown = localStorage.getItem("shutdownSettings")
      if (storedShutdown) {
        const data = JSON.parse(storedShutdown)
        // Allow admin routes to bypass shutdown
        if (pathname.startsWith("/admin")) {
          setIsShutdownActive(false)
          return
        }
        if (data.isActive) {
          setIsShutdownActive(true)
          // Redirect to shutdown page if not already there
          if (pathname !== "/shutdown") {
            router.push("/shutdown")
          }
        } else {
          setIsShutdownActive(false)
        }
      }
    } catch (error) {
      console.error("Error checking shutdown status:", error)
      // On error, assume not shutdown and continue
      setIsShutdownActive(false)
    }
  }, [router, pathname])

  // Allow admin routes to bypass shutdown banner and redirect
  if (pathname.startsWith("/admin")) {
    return <>{children}</>
  }

  if (isShutdownActive && pathname !== "/shutdown") {
    return null // Don't render anything while redirecting
  }

  return (
    <>
      <ShutdownBanner />
      {children}
    </>
  )
} 