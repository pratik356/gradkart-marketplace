import { Loader } from '@googlemaps/js-api-loader'

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'

export const googleMapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry']
})

export interface LocationData {
  latitude: number
  longitude: number
  address: string
  city: string
  state: string
  country: string
  postalCode?: string
}

export interface DeliveryZone {
  center: { lat: number; lng: number }
  radius: number // in kilometers
}

// Default delivery zone (50km radius)
export const DEFAULT_DELIVERY_ZONE: DeliveryZone = {
  center: { lat: 28.6139, lng: 77.2090 }, // Delhi coordinates
  radius: 50
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Check if location is within delivery zone
export function isWithinDeliveryZone(
  userLocation: { lat: number; lng: number },
  deliveryZone: DeliveryZone = DEFAULT_DELIVERY_ZONE
): boolean {
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    deliveryZone.center.lat,
    deliveryZone.center.lng
  )
  return distance <= deliveryZone.radius
}

// Reverse geocoding using Google Maps API
export async function reverseGeocode(lat: number, lng: number): Promise<LocationData> {
  const { Map } = await googleMapsLoader.importLibrary('maps') as any
  const { Geocoder } = await googleMapsLoader.importLibrary('geocoding') as any
  
  const geocoder = new Geocoder()
  
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { location: { lat, lng } },
      (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const result = results[0]
          const addressComponents = result.address_components
          
          const locationData: LocationData = {
            latitude: lat,
            longitude: lng,
            address: result.formatted_address,
            city: '',
            state: '',
            country: '',
            postalCode: ''
          }
          
          // Extract address components
          addressComponents.forEach((component: any) => {
            const types = component.types
            
            if (types.includes('locality') || types.includes('sublocality')) {
              locationData.city = component.long_name
            } else if (types.includes('administrative_area_level_1')) {
              locationData.state = component.long_name
            } else if (types.includes('country')) {
              locationData.country = component.long_name
            } else if (types.includes('postal_code')) {
              locationData.postalCode = component.long_name
            }
          })
          
          resolve(locationData)
        } else {
          reject(new Error('Geocoding failed'))
        }
      }
    )
  })
}

// Forward geocoding using Google Maps API
export async function forwardGeocode(address: string): Promise<LocationData> {
  const { Geocoder } = await googleMapsLoader.importLibrary('geocoding') as any
  
  const geocoder = new Geocoder()
  
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { address },
      (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const result = results[0]
          const location = result.geometry.location
          const addressComponents = result.address_components
          
          const locationData: LocationData = {
            latitude: location.lat(),
            longitude: location.lng(),
            address: result.formatted_address,
            city: '',
            state: '',
            country: '',
            postalCode: ''
          }
          
          // Extract address components
          addressComponents.forEach((component: any) => {
            const types = component.types
            
            if (types.includes('locality') || types.includes('sublocality')) {
              locationData.city = component.long_name
            } else if (types.includes('administrative_area_level_1')) {
              locationData.state = component.long_name
            } else if (types.includes('country')) {
              locationData.country = component.long_name
            } else if (types.includes('postal_code')) {
              locationData.postalCode = component.long_name
            }
          })
          
          resolve(locationData)
        } else {
          reject(new Error('Geocoding failed'))
        }
      }
    )
  })
} 