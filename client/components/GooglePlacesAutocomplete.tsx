"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Loader2 } from "lucide-react"
import { googleMapsLoader } from "@/lib/google-maps"

interface GooglePlacesAutocompleteProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function GooglePlacesAutocomplete({
  onLocationSelect,
  placeholder = "Search for your location...",
  className = "",
  disabled = false
}: GooglePlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [mapsLoaded, setMapsLoaded] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)

  // Load Google Maps
  useEffect(() => {
    googleMapsLoader.load().then(() => {
      setMapsLoaded(true)
      // Initialize services
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService()
      if (inputRef.current) {
        placesServiceRef.current = new google.maps.places.PlacesService(inputRef.current)
      }
    }).catch((err) => {
      console.error("Error loading Google Maps:", err)
    })
  }, [])

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value)
    
    if (!value.trim() || !mapsLoaded || !autocompleteServiceRef.current) {
      setPredictions([])
      setShowPredictions(false)
      return
    }

    setLoading(true)
    
    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: 'in' }, // Restrict to India
        types: ['geocode', 'establishment']
      },
      (predictions, status) => {
        setLoading(false)
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions)
          setShowPredictions(true)
        } else {
          setPredictions([])
          setShowPredictions(false)
        }
      }
    )
  }

  // Handle prediction selection
  const handlePredictionSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesServiceRef.current) return

    placesServiceRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['geometry', 'formatted_address']
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address || prediction.description
          }
          
          setInputValue(prediction.description)
          setPredictions([])
          setShowPredictions(false)
          onLocationSelect(location)
        }
      }
    )
  }

  // Handle input focus
  const handleInputFocus = () => {
    if (predictions.length > 0) {
      setShowPredictions(true)
    }
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowPredictions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled || !mapsLoaded}
          className="pl-10 pr-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
        )}
      </div>

      {/* Predictions dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id}
              onClick={() => handlePredictionSelect(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prediction.structured_formatting?.main_text || prediction.description}
                  </p>
                  {prediction.structured_formatting?.secondary_text && (
                    <p className="text-xs text-gray-500 truncate">
                      {prediction.structured_formatting.secondary_text}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showPredictions && predictions.length === 0 && inputValue.trim() && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <p className="text-sm text-gray-500 text-center">
            No locations found. Try a different search term.
          </p>
        </div>
      )}
    </div>
  )
} 