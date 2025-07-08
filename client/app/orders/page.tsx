"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Package,
  Truck,
  CheckCircle,
  MessageCircle,
  X,
  Clock,
  Eye,
  Edit,
  Trash2,
  Search,
  Plus,
  Heart,
  Calendar,
  ShoppingBag,
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

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("orders")
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [userListings, setUserListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [listingTab, setListingTab] = useState("all")
  const [cancelReason, setCancelReason] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => {
    // Get current user
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }

    // Load user orders
    const savedOrders = localStorage.getItem("userOrders")
    if (savedOrders) {
      const orders = JSON.parse(savedOrders)
      setUserOrders(orders)
    }

    // Load user's listings
    const listingsData = localStorage.getItem("userListings")
    if (listingsData) {
      const allListings = JSON.parse(listingsData)
      const myListings = allListings.filter((l: Listing) => l.sellerId === JSON.parse(user || "{}").id)
      setUserListings(myListings)
      setFilteredListings(myListings)
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
      setUserListings(sampleListings)
      setFilteredListings(sampleListings)
      localStorage.setItem("userListings", JSON.stringify(sampleListings))
    }
  }, [])

  useEffect(() => {
    let filtered = userListings

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by tab
    if (listingTab !== "all") {
      filtered = filtered.filter((listing) => listing.status === listingTab)
    }

    setFilteredListings(filtered)
  }, [searchQuery, listingTab, userListings])

  const orders = {
    active: userOrders.filter((order) => ["confirmed", "shipped", "pending_pickup"].includes(order.status)),
    completed: userOrders.filter((order) => ["delivered", "completed"].includes(order.status)),
    cancelled: userOrders.filter((order) => order.status === "cancelled"),
  }

  const listingStats = {
    total: userListings.length,
    active: userListings.filter((l) => l.status === "active").length,
    sold: userListings.filter((l) => l.status === "sold").length,
    pending: userListings.filter((l) => l.status === "pending").length,
    totalViews: userListings.reduce((sum, l) => sum + (l.views || 0), 0),
    totalLikes: userListings.reduce((sum, l) => sum + (l.likes || 0), 0),
  }

  const canCancelOrder = (order: any) => {
    const orderDate = new Date(order.createdAt)
    const now = new Date()
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)

    return (order.status === "confirmed" || order.status === "pending") && hoursDiff < 24
  }

  const handleCancelOrder = (orderId: string) => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation")
      return
    }

    const updatedOrders = userOrders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: "cancelled",
            cancelReason,
            cancelledAt: new Date().toISOString(),
          }
        : order,
    )

    setUserOrders(updatedOrders)
    localStorage.setItem("userOrders", JSON.stringify(updatedOrders))

    setCancelReason("")
    setSelectedOrder(null)
    alert("Order cancelled successfully!")
  }

  const deleteListing = (id: string) => {
    const updatedListings = userListings.filter((l) => l.id !== id)
    setUserListings(updatedListings)
    localStorage.setItem("userListings", JSON.stringify(updatedListings))
  }

  const markAsSold = (id: string) => {
    const updatedListings = userListings.map((l) => (l.id === id ? { ...l, status: "sold" as const } : l))
    setUserListings(updatedListings)
    localStorage.setItem("userListings", JSON.stringify(updatedListings))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "pending_pickup":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-green-100 text-green-800"
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
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "pending_pickup":
        return <Package className="w-4 h-4" />
      case "cancelled":
        return <X className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
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

  const renderOrderCard = (order: any) => (
    <Card key={order.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{order.productTitle}</h3>
                <p className="text-primary font-bold">₹{order.amount.toLocaleString()}</p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status}</span>
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground mb-2">
              <p>Order ID: {order.id}</p>
              <p>Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
              {order.cancelReason && (
                <p className="text-red-600 mt-1">
                  <strong>Cancel Reason:</strong> {order.cancelReason}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-2">
              {order.status !== "cancelled" && (
                <>
                  <Link href={`/chat/${order.id}`}>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </Link>
                  <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    ✓ Chat available
                  </div>
                </>
              )}

              {canCancelOrder(order) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="destructive" onClick={() => setSelectedOrder(order)}>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Order - {order.productTitle}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <div className="text-sm">
                            <p className="font-medium text-yellow-800">Cancellation Policy</p>
                            <p className="text-yellow-700">
                              Orders can be cancelled within 24 hours of placement or before shipping.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cancel-reason">Reason for cancellation</Label>
                        <Textarea
                          id="cancel-reason"
                          placeholder="Please provide a reason for cancelling this order..."
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleCancelOrder(order.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={!cancelReason.trim()}
                        >
                          Cancel Order
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                          Keep Order
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderListingCard = (listing: Listing) => (
    <Card key={listing.id} className="mb-4 hover:shadow-md transition-shadow">
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
                  <Button size="sm" variant="outline" className="text-green-600" onClick={() => markAsSold(listing.id)}>
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
  )

  return (
    <div className="min-h-screen bg-accent pb-20">
      {/* Header */}
      <div className="gradient-bg p-4">
        <h1 className="text-white text-xl font-bold">Orders & My Ads</h1>
        <p className="text-white/80 text-sm">Track your buying and selling activity</p>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">
              <ShoppingBag className="w-4 h-4 mr-2" />
              My Orders
            </TabsTrigger>
            <TabsTrigger value="ads">
              <Package className="w-4 h-4 mr-2" />
              My Ads ({listingStats.total})
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-4">
            <Tabs value="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active ({orders.active.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({orders.completed.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({orders.cancelled.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
                {orders.active.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No active orders</h3>
                    <p className="text-muted-foreground mb-4">Your current orders will appear here</p>
                    <Link href="/home">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div>{orders.active.map(renderOrderCard)}</div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                {orders.completed.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No completed orders</h3>
                    <p className="text-muted-foreground">Your completed transactions will appear here</p>
                  </div>
                ) : (
                  <div>{orders.completed.map(renderOrderCard)}</div>
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="mt-4">
                {orders.cancelled.length === 0 ? (
                  <div className="text-center py-12">
                    <X className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No cancelled orders</h3>
                    <p className="text-muted-foreground">Cancelled orders will appear here</p>
                  </div>
                ) : (
                  <div>{orders.cancelled.map(renderOrderCard)}</div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* My Ads Tab */}
          <TabsContent value="ads" className="mt-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">{listingStats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">{listingStats.active}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="bg-blue-100 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{listingStats.sold}</div>
                <div className="text-xs text-muted-foreground">Sold</div>
              </div>
              <div className="bg-purple-100 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-600">{listingStats.totalViews}</div>
                <div className="text-xs text-muted-foreground">Views</div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your ads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Add New Ad Button */}
            <div className="mb-4">
              <Link href="/sell">
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Ad
                </Button>
              </Link>
            </div>

            {/* Listing Tabs */}
            <Tabs value={listingTab} onValueChange={setListingTab} className="mb-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({listingStats.total})</TabsTrigger>
                <TabsTrigger value="active">Active ({listingStats.active})</TabsTrigger>
                <TabsTrigger value="sold">Sold ({listingStats.sold})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({listingStats.pending})</TabsTrigger>
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
              <div className="space-y-4">{filteredListings.map(renderListingCard)}</div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  )
}
