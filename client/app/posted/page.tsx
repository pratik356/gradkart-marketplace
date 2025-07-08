"use client"

import { useEffect, useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Eye, Home, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

function PostedPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [listingData, setListingData] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Get listing data from localStorage
    const listings = JSON.parse(localStorage.getItem("userListings") || "[]")
    const lastListing = listings[listings.length - 1]
    
    if (lastListing) {
      // Fix broken image URLs by replacing them with placeholder
      const fixedListing = {
        ...lastListing,
        // Generate listingId for existing listings that don't have one
        listingId: lastListing.listingId || listings.length.toString().padStart(10, '0'),
        images: lastListing.images ? lastListing.images.map((img: string) => {
          if (img && (img.startsWith('blob:') || img.startsWith('http://localhost') || img.includes('createObjectURL'))) {
            return "/placeholder.svg"
          }
          return img
        }) : []
      }
      setListingData(fixedListing)
    }

    // Get current user data
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
    setCurrentUser(user)
  }, [])

  if (!listingData) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-accent pb-20">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center justify-center text-white">
          <h1 className="text-xl font-semibold">Item Posted Successfully!</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Success Message */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                  Item Submitted Successfully! 🎉
                </h2>
                <p className="text-yellow-700">
                  Your item has been submitted for admin approval. 
                  You'll be notified once it's approved and goes live on GradKartGo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listing Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Your Submitted Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={listingData.images[0] || "/placeholder.svg"}
                  alt={listingData.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">{listingData.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {listingData.category}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {listingData.condition}
                  </Badge>
                  <Badge variant="destructive">
                    Pending Approval
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ₹{listingData.price.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Listing ID:</span>
                <p className="font-mono">{listingData.listingId || listingData.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted:</span>
                <p>{new Date(listingData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {listingData.reason && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">Reason for Selling:</p>
                <p className="text-sm text-blue-700">{listingData.reason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-yellow-900">Admin Review</p>
                  <p className="text-sm text-yellow-700">
                    Our team will review your listing within 24-48 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Approval Notification</p>
                  <p className="text-sm text-blue-700">
                    You'll receive a notification when your item is approved
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-green-900">Go Live</p>
                  <p className="text-sm text-green-700">
                    Once approved, your item will be visible to all students
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/my-ads">
            <Button className="w-full h-12 text-lg" variant="outline">
              <Eye className="mr-2 w-5 h-5" />
              View My Ads
            </Button>
          </Link>

          <Link href="/sell">
            <Button className="w-full h-12 text-lg">
              <Plus className="mr-2 w-5 h-5" />
              List Another Item
            </Button>
          </Link>

          <Link href="/home">
            <Button className="w-full h-12 text-lg" variant="outline">
              <Home className="mr-2 w-5 h-5" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Tips */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Respond quickly to buyer messages to increase your chances of selling</li>
              <li>• Keep your listing active and update photos if needed</li>
              <li>• Be honest about the item condition to avoid disputes</li>
              <li>• Consider offering a small discount for quick sales</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PostedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <PostedPageContent />
    </Suspense>
  )
} 