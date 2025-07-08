# Location Feature Setup Guide

This guide will help you set up the comprehensive location feature for the GradKart marketplace.

## Features Implemented

✅ **Current Location Detection**: Uses `navigator.geolocation` to get precise GPS coordinates  
✅ **Google Places Autocomplete**: Search for any address or landmark  
✅ **Interactive Google Map**: Draggable pin for precise location selection  
✅ **Location Storage**: Save multiple locations with custom names  
✅ **Delivery Zone Validation**: 50km radius validation  
✅ **Swiggy-style UI**: Modern, responsive design with smooth animations  
✅ **TypeScript Support**: Full type safety throughout  
✅ **Error Handling**: Comprehensive error states and user feedback  

## Setup Instructions

### 1. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Dependencies

The following packages are already installed:
- `@googlemaps/js-api-loader`: Google Maps JavaScript API loader
- `@types/google.maps`: TypeScript definitions for Google Maps

### 4. Components Overview

#### Core Components:
- **`LocationSelector`**: Main location selection interface
- **`GooglePlacesAutocomplete`**: Address search with autocomplete
- **`GoogleMap`**: Interactive map with draggable pin
- **`LocationHeader`**: Location display in app headers

#### Hooks:
- **`useLocation`**: Comprehensive location management hook

#### Utilities:
- **`lib/google-maps.ts`**: Google Maps configuration and utilities

## Usage Examples

### Basic Location Setup
```tsx
import { LocationSelector } from "@/components/LocationSelector"

function MyComponent() {
  const handleLocationSelect = (location) => {
    console.log('Selected location:', location)
  }

  return (
    <LocationSelector 
      onLocationSelect={handleLocationSelect}
      showMap={true}
    />
  )
}
```

### Location Header in App
```tsx
import { LocationHeader } from "@/components/LocationHeader"

function AppHeader() {
  return (
    <header>
      <LocationHeader showDeliveryStatus={true} />
    </header>
  )
}
```

### Using the Location Hook
```tsx
import { useLocation } from "@/hooks/use-location"

function MyComponent() {
  const {
    location,
    isWithinDeliveryArea,
    getCurrentLocation,
    searchLocation,
    saveLocation
  } = useLocation()

  return (
    <div>
      {location && (
        <p>Current location: {location.address}</p>
      )}
    </div>
  )
}
```

## Features in Detail

### 1. Current Location Detection
- Uses browser's geolocation API
- High accuracy GPS positioning
- Automatic address reverse geocoding
- Fallback handling for location errors

### 2. Google Places Autocomplete
- Real-time address suggestions
- Restricted to India for better relevance
- Supports both addresses and landmarks
- Automatic coordinate extraction

### 3. Interactive Map
- Draggable pin for precise location selection
- Click-to-place functionality
- Visual delivery zone indicator
- Custom styled map with clean UI

### 4. Location Management
- Save multiple locations with custom names
- Set default location
- Quick location switching
- Persistent storage in localStorage

### 5. Delivery Zone Validation
- 50km radius validation from Delhi center
- Visual indicators for delivery availability
- Distance calculation using Haversine formula
- Real-time status updates

### 6. Error Handling
- Network error handling
- API quota exceeded handling
- Location permission denied handling
- Graceful fallbacks for all error states

## Styling

The location feature uses Tailwind CSS with a Swiggy-inspired design:
- Orange primary color scheme
- Clean, modern card layouts
- Smooth animations and transitions
- Responsive design for all screen sizes
- Loading states and skeleton screens

## Security Considerations

1. **API Key Restrictions**: Always restrict your Google Maps API key to your domain
2. **HTTPS Required**: Geolocation API requires HTTPS in production
3. **User Consent**: Always request user permission before accessing location
4. **Data Privacy**: Location data is stored locally and not sent to external servers

## Troubleshooting

### Common Issues:

1. **"Failed to load Google Maps"**
   - Check if API key is correct
   - Verify APIs are enabled in Google Cloud Console
   - Check API quota limits

2. **"Geolocation not supported"**
   - Ensure you're using HTTPS
   - Check browser permissions
   - Try on a different browser

3. **"Location not found"**
   - Check internet connection
   - Verify Google Geocoding API is enabled
   - Try a different address format

## Performance Optimization

- Lazy loading of Google Maps
- Debounced search inputs
- Efficient state management
- Minimal re-renders with React.memo
- Optimized bundle size

## Future Enhancements

- Offline location caching
- Route optimization
- Real-time traffic integration
- Multi-language support
- Advanced filtering by distance 