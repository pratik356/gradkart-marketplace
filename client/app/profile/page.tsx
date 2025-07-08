"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Star,
  ShoppingBag,
  Package,
  Settings,
  HelpCircle,
  Shield,
  Bell,
  MapPin,
  CreditCard,
  LogOut,
  ChevronRight,
  Edit,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [notifications, setNotifications] = useState(true)
  const [privacyMode, setPrivacyMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUserData(JSON.parse(currentUser))
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userLocation")
    localStorage.removeItem("locationSkipped")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-accent pb-20">
      {/* Header */}
      <div className="gradient-bg p-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-xl font-bold">Profile</h1>
          <Link href="/profile/edit">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Edit className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Profile Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" />
            <AvatarFallback className="text-2xl">
              {userData?.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-white">
            <h2 className="text-xl font-bold">{userData?.name || "Student Name"}</h2>
            <p className="text-white/80">Computer Science</p>
            <p className="text-white/80 text-sm">{userData?.college || "College Name"}</p>
            <div className="flex items-center mt-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm">4.9 (47 reviews)</span>
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {/* Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">23</div>
                <div className="text-xs text-muted-foreground">Items Sold</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">15</div>
                <div className="text-xs text-muted-foreground">Items Bought</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">₹45K</div>
                <div className="text-xs text-muted-foreground">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/sell">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Sell Item</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/orders">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">My Orders</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/profile/personal-info">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Personal Information</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link href="/profile/address">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Address & Location</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link href="/profile/payment">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Payment Methods</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/help">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Help Center</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link href="/profile/disputes">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">My Disputes</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link href="/raise-dispute">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Raise Dispute</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link href="/contact">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Contact Support</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Push Notifications</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Privacy Mode</span>
              </div>
              <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground py-4">
          <p>GradKart v1.0.0</p>
          <p>Made with ❤️ for students</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
