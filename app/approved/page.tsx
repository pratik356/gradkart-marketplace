"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Sparkles, ShoppingBag, Package, Users, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ApprovedPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/location-setup")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <CheckCircle className="w-16 h-16 text-green-600" />
            <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <CardTitle className="text-2xl text-green-800 mb-2">🎉 Welcome to GradKart!</CardTitle>
          <div className="bg-green-100 px-4 py-2 rounded-full">
            <span className="text-green-800 font-semibold">Account Approved ✅</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-green-700 font-semibold mb-2">Congratulations! Your student verification is complete.</p>
            <p className="text-muted-foreground text-sm">
              You're now part of India's most trusted student marketplace!
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-3 text-center">🚀 What you can do now:</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-xs font-medium">Buy Items</p>
                <p className="text-xs text-muted-foreground">From verified students</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-xs font-medium">Sell Items</p>
                <p className="text-xs text-muted-foreground">List your products</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-xs font-medium">Connect</p>
                <p className="text-xs text-muted-foreground">Chat with students</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-xs font-medium">Safe Trading</p>
                <p className="text-xs text-muted-foreground">Protected transactions</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🎁 Welcome Benefits:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Access to 50km radius marketplace</li>
              <li>✅ Verified student badge</li>
              <li>✅ Secure payment protection</li>
              <li>✅ 24/7 dispute resolution support</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/location-setup">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-lg h-12">
                <ShoppingBag className="mr-2 w-5 h-5" />
                Start Your Journey
              </Button>
            </Link>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Auto-redirecting in <span className="font-bold text-primary">{countdown}</span> seconds...
              </p>
            </div>
          </div>

          <div className="text-center border-t pt-4">
            <p className="text-xs text-muted-foreground">
              🔒 Your data is secure • 🛡️ Verified marketplace • 🎓 Students only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
