"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MapPin, 
  Navigation, 
  Search, 
  Save, 
  Trash2, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Home,
  Building,
  Clock
} from "lucide-react"
import { useLocation } from "@/hooks/use-location"
import { GooglePlacesAutocomplete } from "@/components/GooglePlacesAutocomplete"
import { GoogleMap } from "@/components/GoogleMap"
import { useToast } from "@/hooks/use-toast"

interface LocationSelectorProps {
  onLocationSelect?: (location: any) => void
  showMap?: boolean
  className?: string
}

export function LocationSelector({ 
  onLocationSelect, 
  showMap = true, 
  className = "" 
}: LocationSelectorProps) {
  const {
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
    clearError
  } = useLocation()

  const { toast } = useToast()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [locationName, setLocationName] = useState("")
  const [activeTab, setActiveTab] = useState("current")

  // Handle location selection from autocomplete
  const handleLocationSelect = (locationData: { lat: number; lng: number; address: string }) => {
    searchLocation(locationData.address)
  }

  // Handle map location change
  const handleMapLocationChange = (coords: { lat: number; lng: number }) => {
    updateLocationFromMap(coords.lat, coords.lng)
  }

  // Handle save location
  const handleSaveLocation = () => {
    if (!locationName.trim()) {
      toast({
        title: "Location name required",
        description: "Please enter a name for this location",
        variant: "destructive"
      })
      return
    }

    saveLocation(locationName)
    setLocationName("")
    setShowSaveDialog(false)
    
    toast({
      title: "Location saved!",
      description: `${locationName} has been added to your saved locations`,
    })
  }

  // Handle load saved location
  const handleLoadSavedLocation = (savedLocation: any) => {
    loadSavedLocation(savedLocation)
    toast({
      title: "Location loaded!",
      description: `Switched to ${savedLocation.name}`,
    })
  }

  // Handle delete saved location
  const handleDeleteSavedLocation = (id: string, name: string) => {
    deleteSavedLocation(id)
    toast({
      title: "Location deleted",
      description: `${name} has been removed from saved locations`,
    })
  }

  // Handle set default location
  const handleSetDefaultLocation = (id: string, name: string) => {
    setDefaultLocation(id)
    toast({
      title: "Default location updated",
      description: `${name} is now your default location`,
    })
  }

  // Auto-save location when it changes
  useEffect(() => {
    if (location && onLocationSelect) {
      onLocationSelect(location)
    }
  }, [location, onLocationSelect])

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Location Display */}
      {location && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-green-800">Current Location</h3>
                    {isWithinDeliveryArea ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        In Delivery Zone
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Outside Delivery Zone
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-green-700 font-medium">{location.address}</p>
                  <p className="text-xs text-green-600">
                    {location.city}, {location.state}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSaveDialog(true)}
                className="text-green-600 border-green-300 hover:bg-green-100"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Location Error</p>
                <p className="text-sm text-red-700">{error.message}</p>
              </div>
              <Button size="sm" variant="outline" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Selection Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Use Current Location</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get your precise location using GPS
                  </p>
                </div>
                
                <Button 
                  onClick={getCurrentLocation} 
                  disabled={loading || !mapsLoaded}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Use Current Location
                    </>
                  )}
                </Button>

                {!mapsLoaded && (
                  <div className="text-center text-sm text-muted-foreground">
                    Loading Google Maps...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Search Location</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Search for any address or landmark
                  </p>
                </div>
                
                <GooglePlacesAutocomplete
                  onLocationSelect={handleLocationSelect}
                  placeholder="Search for your location..."
                  disabled={!mapsLoaded}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Saved Locations</h3>
                  <Badge variant="secondary">{savedLocations.length}</Badge>
                </div>
                
                {savedLocations.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No saved locations yet</p>
                    <p className="text-sm text-gray-400">
                      Save your current location to access it quickly
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedLocations.map((savedLocation) => (
                      <div
                        key={savedLocation.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {savedLocation.isDefault ? (
                              <Star className="w-4 h-4 text-blue-600 fill-current" />
                            ) : (
                              <Home className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-sm">{savedLocation.name}</p>
                              {savedLocation.isDefault && (
                                <Badge variant="outline" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {savedLocation.address}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleLoadSavedLocation(savedLocation)}
                          >
                            Load
                          </Button>
                          {!savedLocation.isDefault && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSetDefaultLocation(savedLocation.id, savedLocation.name)}
                              >
                                <Star className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteSavedLocation(savedLocation.id, savedLocation.name)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Interactive Map */}
      {showMap && location && (
        <GoogleMap
          center={{ lat: location.latitude, lng: location.longitude }}
          onLocationChange={handleMapLocationChange}
          isWithinDeliveryArea={isWithinDeliveryArea}
          height="300px"
        />
      )}

      {/* Delivery Zone Warning */}
      {location && !isWithinDeliveryArea && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-orange-800">Outside Delivery Zone</p>
                <p className="text-sm text-orange-700">
                  Your selected location is outside our 50km delivery radius. 
                  You may still browse items but delivery options will be limited.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Location Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="location-name">Location Name</Label>
              <Input
                id="location-name"
                placeholder="e.g., Home, Office, College"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSaveLocation()}
              />
            </div>
            {location && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">Location to save:</p>
                <p className="text-sm text-muted-foreground">{location.address}</p>
              </div>
            )}
            <div className="flex space-x-2">
              <Button onClick={handleSaveLocation} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Location
              </Button>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 