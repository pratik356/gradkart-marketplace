"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Users,
  ShoppingCart,
  RefreshCw,
  Search,
  Download,
  Check,
  X,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Ban,
  Eye,
  AlertTriangle,
  MessageSquare,
  FileText,
  ImageIcon,
  Mail,
  Package,
} from "lucide-react"
import { AdminNav } from "@/components/admin-nav"

interface User {
  id: string
  name: string
  email: string
  phone: string
  college?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  verificationType: "email" | "id"
  documentUrl?: string
  documentName?: string
  isBlocked?: boolean
  blockReason?: string
  blockedAt?: string
}

interface Dispute {
  id: string
  type: string
  orderId: string
  subject: string
  description: string
  evidence: Array<{
    name: string
    url: string
    type: string
  }>
  status: "pending" | "investigating" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  createdAt: string
  userId: string
  resolution?: string
  resolvedAt?: string
}

interface Order {
  id: string
  productId: string
  productTitle: string
  amount: number
  deliveryMethod: string
  paymentMethod: string
  status: string
  createdAt: string
  address?: string
  notes?: string
}

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
  sellerName?: string
  sellerEmail?: string
  sellerCollege?: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [blockReason, setBlockReason] = useState("")
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [disputeResolution, setDisputeResolution] = useState("")

  // Real data states
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [disputes, setDisputes] = useState<Dispute[]>([])

  const loadData = () => {
    setRefreshing(true)

    try {
      // Load users
      const signupData = localStorage.getItem("signupData")
      if (signupData) {
        const userData = JSON.parse(signupData)
        setUsers(Array.isArray(userData) ? userData : [userData])
      } else {
        setUsers([])
      }

      // Load orders
      const ordersData = localStorage.getItem("userOrders")
      if (ordersData) {
        setOrders(JSON.parse(ordersData))
      } else {
        setOrders([])
      }

      // Load listings
      const listingsData = localStorage.getItem("userListings")
      if (listingsData) {
        setListings(JSON.parse(listingsData))
      } else {
        setListings([])
      }

      // Load disputes
      const disputesData = localStorage.getItem("disputes")
      if (disputesData) {
        setDisputes(JSON.parse(disputesData))
      } else {
        setDisputes([])
      }

      console.log("Admin Panel Data Loaded:")
      console.log("Users:", users.length)
      console.log("Orders:", orders.length)
      console.log("Listings:", listings.length)
      console.log("Disputes:", disputes.length)
    } catch (error) {
      console.error("Error loading data:", error)
    }

    setTimeout(() => setRefreshing(false), 1000)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    pendingUsers: users.filter((u) => u.status === "pending").length,
    approvedUsers: users.filter((u) => u.status === "approved").length,
    rejectedUsers: users.filter((u) => u.status === "rejected").length,
    blockedUsers: users.filter((u) => u.isBlocked).length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
    totalCommission: orders.reduce((sum, order) => sum + Math.round(order.amount * 0.09), 0), // 9% commission
    activeListings: listings.filter((l) => l.status === "active").length,
    totalListings: listings.length,
    pendingDisputes: disputes.filter((d) => d.status === "pending").length,
    totalDisputes: disputes.length,
  }

  const handleUserAction = (userId: string, action: "approve" | "reject") => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, status: action === "approve" ? "approved" : "rejected" } : user,
    )
    setUsers(updatedUsers)
    localStorage.setItem("signupData", JSON.stringify(updatedUsers))

    const actionText = action === "approve" ? "approved" : "rejected"
    alert(`User ${actionText} successfully! They will see the update immediately.`)
  }

  const handleBlockUser = (userId: string) => {
    if (!blockReason.trim()) {
      alert("Please provide a reason for blocking")
      return
    }

    const updatedUsers = users.map((user) =>
      user.id === userId
        ? {
            ...user,
            isBlocked: true,
            blockReason,
            blockedAt: new Date().toISOString(),
          }
        : user,
    )
    setUsers(updatedUsers)
    localStorage.setItem("signupData", JSON.stringify(updatedUsers))

    // Update current user if they're the one being blocked
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id === userId) {
        const blockedUser = updatedUsers.find((u) => u.id === userId)
        localStorage.setItem("currentUser", JSON.stringify(blockedUser))
      }
    }

    setBlockReason("")
    setSelectedUser(null)
    alert("User blocked successfully!")
  }

  const handleUnblockUser = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId
        ? {
            ...user,
            isBlocked: false,
            blockReason: null,
            blockedAt: null,
          }
        : user,
    )
    setUsers(updatedUsers)
    localStorage.setItem("signupData", JSON.stringify(updatedUsers))

    // Update current user if they're the one being unblocked
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id === userId) {
        const unblockedUser = updatedUsers.find((u) => u.id === userId)
        localStorage.setItem("currentUser", JSON.stringify(unblockedUser))
      }
    }

    alert("User unblocked successfully!")
  }

  const handleDisputeAction = (disputeId: string, action: "resolve" | "close", resolution?: string) => {
    const updatedDisputes = disputes.map((dispute) =>
      dispute.id === disputeId
        ? {
            ...dispute,
            status: action === "resolve" ? "resolved" : "closed",
            resolution: resolution || "",
            resolvedAt: new Date().toISOString(),
          }
        : dispute,
    )
    setDisputes(updatedDisputes)
    localStorage.setItem("disputes", JSON.stringify(updatedDisputes))

    setDisputeResolution("")
    setSelectedDispute(null)
    alert(`Dispute ${action}d successfully!`)
  }

  const exportData = (type: "users" | "orders" | "listings" | "disputes") => {
    let data, filename
    switch (type) {
      case "users":
        data = users
        filename = "gradkart-users.json"
        break
      case "orders":
        data = orders
        filename = "gradkart-orders.json"
        break
      case "listings":
        data = listings
        filename = "gradkart-listings.json"
        break
      case "disputes":
        data = disputes
        filename = "gradkart-disputes.json"
        break
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDisputes = disputes.filter(
    (dispute) =>
      dispute.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-accent">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-xl font-bold">GradKart Admin Panel</h1>
            <p className="text-white/80 text-sm">Real-time platform management</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={loadData}
              disabled={refreshing}
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <AdminNav />
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">
              Users ({stats.totalUsers})
              {stats.pendingUsers > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {stats.pendingUsers}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="listings">
              Listings ({stats.totalListings})
              {stats.activeListings > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {stats.activeListings}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="disputes">
              Disputes ({stats.totalDisputes})
              {stats.pendingDisputes > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {stats.pendingDisputes}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <div className="text-xs text-muted-foreground">Total Users</div>
                  <div className="flex justify-center space-x-1 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      ✅ {stats.approvedUsers}
                    </Badge>
                    <Badge variant="destructive" className="text-xs">
                      ⏳ {stats.pendingUsers}
                    </Badge>
                    {stats.blockedUsers > 0 && (
                      <Badge variant="destructive" className="text-xs bg-red-600">
                        🚫 {stats.blockedUsers}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalDisputes}</div>
                  <div className="text-xs text-muted-foreground">Total Disputes</div>
                  {stats.pendingDisputes > 0 && (
                    <Badge variant="destructive" className="mt-1 text-xs">
                      {stats.pendingDisputes} pending
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <div className="text-xs text-muted-foreground">Total Orders</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">₹{(stats.totalCommission / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-muted-foreground">App Commission</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    9% of ₹{(stats.totalRevenue / 1000).toFixed(0)}K sales
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            {(stats.pendingUsers > 0 || stats.pendingDisputes > 0) && (
              <div className="space-y-3">
                {stats.pendingUsers > 0 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-6 h-6 text-yellow-600" />
                        <div>
                          <p className="font-semibold text-yellow-800">
                            {stats.pendingUsers} user{stats.pendingUsers > 1 ? "s" : ""} waiting for approval
                          </p>
                          <p className="text-sm text-yellow-700">Review their applications in the Users tab.</p>
                        </div>
                        <Button onClick={() => setActiveTab("users")} className="bg-yellow-600 hover:bg-yellow-700">
                          Review Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {stats.pendingDisputes > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <div>
                          <p className="font-semibold text-red-800">
                            {stats.pendingDisputes} dispute{stats.pendingDisputes > 1 ? "s" : ""} need attention
                          </p>
                          <p className="text-sm text-red-700">Review and resolve pending disputes.</p>
                        </div>
                        <Button onClick={() => setActiveTab("disputes")} className="bg-red-600 hover:bg-red-700">
                          Review Disputes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => exportData("users")} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>

            {filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No users found</h3>
                  <p className="text-muted-foreground">Users will appear here after they sign up</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    className={
                      user.status === "pending"
                        ? "border-yellow-200 bg-yellow-50"
                        : user.isBlocked
                          ? "border-red-200 bg-red-50"
                          : ""
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>
                            {user.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{user.name || "Unknown"}</h3>
                            {user.isBlocked && (
                              <Badge variant="destructive" className="text-xs">
                                <Ban className="w-3 h-3 mr-1" />
                                BLOCKED
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-muted-foreground">{user.email || "No email"}</p>
                            <Mail className="w-3 h-3 text-gray-400" />
                          </div>
                          <p className="text-sm text-muted-foreground">{user.phone || "No phone"}</p>
                          {user.college && <p className="text-sm text-muted-foreground">{user.college}</p>}
                          {user.verificationType === "id" && (
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <FileText className="w-3 h-3 mr-1" />
                                ID Upload
                              </Badge>
                              {user.documentUrl && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="text-xs">
                                      <Eye className="w-3 h-3 mr-1" />
                                      View Document
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Uploaded Document - {user.name}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="text-sm">
                                        <p>
                                          <strong>File Name:</strong> {user.documentName}
                                        </p>
                                        <p>
                                          <strong>Email:</strong> {user.email}
                                        </p>
                                        <p>
                                          <strong>Uploaded:</strong> {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                      {user.documentUrl.startsWith("data:image") ? (
                                        <img
                                          src={user.documentUrl || "/placeholder.svg"}
                                          alt="Student ID Document"
                                          className="w-full max-h-96 object-contain border rounded-lg"
                                        />
                                      ) : (
                                        <div className="flex items-center justify-center p-8 border rounded-lg">
                                          <div className="text-center">
                                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">PDF Document</p>
                                            <p className="text-xs text-muted-foreground">{user.documentName}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          )}
                          {user.isBlocked && user.blockReason && (
                            <p className="text-sm text-red-600 mt-1">
                              <strong>Block Reason:</strong> {user.blockReason}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              user.status === "approved"
                                ? "default"
                                : user.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={
                              user.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : user.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {user.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {user.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                            {user.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                            {user.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          {user.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleUserAction(user.id, "approve")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUserAction(user.id, "reject")}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}

                          {user.isBlocked ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnblockUser(user.id)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Shield className="w-4 h-4 mr-1" />
                              Unblock
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  Block
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Block User - {user.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="block-reason">Reason for blocking</Label>
                                    <Textarea
                                      id="block-reason"
                                      placeholder="Provide a detailed reason for blocking this user..."
                                      value={blockReason}
                                      onChange={(e) => setBlockReason(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() => handleBlockUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Block User
                                    </Button>
                                    <Button variant="outline" onClick={() => setSelectedUser(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="disputes" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search disputes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => exportData("disputes")} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>

            {filteredDisputes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No disputes found</h3>
                  <p className="text-muted-foreground">Disputes will appear here when users raise them</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredDisputes.map((dispute) => (
                  <Card
                    key={dispute.id}
                    className={dispute.status === "pending" ? "border-orange-200 bg-orange-50" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{dispute.subject}</h3>
                            <Badge
                              variant={
                                dispute.priority === "high"
                                  ? "destructive"
                                  : dispute.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {dispute.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Type:</strong> {dispute.type.replace("-", " ")} | <strong>ID:</strong> {dispute.id}
                          </p>
                          {dispute.orderId !== "N/A" && (
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Order ID:</strong> {dispute.orderId}
                            </p>
                          )}
                          <p className="text-sm mb-2">{dispute.description}</p>
                          {dispute.evidence.length > 0 && (
                            <div className="mb-2">
                              <div className="flex items-center space-x-2 mb-2">
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-muted-foreground">
                                  {dispute.evidence.length} evidence file{dispute.evidence.length > 1 ? "s" : ""}{" "}
                                  attached
                                </span>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="text-xs">
                                      <Eye className="w-3 h-3 mr-1" />
                                      View Evidence
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Dispute Evidence - {dispute.subject}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dispute.evidence.map((evidence, index) => (
                                          <div key={index} className="space-y-2">
                                            <p className="text-sm font-medium">
                                              Evidence {index + 1}: {evidence.name}
                                            </p>
                                            {evidence.type.startsWith("image/") ? (
                                              <img
                                                src={evidence.url || "/placeholder.svg"}
                                                alt={`Evidence ${index + 1}`}
                                                className="w-full max-h-64 object-contain border rounded-lg"
                                              />
                                            ) : (
                                              <div className="flex items-center justify-center p-8 border rounded-lg">
                                                <div className="text-center">
                                                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                                  <p className="text-sm text-muted-foreground">PDF Document</p>
                                                  <p className="text-xs text-muted-foreground">{evidence.name}</p>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          )}
                          {dispute.resolution && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                              <p className="text-sm font-medium text-green-800">Resolution:</p>
                              <p className="text-sm text-green-700">{dispute.resolution}</p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              dispute.status === "resolved"
                                ? "default"
                                : dispute.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              dispute.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : dispute.status === "pending"
                                  ? "bg-orange-100 text-orange-800"
                                  : ""
                            }
                          >
                            {dispute.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </p>
                          {dispute.status === "pending" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" className="mt-2" onClick={() => setSelectedDispute(dispute)}>
                                  Resolve
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Resolve Dispute - {dispute.subject}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="resolution">Resolution Details</Label>
                                    <Textarea
                                      id="resolution"
                                      placeholder="Provide resolution details and actions taken..."
                                      value={disputeResolution}
                                      onChange={(e) => setDisputeResolution(e.target.value)}
                                      rows={4}
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() => handleDisputeAction(dispute.id, "resolve", disputeResolution)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Mark as Resolved
                                    </Button>
                                    <Button variant="outline" onClick={() => handleDisputeAction(dispute.id, "close")}>
                                      Close Dispute
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="revenue" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Revenue Dashboard</h2>
              <Button onClick={() => exportData("orders")} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export Revenue
              </Button>
            </div>

            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">₹{stats.totalCommission.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Commission Earned</div>
                  <div className="text-xs text-muted-foreground mt-1">9% of total sales</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">₹{stats.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Sales Volume</div>
                  <div className="text-xs text-muted-foreground mt-1">{stats.totalOrders} transactions</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    ₹{stats.totalOrders > 0 ? Math.round(stats.totalCommission / stats.totalOrders) : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Commission/Order</div>
                  <div className="text-xs text-muted-foreground mt-1">Per transaction</div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Breakdown */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Commission Breakdown by Order</h3>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">No revenue data available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const commission = Math.round(order.amount * 0.09)
                      const customerData = users.find((u) => u.phone === "+91 98765 43210") // Mock customer lookup

                      return (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div>
                                <p className="font-medium text-sm">{order.productTitle}</p>
                                <p className="text-xs text-muted-foreground">Order ID: {order.id}</p>
                                <p className="text-xs text-muted-foreground">
                                  Customer: {customerData?.name || "Unknown"} • {customerData?.email || "No email"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">₹{commission}</div>
                            <div className="text-xs text-muted-foreground">from ₹{order.amount.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Student Sales Dashboard</h2>
              <Button onClick={() => exportData("users")} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export Sales Data
              </Button>
            </div>

            {/* Sales Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {users.filter((u) => u.status === "approved").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Sellers</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {listings.filter((l) => l.status === "active").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Listings</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {listings.filter((l) => l.status === "sold").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Items Sold</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{orders.length > 0 ? Math.round(stats.totalRevenue / orders.length) : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Sale Value</div>
                </CardContent>
              </Card>
            </div>

            {/* Student Sales Details */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Student Sales Performance</h3>
                {users.filter((u) => u.status === "approved").length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">No approved students yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users
                      .filter((u) => u.status === "approved")
                      .map((student) => {
                        // Mock sales data for each student
                        const studentOrders = orders.filter((o) => Math.random() > 0.5) // Mock assignment
                        const studentListings = listings.filter((l) => Math.random() > 0.3) // Mock assignment
                        const totalSales = studentOrders.reduce((sum, order) => sum + order.amount, 0)
                        const totalCommission = Math.round(totalSales * 0.09)

                        return (
                          <Card key={student.id} className="border-l-4 border-l-primary">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-4">
                                <Avatar>
                                  <AvatarImage src="/placeholder.svg?height=50&width=50" />
                                  <AvatarFallback>
                                    {student.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("") || "S"}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold">{student.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {student.college || "Unknown College"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{student.email}</p>
                                  <p className="text-sm text-muted-foreground">{student.phone}</p>
                                </div>

                                <div className="text-right space-y-1">
                                  <div className="text-sm">
                                    <span className="font-medium">Sales: </span>
                                    <span className="text-green-600 font-bold">₹{totalSales.toLocaleString()}</span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium">Commission: </span>
                                    <span className="text-purple-600 font-bold">₹{totalCommission}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {studentOrders.length} orders • {studentListings.length} listings
                                  </div>
                                </div>
                              </div>

                              {/* Student's Recent Orders */}
                              {studentOrders.length > 0 && (
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-xs font-medium text-muted-foreground mb-2">Recent Sales:</p>
                                  <div className="space-y-1">
                                    {studentOrders.slice(0, 3).map((order) => (
                                      <div key={order.id} className="flex justify-between text-xs">
                                        <span className="truncate">{order.productTitle}</span>
                                        <span className="font-medium">₹{order.amount.toLocaleString()}</span>
                                      </div>
                                    ))}
                                    {studentOrders.length > 3 && (
                                      <p className="text-xs text-muted-foreground">
                                        +{studentOrders.length - 3} more orders
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders and Listings tabs remain the same as before */}
          <TabsContent value="orders" className="mt-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Orders management (existing functionality)</p>
            </div>
          </TabsContent>

          <TabsContent value="listings" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => exportData("listings")} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>

            {/* Listings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{stats.totalListings}</div>
                  <div className="text-sm text-muted-foreground">Total Listings</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{stats.activeListings}</div>
                  <div className="text-sm text-muted-foreground">Active Listings</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <ShoppingCart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {listings.filter((l) => l.status === "sold").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Sold Items</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {listings.filter((l) => l.status === "removed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Removed Items</div>
                </CardContent>
              </Card>
            </div>

            {listings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No listings found</h3>
                  <p className="text-muted-foreground">Student listings will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {listings
                  .filter(
                    (listing) =>
                      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      listing.category?.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((listing) => {
                    const seller = users.find((u) => u.id === listing.sellerId) || {
                      name: listing.sellerName || "Unknown Seller",
                      email: listing.sellerEmail || "No email",
                      college: listing.sellerCollege || "Unknown College",
                    }

                    return (
                      <Card
                        key={listing.id}
                        className={
                          listing.status === "removed"
                            ? "border-red-200 bg-red-50"
                            : listing.status === "sold"
                              ? "border-green-200 bg-green-50"
                              : ""
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex space-x-4">
                            {/* Product Image */}
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                                </div>
                                <Badge
                                  variant={
                                    listing.status === "active"
                                      ? "default"
                                      : listing.status === "sold"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className={
                                    listing.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : listing.status === "sold"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                  }
                                >
                                  {listing.status}
                                </Badge>
                              </div>

                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>
                                  <strong>Category:</strong> {listing.category}
                                </p>
                                <p>
                                  <strong>Condition:</strong> {listing.condition}
                                </p>
                                <p>
                                  <strong>Seller:</strong> {seller.name} • {seller.college}
                                </p>
                                <p>
                                  <strong>Email:</strong> {seller.email}
                                </p>
                                <p>
                                  <strong>Listed:</strong> {new Date(listing.createdAt).toLocaleDateString()}
                                </p>
                              </div>

                              {listing.description && (
                                <p className="text-sm mt-2 line-clamp-2">{listing.description}</p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col space-y-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Listing Details - {listing.title}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {/* Images */}
                                    {listing.images && listing.images.length > 0 && (
                                      <div>
                                        <p className="font-medium mb-2">Images ({listing.images.length})</p>
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
                                      </div>
                                    )}

                                    {/* Details */}
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
                                        <p className="font-medium">Delivery</p>
                                        <p>{listing.shipping}</p>
                                      </div>
                                    </div>

                                    {listing.description && (
                                      <div>
                                        <p className="font-medium mb-2">Description</p>
                                        <p className="text-sm text-muted-foreground">{listing.description}</p>
                                      </div>
                                    )}

                                    {/* Seller Info */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <p className="font-medium mb-2">Seller Information</p>
                                      <div className="text-sm space-y-1">
                                        <p>
                                          <strong>Name:</strong> {seller.name}
                                        </p>
                                        <p>
                                          <strong>Email:</strong> {seller.email}
                                        </p>
                                        <p>
                                          <strong>College:</strong> {seller.college}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {listing.status === "active" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    const updatedListings = listings.map((l) =>
                                      l.id === listing.id ? { ...l, status: "removed" } : l,
                                    )
                                    setListings(updatedListings)
                                    localStorage.setItem("userListings", JSON.stringify(updatedListings))
                                    alert("Listing removed successfully!")
                                  }}
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              )}

                              {listing.status === "removed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => {
                                    const updatedListings = listings.map((l) =>
                                      l.id === listing.id ? { ...l, status: "active" } : l,
                                    )
                                    setListings(updatedListings)
                                    localStorage.setItem("userListings", JSON.stringify(updatedListings))
                                    alert("Listing restored successfully!")
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Restore
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            )}
          </TabsContent>

          {/* Orders and Listings tabs remain the same as before */}
          <TabsContent value="orders" className="mt-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Orders management (existing functionality)</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
