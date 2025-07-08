"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, ChevronLeft, MoreVertical, Search, X, Pencil, Trash2 } from "lucide-react"
import { SheetTitle } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete"
import FullAddressForm from "./FullAddressForm"

// Placeholder data for saved addresses and recent searches
const initialSavedAddresses = [
  {
    id: 1,
    name: "puja Sharma",
    address: "seventh heaven girls pg, sector 22 A, Sector 22, Gurugram, Haryana 122022, India",
    icon: "user"
  },
  {
    id: 2,
    name: "Ori Add",
    address: "373, 2nd Cross 2nd Main, Near GVS Pg, Aswath Nagar, Marathahalli, Bengaluru, Karnataka 560037, India",
    icon: "map"
  },
  {
    id: 3,
    name: "Pratik",
    address: "Orange Building, Soladevanahalli, Karnataka, India",
    icon: "map"
  }
]

const initialRecentSearches = [
  {
    id: 1,
    name: "JP Morgan Chase & Co.",
    address: "Bluebay Building, 100 Feet Rd, Embassy Golf Links Business Park, Koramangala, Bengaluru, Karnataka 560071, India"
  },
  {
    id: 2,
    name: "PG in sector 22A (Seventh Heaven) Best Girls PG...",
    address: "203 Sector 22A, Near HUDA Market, Sector 22A, Sector 22, Gurugram, Haryana 122001, India"
  },
  {
    id: 3,
    name: "Maa Tarini Ladies PG",
    address: "Some address, City, State, India"
  }
]

export function LocationSheet({ onClose }: { onClose?: () => void }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState(initialRecentSearches)
  const [showAllSaved, setShowAllSaved] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editAddress, setEditAddress] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteAddress, setDeleteAddress] = useState<any>(null)
  const [newName, setNewName] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [adding, setAdding] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState<number | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userLocation")
      return stored ? JSON.parse(stored) : null
    }
    return null
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userLocation")
      if (stored) setSelectedLocation(JSON.parse(stored))
    }
  }, [])

  // Load saved addresses from localStorage on mount and when window regains focus
  useEffect(() => {
    const loadAddresses = () => {
      const saved = localStorage.getItem("userAddresses");
      if (saved) setSavedAddresses(JSON.parse(saved));
      else setSavedAddresses([]);
    };
    loadAddresses();
    window.addEventListener("focus", loadAddresses);
    return () => window.removeEventListener("focus", loadAddresses);
  }, []);

  // Helper: Save selected address and reload page
  const selectAddress = (addressObj: any) => {
    localStorage.setItem("userLocation", JSON.stringify(addressObj))
    toast.success(`Selected address: ${addressObj.name || addressObj.address}`)
    setSelectedLocation(addressObj)
    window.location.reload()
    if (onClose) onClose()
  }

  // Use current location (browser geolocation)
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.")
      return
    }
    setAdding(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // For demo, just use lat/lng as address
        const addressObj = {
          id: Date.now(),
          name: "Current Location",
          address: `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`,
          icon: "map"
        }
        selectAddress(addressObj)
        setAdding(false)
      },
      (error) => {
        toast.error("Failed to get current location: " + error.message)
        setAdding(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Add new address
  const handleAddNewAddress = () => {
    window.location.href = "/profile/address";
  }

  // Edit address
  const handleEditAddress = (addr: any) => {
    setEditAddress(addr)
    setNewName(addr.name)
    setNewAddress(addr.address)
    setShowEditModal(true)
    setPopoverOpen(null)
  }
  const handleSaveEditAddress = () => {
    if (!newName.trim() || !newAddress.trim()) {
      toast.error("Please enter both name and address.")
      return
    }
    const updated = savedAddresses.map(addr =>
      addr.id === editAddress.id ? { ...addr, name: newName, address: newAddress } : addr
    )
    setSavedAddresses(updated)
    localStorage.setItem("userAddresses", JSON.stringify(updated))
    toast.success("Address updated!")
    setShowEditModal(false)
  }

  // Delete address
  const handleDeleteAddress = (addr: any) => {
    setDeleteAddress(addr)
    setShowDeleteModal(true)
    setPopoverOpen(null)
  }
  const confirmDeleteAddress = () => {
    const updated = savedAddresses.filter(addr => addr.id !== deleteAddress.id)
    setSavedAddresses(updated)
    localStorage.setItem("userAddresses", JSON.stringify(updated))
    toast.success("Address deleted!")
    setShowDeleteModal(false)
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen max-h-screen overflow-y-auto bg-white flex flex-col relative">
      {/* Visually hidden title for accessibility */}
      <SheetTitle className="sr-only">Location Selector</SheetTitle>
      {/* Header */}
      <div className="flex items-center px-4 pt-4 pb-2 border-b">
        <button onClick={onClose} className="mr-2 p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold flex-1">Enter your area or Collage name</h2>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="bg-primary/5 border border-primary/30 rounded-lg p-2">
          <GooglePlacesAutocomplete
            onLocationSelect={(location) => {
              // Add to recent searches
              const newRecent = {
                id: Date.now(),
                name: location.address.split(",")[0],
                address: location.address
              }
              setRecentSearches(prev => [newRecent, ...prev.filter(r => r.address !== newRecent.address)].slice(0, 5))
              localStorage.setItem("recentSearches", JSON.stringify([newRecent, ...recentSearches.filter(r => r.address !== newRecent.address)].slice(0, 5)))
              // Set as active location
              selectAddress(newRecent)
            }}
            placeholder="Search for your location..."
            className="bg-transparent border-none focus:ring-0 text-primary"
          />
        </div>
      </div>

      {/* Use Current Location */}
      <button
        className="flex items-center w-full px-4 py-3 text-primary font-semibold hover:bg-primary/10 disabled:opacity-60"
        onClick={handleUseCurrentLocation}
        disabled={adding}
      >
        <MapPin className="w-5 h-5 mr-2 text-primary" />
        {adding ? "Detecting location..." : "Use my current location"}
      </button>

      {/* Add New Address */}
      <button
        className="flex items-center w-full px-4 py-3 text-primary font-semibold hover:bg-primary/10"
        onClick={handleAddNewAddress}
      >
        <Plus className="w-5 h-5 mr-2 text-primary" />
        Add a new address
      </button>

      {/* Saved Addresses */}
      <div className="px-4 pt-4">
        <div className="text-xs font-semibold text-gray-500 mb-2">SAVED ADDRESSES</div>
        <div className="space-y-3">
          {(showAllSaved ? savedAddresses : savedAddresses.slice(0, 2)).map(addr => (
            <div key={addr.id} className="flex items-start justify-between bg-gray-50 rounded-lg p-3 w-full">
              <button
                className="flex items-start flex-1 text-left hover:bg-primary/10 rounded-lg p-0"
                onClick={() => selectAddress(addr)}
              >
                <span className="mr-3 mt-1">
                  {addr.icon === "user" ? (
                    <span className="inline-block w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">👤</span>
                  ) : (
                    <MapPin className="w-5 h-5 text-primary" />
                  )}
                </span>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{addr.name}</div>
                  <div className="text-xs text-gray-600 mt-0.5 max-w-xs truncate">{addr.address}</div>
                </div>
              </button>
              <Popover open={popoverOpen === addr.id} onOpenChange={open => setPopoverOpen(open ? addr.id : null)}>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-gray-200 ml-2">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-32 p-1">
                  <button
                    className="flex items-center w-full px-2 py-2 text-sm hover:bg-gray-100 rounded"
                    onClick={() => handleEditAddress(addr)}
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </button>
                  <button
                    className="flex items-center w-full px-2 py-2 text-sm hover:bg-gray-100 rounded text-red-600"
                    onClick={() => handleDeleteAddress(addr)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
        {savedAddresses.length > 2 && (
          <button
            className="w-full text-left text-primary font-semibold mt-2 text-sm flex items-center justify-start"
            onClick={() => setShowAllSaved(s => !s)}
          >
            {showAllSaved ? "View less" : "View more"} <span className="ml-1">{showAllSaved ? "▲" : "▼"}</span>
          </button>
        )}
      </div>

      {/* Recent Searches */}
      <div className="px-4 pt-6 pb-4">
        <div className="text-xs font-semibold text-gray-500 mb-2">RECENT SEARCHES</div>
        <div className="space-y-3">
          {recentSearches.map(addr => (
            <button
              key={addr.id}
              className="flex items-start bg-gray-50 rounded-lg p-3 w-full text-left hover:bg-primary/10"
              onClick={() => selectAddress(addr)}
            >
              <span className="mr-3 mt-1">
                <MapPin className="w-5 h-5 text-gray-400" />
              </span>
              <div>
                <div className="font-semibold text-sm text-gray-900">{addr.name}</div>
                <div className="text-xs text-gray-600 mt-0.5 max-w-xs truncate">{addr.address}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Edit Address Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
              onClick={() => setShowEditModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Edit Address</h3>
            <Input
              className="mb-3"
              placeholder="Name (e.g. Home, Hostel, PG)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              autoFocus
            />
            <Input
              className="mb-3"
              placeholder="Full Address"
              value={newAddress}
              onChange={e => setNewAddress(e.target.value)}
            />
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={handleSaveEditAddress}
              disabled={adding}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Delete Address Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
              onClick={() => setShowDeleteModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 text-red-600">Delete Address</h3>
            <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{deleteAddress?.name}</span>?</p>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white mb-2"
              onClick={confirmDeleteAddress}
              disabled={adding}
            >
              Yes, Delete
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 