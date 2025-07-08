"use client"

import { Home, Bell, Plus, Package, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Home", icon: Home, href: "/home" },
  { name: "Notifications", icon: Bell, href: "/notifications" },
  { name: "Sell", icon: Plus, href: "/sell", special: true },
  { name: "Orders", icon: Package, href: "/orders" },
  { name: "Profile", icon: User, href: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          if (item.special) {
            return (
              <Link key={item.name} href={item.href}>
                <Button size="icon" className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90">
                  <item.icon className="w-6 h-6 text-white" />
                </Button>
              </Link>
            )
          }

          return (
            <Link key={item.name} href={item.href}>
              <div className="flex flex-col items-center py-2 px-3">
                <item.icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-gray-400"}`} />
                <span className={`text-xs mt-1 ${isActive ? "text-primary font-medium" : "text-gray-400"}`}>
                  {item.name}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
