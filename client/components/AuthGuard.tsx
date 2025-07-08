"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const publicRoutes = ["/", "/login", "/signup", "/admin"];
      const isPublic =
        publicRoutes.some((route) => pathname === route) ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup");
      
      if (!isPublic) {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
          console.log("No user found, redirecting to signup");
          window.location.href = "/signup";
        } else {
          console.log("User found, allowing access");
        }
      } else {
        console.log("Public route, allowing access");
      }
    } catch (error) {
      console.error("Error in AuthGuard:", error);
      // On error, allow access to prevent blocking
    }
  }, [pathname]);

  return <>{children}</>;
} 