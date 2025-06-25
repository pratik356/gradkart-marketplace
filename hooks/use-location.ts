"use client"

import { useState, useEffect } from "react"

interface LocationData {
  latitude: number
  longitude: number
  city: string
  state: string
  country: string
  address: string
}

interface LocationError {
  code: number
  message: string
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<LocationError | null>(null)

  const getCurrentLocation = async () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: "Geolocation is not supported by this browser",
      })
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Reverse geocoding to get address details
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY&limit=1`,
          )

          if (!response.ok) {
            // Fallback without detailed address
            setLocation({
              latitude,
              longitude,
              city: "Unknown",
              state: "Unknown",
              country: "Unknown",
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            })
            setLoading(false)
            return
          }

          const data = await response.json()
          const result = data.results[0]

          setLocation({
            latitude,
            longitude,
            city: result?.components?.city || result?.components?.town || "Unknown",
            state: result?.components?.state || "Unknown",
            country: result?.components?.country || "Unknown",
            address: result?.formatted || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          })
        } catch (err) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: "Unknown",
            state: "Unknown",
            country: "Unknown",
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          })
        }
        setLoading(false)
      },
      (err) => {
        setError({
          code: err.code,
          message: err.message,
        })
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  useEffect(() => {
    // Auto-detect location on hook initialization
    getCurrentLocation()
  }, [])

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    hasLocation: !!location,
  }
}
