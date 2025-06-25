"use client"

import { useRouter } from "next/navigation"
import { LocationPermission } from "@/components/location-permission"

export default function LocationSetupPage() {
  const router = useRouter()

  const handleLocationGranted = (location: any) => {
    // Store location in localStorage or send to backend
    localStorage.setItem("userLocation", JSON.stringify(location))

    // Show success message and redirect
    setTimeout(() => {
      router.push("/home")
    }, 1500)
  }

  const handleSkip = () => {
    // User chose to skip location setup
    localStorage.setItem("locationSkipped", "true")
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <LocationPermission onLocationGranted={handleLocationGranted} onSkip={handleSkip} showSkip={true} />
      </div>
    </div>
  )
}
