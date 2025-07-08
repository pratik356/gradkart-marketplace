"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AdminNav() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin")
  }

  return (
    <div className="flex items-center space-x-2">
      <Link href="/home">
        <Button variant="outline" size="sm">
          <Home className="w-4 h-4 mr-1" />
          View App
        </Button>
      </Link>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-1" />
        Logout
      </Button>
    </div>
  )
}
