"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, CheckCircle, AlertCircle, ArrowRight, Loader2 } from "lucide-react"
import { LocationSelector } from "@/components/LocationSelector"
import { ClientOnly } from "@/components/ClientOnly"
import { useLocation } from "@/hooks/use-location"
import { useToast } from "@/hooks/use-toast"

export default function LocationSetupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { location, isWithinDeliveryArea, loading } = useLocation()
  const [step, setStep] = useState<"welcome" | "location" | "complete">("welcome")

  const handleLocationGranted = (location: any) => {
    // Location is automatically saved in the hook
    setStep("complete")
    
    toast({
      title: "Location set successfully! 🎉",
      description: "You can now browse items in your area",
    })

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/home")
    }, 2000)
  }

  const handleSkip = () => {
    localStorage.setItem("locationSkipped", "true")
    router.push("/home")
  }

  const handleContinue = () => {
    if (location) {
      handleLocationGranted(location)
    } else {
      setStep("location")
    }
  }

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-6 overflow-y-auto">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-orange-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900 mb-2">
              Set Your Location
            </CardTitle>
            <p className="text-gray-600">
              Help us find the best items near you and calculate accurate delivery costs
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Find Local Items</p>
                  <p className="text-sm text-green-700">Browse items within 50km of your location</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Accurate Delivery</p>
                  <p className="text-sm text-blue-700">Get precise delivery costs and times</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Connect Locally</p>
                  <p className="text-sm text-purple-700">Meet verified students in your area</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleContinue} 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Set My Location
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSkip} 
                className="w-full"
              >
                Skip for Now
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Your location data is kept private and only used to improve your marketplace experience
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "location") {
    return (
      <div className="min-h-screen bg-gray-50 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Choose Your Location</h1>
              <p className="text-sm text-gray-600">Select your delivery address</p>
            </div>
            <Button variant="ghost" onClick={() => setStep("welcome")}>
              Back
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <ClientOnly fallback={
            <Card className="border-gray-200">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                </div>
                <p className="text-gray-600">Loading location services...</p>
              </CardContent>
            </Card>
          }>
            <LocationSelector 
              onLocationSelect={handleLocationGranted}
              showMap={true}
            />
          </ClientOnly>

          {/* Delivery Zone Info */}
          {location && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Navigation className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800 mb-1">Delivery Zone</p>
                    <p className="text-sm text-blue-700">
                      {isWithinDeliveryArea 
                        ? "Great! Your location is within our 50km delivery zone. You'll have access to all delivery options."
                        : "Your location is outside our 50km delivery zone. You can still browse items but delivery options may be limited."
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {location && (
              <Button 
                onClick={handleLocationGranted} 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
                disabled={loading}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Location
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={handleSkip} 
              className="w-full"
            >
              Skip Location Setup
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Location Set Successfully!
            </h2>
            
            <p className="text-gray-600 mb-6">
              You're all set to explore items in your area
            </p>

            {location && (
              <div className="bg-white p-4 rounded-lg border mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-sm">Your Location</span>
                </div>
                <p className="text-sm text-gray-600">{location.address}</p>
                {isWithinDeliveryArea && (
                  <Badge variant="default" className="mt-2 bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Within Delivery Zone
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Redirecting to home...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
