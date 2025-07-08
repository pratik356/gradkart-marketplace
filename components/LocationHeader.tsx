"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { MapPin, ChevronDown, CheckCircle, AlertCircle } from "lucide-react"
import { useLocation } from "@/hooks/use-location"
import { LocationSheet } from "@/components/LocationSheet"

interface LocationHeaderProps {
  className?: string
  showDeliveryStatus?: boolean
  locationName?: string
}

export function LocationHeader({ 
  className = "", 
  showDeliveryStatus = true,
  locationName
}: LocationHeaderProps) {
  const { location, isWithinDeliveryArea, loading } = useLocation()
  const [showLocationSheet, setShowLocationSheet] = useState(false)
  
  console.log("LocationHeader render:", { 
    hasLocation: !!location, 
    showLocationSheet, 
    loading,
    className 
  })

  const handleLocationClick = () => {
    console.log("Location button clicked!")
    setShowLocationSheet(true)
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Location Inline Link */}
      <span
        role="button"
        tabIndex={0}
        onClick={handleLocationClick}
        onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') handleLocationClick() }}
        className={`flex items-center cursor-pointer select-none text-white hover:text-white/80 ${className}`}
        aria-label="Change location"
      >
        <MapPin className="w-4 h-4 mr-1 text-white" />
        <span className="text-base font-medium text-white hover:underline">
          {locationName || (location ? (location.city || "Location") : "Set Location")}
        </span>
        <ChevronDown className="w-4 h-4 ml-1 text-white" />
      </span>

      {/* Delivery Status Badge */}
      {showDeliveryStatus && location && (
        <Badge 
          variant={isWithinDeliveryArea ? "default" : "destructive"}
          className="text-xs"
        >
          {isWithinDeliveryArea ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              Delivery Available
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 mr-1" />
              Limited Delivery
            </>
          )}
        </Badge>
      )}

      {/* Location Sheet */}
      <Sheet open={showLocationSheet} onOpenChange={setShowLocationSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <LocationSheet onClose={() => setShowLocationSheet(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
} 