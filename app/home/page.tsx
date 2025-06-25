"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  BookOpen,
  Laptop,
  Sofa,
  Shirt,
  MoreHorizontal,
  Heart,
  MapPin,
  Star,
  Navigation,
} from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { LocationPermission } from "@/components/location-permission"
import { useRouter } from "next/navigation"

const categories = [
  { name: "Books", icon: BookOpen, color: "bg-blue-100 text-blue-600" },
  { name: "Electronics", icon: Laptop, color: "bg-purple-100 text-purple-600" },
  { name: "Furniture", icon: Sofa, color: "bg-green-100 text-green-600" },
  { name: "Fashion", icon: Shirt, color: "bg-pink-100 text-pink-600" },
  { name: "More", icon: MoreHorizontal, color: "bg-gray-100 text-gray-600" },
]

const mockFeaturedItems = [
  {
    id: 1,
    title: "iPhone 13 Pro Max",
    price: "₹45,000",
    originalPrice: "₹55,000",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Rahul K.",
    college: "IIT Delhi",
    distance: "2.3 km",
    rating: 4.8,
    condition: "Excellent",
  },
  {
    id: 2,
    title: "Engineering Mathematics Book Set",
    price: "₹800",
    originalPrice: "₹1,200",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Priya S.",
    college: "DTU",
    distance: "1.8 km",
    rating: 4.9,
    condition: "Good",
  },
  {
    id: 3,
    title: "Study Table with Chair",
    price: "₹3,500",
    originalPrice: "₹5,000",
    image: "/placeholder.svg?height=200&width=200",
    seller: "Amit R.",
    college: "NSUT",
    distance: "4.1 km",
    rating: 4.7,
    condition: "Very Good",
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<any>(null)
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)
  const [userStatus, setUserStatus] = useState<"pending" | "approved" | "rejected" | null>(null)
  const [featuredItems, setFeaturedItems] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [condition, setCondition] = useState("all")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/signup")
      return
    }
  
    const user = JSON.parse(currentUser)
    const signupData = localStorage.getItem("signupData")
  
    if (signupData) {
      const users = JSON.parse(signupData)
      const updatedUser = users.find((u: any) => u.id === user.id)
  
      if (updatedUser) {
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
  
        if (updatedUser.isBlocked) {
          router.push("/blocked")
          return
        }
  
        setUserStatus(updatedUser.status)
  
        if (updatedUser.status === "pending" || updatedUser.status === "rejected") {
          router.push("/approval-pending")
          return
        }
      } else {
        setUserStatus(user.status || "pending")
        if (user.status !== "approved") {
          router.push("/approval-pending")
          return
        }
      }
    }
  }, [router])
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
  
    if (userStatus === "approved" || user.status === "approved") {
      const storedLocation = localStorage.getItem("userLocation")
      const locationSkipped = localStorage.getItem("locationSkipped")
  
      if (storedLocation) {
        setUserLocation(JSON.parse(storedLocation))
      } else if (!locationSkipped) {
        setShowLocationPrompt(true)
      }
  
      const listingsData = localStorage.getItem("userListings")
      if (listingsData) {
        const allListings = JSON.parse(listingsData)
        const activeListings = allListings.filter((l) => l.status === "active")
        const nearbyListings = activeListings.filter(() => true) // simulate distance
        setFeaturedItems(nearbyListings.slice(0, 10))
      } else {
        setFeaturedItems(mockFeaturedItems)
      }
    }
  }, [userStatus])
    
  const filteredItems = useMemo(() => {
    let filtered = featuredItems

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filter by price range
    if (priceRange !== "all") {
      filtered = filtered.filter((item) => {
        const price = Number.parseFloat(item.price?.replace(/[₹,]/g, "") || "0")
        switch (priceRange) {
          case "under-1000":
            return price < 1000
          case "1000-5000":
            return price >= 1000 && price <= 5000
          case "5000-20000":
            return price >= 5000 && price <= 20000
          case "above-20000":
            return price > 20000
          default:
            return true
        }
      })
    }

    // Filter by condition
    if (condition !== "all") {
      filtered = filtered.filter((item) => item.condition?.toLowerCase() === condition.toLowerCase())
    }

    return filtered
  }, [searchQuery, selectedCategory, priceRange, condition, featuredItems])

  const handleLocationGranted = useCallback((location: any) => {
    localStorage.setItem("userLocation", JSON.stringify(location))
    setUserLocation(location)
    setShowLocationPrompt(false)
  }, [])

  const handleLocationSkip = useCallback(() => {
    localStorage.setItem("locationSkipped", "true")
    setShowLocationPrompt(false)
  }, [])

  const handleCategoryClick = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName.toLowerCase())
    setShowFilters(false)
  }, [])

  const handleViewAll = () => {
    // Navigate to browse page or show all items
    router.push("/browse")
  }

  // Show location prompt if needed
  if (showLocationPrompt) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <LocationPermission onLocationGranted={handleLocationGranted} onSkip={handleLocationSkip} showSkip={true} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-accent pb-20">
      {/* Header */}
      <div className="gradient-bg p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img src="/gradkart-logo.png" alt="GradKart" className="w-8 h-8" />
            <div>
              <h1 className="text-white text-xl font-bold">Hi, Student! 👋</h1>
              <div className="flex items-center text-white/80 text-sm">
                {userLocation ? (
                  <>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {userLocation.city}, {userLocation.state}
                    </span>
                  </>
                ) : (
                  <span>Find great deals near you</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!userLocation && (
              <Button size="sm" variant="secondary" onClick={() => setShowLocationPrompt(true)} className="text-xs">
                <Navigation className="w-3 h-3 mr-1" />
                Enable Location
              </Button>
            )}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="text-sm font-bold text-primary">GK</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={
                userLocation ? `Search near ${userLocation.city}...` : "Search for books, electronics, furniture..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 bg-white"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5 text-gray-400" />
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">All Categories</option>
                    <option value="books">Books</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                    <option value="fashion">Fashion</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Price Range</Label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">All Prices</option>
                    <option value="under-1000">Under ₹1,000</option>
                    <option value="1000-5000">₹1,000 - ₹5,000</option>
                    <option value="5000-20000">₹5,000 - ₹20,000</option>
                    <option value="above-20000">Above ₹20,000</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Condition</Label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">All Conditions</option>
                    <option value="new">New</option>
                    <option value="like new">Like New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all")
                    setPriceRange("all")
                    setCondition("all")
                    setShowFilters(false)
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Location Banner */}
        {userLocation && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Showing items within 50km of {userLocation.city}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Categories</h2>
          <div className="grid grid-cols-5 gap-3">
            {categories.map((category) => (
              <button key={category.name} onClick={() => handleCategoryClick(category.name)} className="text-center">
                <div
                  className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-2 mx-auto hover:scale-105 transition-transform`}
                >
                  <category.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Listings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{userLocation ? "Nearby Items" : "Featured Items"}</h2>
            <Button variant="link" className="text-primary p-0" onClick={handleViewAll}>
              View All
            </Button>
          </div>

          {(searchQuery || selectedCategory !== "all" || priceRange !== "all" || condition !== "all") && (
            <p className="text-sm text-muted-foreground mb-2">Showing {filteredItems.length} results</p>
          )}

          <div className="space-y-4">
            {(searchQuery || selectedCategory !== "all" || priceRange !== "all" || condition !== "all"
              ? filteredItems
              : featuredItems
            ).map((item) => (
              <Link key={item.id} href={`/product/${item.id}`}>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                          <Button variant="ghost" size="icon" className="w-6 h-6 -mt-1">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-bold text-primary">{item.price}</span>
                          <span className="text-xs text-muted-foreground line-through">{item.originalPrice}</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.condition}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span>{item.seller}</span>
                            <span>•</span>
                            <span>{item.college}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{item.distance} away</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
