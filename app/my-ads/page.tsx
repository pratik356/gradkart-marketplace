"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Package,
  Eye,
  Edit,
  Trash2,
  Search,
  Plus,
  Heart,
  MessageCircle,
  Calendar,
  CheckCircle,
  Clock,
  X,
} from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

interface Listing {
  id: string
  title: string
  category: string
  price: number
  condition: string
  description: string
  images: string[]
  status: "active" | "sold" | "removed" | "pending"
  createdAt: string
  shipping: string
  sellerId?: string
  views?: number
  likes?: number
  comments?: Array<{
    id: string
    userId: string
    userName: string
    userEmail: string
    comment: string
    createdAt: string
  }>
}

export default function MyAdsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Get current user
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }

    // Load user's listings
    const listingsData = localStorage.getItem("userListings")
    if (listingsData) {
      const allListings = JSON.parse(listingsData)
      const userListings = allListings.filter((l: Listing) => l.sellerId === JSON.parse(user || "{}").id)
      setListings(userListings)
      setFilteredListings(userListings)
    } else {
      // Create some sample listings for demo
      const sampleListings: Listing[] = [
        {
          id: "1",
          title: "MacBook Pro 13-inch M1",
          category: "Electronics",
          price: 85000,
          condition: "Like New",
          description: "Barely used MacBook Pro with M1 chip. Perfect for students.",
          images: ["/placeholder.svg?height=200&width=200"],
          status: "active",
          createdAt: new Date().toISOString(),
          shipping: "Pickup only",
          sellerId: JSON.parse(user || "{}").id,
          views: 45,
          likes: 12,
          comments: [
            {
              id: "c1",
              userId: "buyer1",
              userName: "John Doe",
              userEmail: "john@example.com",
              comment: "Is this still available?",
              createdAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: "2",
          title: "Engineering Textbooks Bundle",
          category: "Books",
          price: 2500,
          condition: "Good",
          description: "Complete set of engineering textbooks for 2nd year.",
          images: ["/placeholder.svg?height=200&width=200"],
          status: "active",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          shipping: "Both",
          sellerId: JSON.parse(user || "{}").id,
          views: 23,
          likes: 5,
          comments: [],
        },
        {
          id: "3",
          title: "Gaming Chair",
          category: "Furniture",
          price: 8000,
          condition: "Good",
          description: "Comfortable gaming chair, barely used.",
          images: ["/placeholder.svg?height=200&width=200"],
          status: "sold",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          shipping: "Pickup only",
          sellerId: JSON.parse(user || "{}").id,
          views: 67,
          likes: 18,
          comments: [],
        },
      ]
      setListings(sampleListings)
      setFilteredListings(sampleListings)
      localStorage.setItem("userListings", JSON.stringify(sampleListings))
    }
  }, [])

  useEffect(() => {
    let filtered = listings

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((listing) => listing.status === activeTab)
    }

    setFilteredListings(filtered)
  }, [searchQuery, activeTab, listings])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "sold":
        return "bg-blue-100 text-blue-800"
      case "removed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "sold":
        return <Package className="w-4 h-4" />
      case "removed":
        return <X className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    sold: listings.filter((l) => l.status === "sold").length,
    pending: listings.filter((l) => l.status === "pending").length,
    totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
    totalLikes: listings.reduce((sum, l) => sum + (l.likes || 0), 0),
  }

  const deleteListing = (id: string) => {
    const updatedListings = listings.filter((l) => l.id !== id)
    setListings(updatedListings)
    localStorage.setItem("userListings", JSON.stringify(updatedListings))
  }

  const markAsSold = (id: string) => {
    const updatedListings = listings.map((l) => (l.id === id ? { ...l, status: "sold" as const } : l))
    setListings(updatedListings)
    localStorage.setItem("userListings", JSON.stringify(updatedListings))
  }

  return (
    <div className="min-h-screen bg-accent pb-20">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center text-white mb-4">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-semibold">My Ads</h1>
          <div className="ml-auto">
            <Link href="/sell">
              <Button variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Post Ad
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-white">{stats.total}</div>
            <div className="text-xs text-white/80">Total</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-white">{stats.active}</div>
            <div className="text-xs text-white/80">Active</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-white">{stats.sold}</div>
            <div className="text-xs text-white/80">Sold</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-white">{stats.totalViews}</div>
            <div className="text-xs text-white/80">Views</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search your ads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      <div className="p-4">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="sold">Sold ({stats.sold})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchQuery ? "No ads found" : "No ads yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search terms" : "Start selling by creating your first ad"}
              </p>
              {!searchQuery && (
                <Link href="/sell">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Ad
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0] || "/placeholder.svg"}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{listing.title}</h3>
                          <p className="text-primary font-bold text-xl">₹{listing.price?.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {listing.category} • {listing.condition}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(listing.status)}
                          <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{listing.views || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{listing.likes || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{listing.comments?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{listing.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Images */}
                              {listing.images && listing.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                  {listing.images.map((image, index) => (
                                    <img
                                      key={index}
                                      src={image || "/placeholder.svg"}
                                      alt={`Product ${index + 1}`}
                                      className="w-full h-32 object-cover border rounded"
                                    />
                                  ))}
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="font-medium">Price</p>
                                  <p className="text-primary font-bold text-lg">₹{listing.price?.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Category</p>
                                  <p>{listing.category}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Condition</p>
                                  <p>{listing.condition}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Views</p>
                                  <p>{listing.views || 0}</p>
                                </div>
                              </div>

                              {listing.description && (
                                <div>
                                  <p className="font-medium mb-2">Description</p>
                                  <p className="text-sm text-muted-foreground">{listing.description}</p>
                                </div>
                              )}

                              {/* Comments */}
                              {listing.comments && listing.comments.length > 0 && (
                                <div>
                                  <p className="font-medium mb-2">Comments ({listing.comments.length})</p>
                                  <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {listing.comments.map((comment) => (
                                      <div key={comment.id} className="bg-gray-50 p-2 rounded text-sm">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-medium">{comment.userName}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p>{comment.comment}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {listing.status === "active" && (
                          <>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600"
                              onClick={() => markAsSold(listing.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Sold
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => deleteListing(listing.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
