"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Package,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  MessageCircle,
  Calendar,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

interface Listing {
  id: string
  title: string
  category: string
  price: number
  condition: string
  description: string
  images: string[]
  status: "active" | "sold" | "removed"
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

interface Order {
  id: string
  productId: string
  productTitle: string
  amount: number
  buyerId: string
  buyerName: string
  buyerEmail: string
  status: string
  createdAt: string
  deliveryMethod: string
  paymentMethod: string
}

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState("listings")
  const [listings, setListings] = useState<Listing[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

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
    }

    // Load orders for user's listings
    const ordersData = localStorage.getItem("userOrders")
    if (ordersData) {
      const allOrders = JSON.parse(ordersData)
      const userListingIds = listings.map((l) => l.id)
      const userOrders = allOrders.filter((o: Order) => userListingIds.includes(o.productId))
      setOrders(userOrders)
    }
  }, [])

  const stats = {
    totalListings: listings.length,
    activeListings: listings.filter((l) => l.status === "active").length,
    soldListings: listings.filter((l) => l.status === "sold").length,
    totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
    totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0),
    totalOrders: orders.length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "sold":
        return "bg-blue-100 text-blue-800"
      case "removed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-accent pb-20">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center text-white mb-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-semibold">My Listings & Sales</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalListings}</div>
            <div className="text-xs text-white/80">Total Items</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
            <div className="text-xs text-white/80">Orders</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">₹{(stats.totalRevenue / 1000).toFixed(0)}K</div>
            <div className="text-xs text-white/80">Revenue</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings">My Items ({stats.totalListings})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({stats.totalOrders})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-4 space-y-4">
            {listings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-4">Start selling by creating your first listing</p>
                  <Link href="/sell">
                    <Button>Create Listing</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <Card key={listing.id}>
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
                              <h3 className="font-semibold">{listing.title}</h3>
                              <p className="text-primary font-bold">₹{listing.price?.toLocaleString()}</p>
                            </div>
                            <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{listing.views || 0} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{listing.comments?.length || 0} comments</span>
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
                                      <p className="text-primary font-bold text-lg">
                                        ₹{listing.price?.toLocaleString()}
                                      </p>
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
                                <Button size="sm" variant="outline" className="text-red-600">
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
          </TabsContent>

          <TabsContent value="orders" className="mt-4 space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">Orders for your listings will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{order.productTitle}</h3>
                          <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                        </div>
                        <Badge className={getOrderStatusColor(order.status)}>{order.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground">Buyer</p>
                          <p className="font-medium">{order.buyerName}</p>
                          <p className="text-xs text-muted-foreground">{order.buyerEmail}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-bold text-primary text-lg">₹{order.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Payment Method</p>
                          <p>{order.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Delivery</p>
                          <p>{order.deliveryMethod}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Ordered on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex space-x-2">
                          <Link href={`/chat/${order.buyerId}`}>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Chat
                            </Button>
                          </Link>
                          {(order.status === "confirmed" || order.status === "pending") && (
                            <Button size="sm" variant="destructive">
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{stats.soldListings}</div>
                  <div className="text-sm text-muted-foreground">Items Sold</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{stats.activeListings}</div>
                  <div className="text-sm text-muted-foreground">Active Listings</div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Sales chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
