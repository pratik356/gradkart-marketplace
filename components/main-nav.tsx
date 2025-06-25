"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: {
    title: string
    href: string
    disabled?: boolean
  }[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <img src="/gradkart-logo.png" alt="GradKart" className="w-6 h-6" />
        <span className="hidden font-bold sm:inline-block">GradKart</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {items?.length ? (
          <>
            {items?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "transition-colors hover:text-foreground/80",
                      pathname === item.href ? "text-foreground" : "text-foreground/60",
                      item.disabled && "cursor-not-allowed opacity-80",
                    )}
                  >
                    {item.title}
                  </Link>
                ),
            )}
          </>
        ) : null}
      </nav>
    </div>
  )
}
