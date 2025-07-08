"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, AlertCircle, CheckCircle } from "lucide-react"
import { useLocation } from "@/hooks/use-location"

interface LocationPermissionProps {
  onLocationGranted: (location: any) => void
  onSkip?: () => void
  showSkip?: boolean
}

export function LocationPermission({ onLocationGranted, onSkip, showSkip = true }: LocationPermissionProps) {
  const { location, loading, error, getCurrentLocation, hasLocation } = useLocation()
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied">("prompt")

  useEffect(() => {
    if (hasLocation && location) {
      onLocationGranted(location)
    }
  }, [hasLocation, location, onLocationGranted])

  useEffect(() => {
    // Check current permission state
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setPermissionState(result.state as "prompt" | "granted" | "denied")
      })
    }
  }, [])

  const handleEnableLocation = () => {
    getCurrentLocation()
  }

  if (hasLocation) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-800">Location Detected</p>
              <p className="text-sm text-green-600">
                {location?.city}, {location?.state}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-xl">Enable Location</CardTitle>
        <p className="text-muted-foreground text-sm">
          We need your location to show items within 50km of your area and connect you with nearby students.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-red-800">Location Access Denied</p>
              <p className="text-red-700 mt-1">
                {error.code === 1
                  ? "Please enable location access in your browser settings and refresh the page."
                  : error.code === 2
                    ? "Unable to determine your location. Please check your internet connection."
                    : "Location request timed out. Please try again."}
              </p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 text-blue-800">Why we need location:</h4>
          <ul className="text-xs space-y-1 text-blue-700">
            <li>• Find items within 50km of your college</li>
            <li>• Connect with nearby verified students</li>
            <li>• Calculate delivery distances and costs</li>
            <li>• Show relevant local listings first</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button onClick={handleEnableLocation} className="w-full" disabled={loading}>
            <Navigation className="mr-2 w-4 h-4" />
            {loading ? "Detecting Location..." : "Enable Location Access"}
          </Button>

          {showSkip && onSkip && (
            <Button variant="outline" onClick={onSkip} className="w-full">
              Skip for Now
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Your location data is kept private and only used to improve your marketplace experience.
        </p>
      </CardContent>
    </Card>
  )
}
