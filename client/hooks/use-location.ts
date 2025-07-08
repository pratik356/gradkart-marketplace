"use client"

import { useState, useEffect, useCallback } from "react"
import { googleMapsLoader, reverseGeocode, forwardGeocode, isWithinDeliveryZone, type LocationData } from "@/lib/google-maps"

interface LocationError {
  code: number
  message: string
}

interface SavedLocation extends LocationData {
  id: string
  name: string
  isDefault: boolean
  createdAt: string
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<LocationError | null>(null)
  const [isWithinDeliveryArea, setIsWithinDeliveryArea] = useState<boolean>(true)
  const [mapsLoaded, setMapsLoaded] = useState(false)

  // Load saved locations from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedLocations")
      if (saved) {
        setSavedLocations(JSON.parse(saved))
      }

    } catch (err) {
      console.error("Error loading saved locations:", err)
    }
  }, [])

  // Load Google Maps
  useEffect(() => {
    googleMapsLoader.load().then(() => {
      setMapsLoaded(true)
    }).catch((err) => {
      console.error("Error loading Google Maps:", err)
      setError({
        code: 0,
        message: "Failed to load Google Maps"
      })
    })
  }, [])

  // Get current location using browser geolocation
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported by this browser"
      })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      const { latitude, longitude } = position.coords
      
      // Use Google Maps reverse geocoding
      const locationData = await reverseGeocode(latitude, longitude)
      setLocation(locationData)
      
      // Check if within delivery zone
      const withinZone = isWithinDeliveryZone({ lat: latitude, lng: longitude })
      setIsWithinDeliveryArea(withinZone)
      
      // Save to localStorage
      localStorage.setItem("userLocation", JSON.stringify(locationData))
      
    } catch (err: any) {
      setError({
        code: err.code || 0,
        message: err.message || "Failed to get location"
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Search location by address
  const searchLocation = useCallback(async (address: string) => {
    if (!address.trim()) return

    setLoading(true)
    setError(null)

    try {
      const locationData = await forwardGeocode(address)
      setLocation(locationData)
      
      // Check if within delivery zone
      const withinZone = isWithinDeliveryZone({ 
        lat: locationData.latitude, 
        lng: locationData.longitude 
      })
      setIsWithinDeliveryArea(withinZone)
      
      // Save to localStorage
      localStorage.setItem("userLocation", JSON.stringify(locationData))
      
    } catch (err: any) {
      setError({
        code: 0,
        message: "Location not found. Please try a different address."
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Save current location with a custom name
  const saveLocation = useCallback((name: string) => {
    if (!location) return

    const newSavedLocation: SavedLocation = {
      ...location,
      id: `loc_${Date.now()}`,
      name,
      isDefault: savedLocations.length === 0,
      createdAt: new Date().toISOString()
    }

    const updatedLocations = [...savedLocations, newSavedLocation]
    setSavedLocations(updatedLocations)
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations))
  }, [location, savedLocations])

  // Load a saved location
  const loadSavedLocation = useCallback((savedLocation: SavedLocation) => {
    setLocation(savedLocation)
    setIsWithinDeliveryArea(isWithinDeliveryZone({ 
      lat: savedLocation.latitude, 
      lng: savedLocation.longitude 
    }))
    localStorage.setItem("userLocation", JSON.stringify(savedLocation))
  }, [])

  // Delete a saved location
  const deleteSavedLocation = useCallback((id: string) => {
    const updatedLocations = savedLocations.filter(loc => loc.id !== id)
    setSavedLocations(updatedLocations)
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations))
  }, [savedLocations])

  // Set default location
  const setDefaultLocation = useCallback((id: string) => {
    const updatedLocations = savedLocations.map(loc => ({
      ...loc,
      isDefault: loc.id === id
    }))
    setSavedLocations(updatedLocations)
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations))
  }, [savedLocations])

  // Update location from map drag
  const updateLocationFromMap = useCallback(async (lat: number, lng: number) => {
    try {
      const locationData = await reverseGeocode(lat, lng)
      setLocation(locationData)
      
      const withinZone = isWithinDeliveryZone({ lat, lng })
      setIsWithinDeliveryArea(withinZone)
      
      localStorage.setItem("userLocation", JSON.stringify(locationData))
    } catch (err) {
      console.error("Error updating location from map:", err)
    }
  }, [])

  // Load location from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("userLocation")
      if (saved) {
        const locationData = JSON.parse(saved)
        setLocation(locationData)
                setIsWithinDeliveryArea(isWithinDeliveryZone({ 
          lat: locationData.latitude, 
          lng: locationData.longitude 
        }))
      }
    } catch (err) {
      console.error("Error loading saved location:", err)
    }
  }, [])

  return {
    location,
    savedLocations,
    loading,
    error,
    isWithinDeliveryArea,
    mapsLoaded,
    getCurrentLocation,
    searchLocation,
    saveLocation,
    loadSavedLocation,
    deleteSavedLocation,
    setDefaultLocation,
    updateLocationFromMap,
    hasLocation: !!location,
    clearError: () => setError(null)
  }
}
