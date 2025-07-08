"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react"
import { googleMapsLoader } from "@/lib/google-maps"

interface GoogleMapProps {
  center: { lat: number; lng: number }
  onLocationChange: (location: { lat: number; lng: number }) => void
  className?: string
  height?: string
  showDeliveryZone?: boolean
  isWithinDeliveryArea?: boolean
}

export function GoogleMap({
  center,
  onLocationChange,
  className = "",
  height = "400px",
  showDeliveryZone = true,
  isWithinDeliveryArea = true
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [circle, setCircle] = useState<google.maps.Circle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapsLoaded, setMapsLoaded] = useState(false)

  // Load Google Maps
  useEffect(() => {
    googleMapsLoader.load().then(() => {
      setMapsLoaded(true)
    }).catch((err) => {
      console.error("Error loading Google Maps:", err)
      setError("Failed to load Google Maps")
      setLoading(false)
    })
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return

    try {
      // Create map
      const newMap = new google.maps.Map(mapRef.current, {
        center,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })

      // Create marker
      const newMarker = new google.maps.Marker({
        position: center,
        map: newMap,
        draggable: true,
        title: "Drag to adjust location",
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C10.477 0 6 4.477 6 10c0 7 10 22 10 22s10-15 10-22c0-5.523-4.477-10-10-10z" fill="#FF6B35"/>
              <circle cx="16" cy="10" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      })

      // Create delivery zone circle
      let newCircle: google.maps.Circle | null = null
      if (showDeliveryZone) {
        newCircle = new google.maps.Circle({
          strokeColor: isWithinDeliveryArea ? "#10B981" : "#EF4444",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: isWithinDeliveryArea ? "#10B981" : "#EF4444",
          fillOpacity: 0.1,
          map: newMap,
          center: { lat: 28.6139, lng: 77.2090 }, // Delhi center
          radius: 50000 // 50km in meters
        })
      }

      // Handle marker drag
      newMarker.addListener("dragend", () => {
        const position = newMarker.getPosition()
        if (position) {
          onLocationChange({
            lat: position.lat(),
            lng: position.lng()
          })
        }
      })

      // Handle map click
      newMap.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          newMarker.setPosition(event.latLng)
          onLocationChange({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          })
        }
      })

      setMap(newMap)
      setMarker(newMarker)
      setCircle(newCircle)
      setLoading(false)

    } catch (err) {
      console.error("Error initializing map:", err)
      setError("Failed to initialize map")
      setLoading(false)
    }
  }, [mapsLoaded, center, onLocationChange, showDeliveryZone, isWithinDeliveryArea])

  // Update marker position when center changes
  useEffect(() => {
    if (marker && center) {
      marker.setPosition(center)
    }
  }, [marker, center])

  // Update circle when delivery area status changes
  useEffect(() => {
    if (circle) {
      circle.setOptions({
        strokeColor: isWithinDeliveryArea ? "#10B981" : "#EF4444",
        fillColor: isWithinDeliveryArea ? "#10B981" : "#EF4444"
      })
    }
  }, [circle, isWithinDeliveryArea])

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Map container */}
          <div
            ref={mapRef}
            style={{ height }}
            className="w-full rounded-lg"
          />
          
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading map...</span>
              </div>
            </div>
          )}

          {/* Delivery zone indicator */}
          {showDeliveryZone && (
            <div className="absolute top-4 left-4">
              <Badge variant={isWithinDeliveryArea ? "default" : "destructive"}>
                <Navigation className="w-3 h-3 mr-1" />
                {isWithinDeliveryArea ? "Within Delivery Zone" : "Outside Delivery Zone"}
              </Badge>
            </div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <p className="text-xs text-gray-600 text-center">
                Drag the pin or click on the map to adjust your location
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 