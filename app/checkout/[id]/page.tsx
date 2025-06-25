"use client";
import React from "react"; // ✅ Add this line
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, CreditCard, Truck, User, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [deliveryMethod, setDeliveryMethod] = useState("pickup")
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [processing, setProcessing] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [acceptedOffer, setAcceptedOffer] = useState<any>(null)

  useEffect(() => {
    const loadProductData = () => {
      try {
        // Get product data from localStorage
        const listingsData = localStorage.getItem("userListings")
        if (listingsData) {
          const listings = JSON.parse(listingsData)
          const currentProduct = listings.find((l: any) => l.id === id)

          if (currentProduct) {
            setProduct(currentProduct)

            // Check if this is from an accepted offer
            const offerId = searchParams.get("offer")
            if (offerId && currentProduct.offers) {
              const offer = currentProduct.offers.find((o: any) => o.id === offerId && o.status === "accepted")
              if (offer) {
                setAcceptedOffer(offer)
              }
            }
          } else {
            // Fallback to mock data if product not found
            setProduct({
              id: id,
              title: "iPhone 13 Pro Max 256GB",
              price: 45000,
              image: "/placeholder.svg?height=100&width=100",
              seller: "Rahul Kumar",
              college: "IIT Delhi",
              condition: "Excellent",
            })
          }
        } else {
          // Fallback to mock data if no listings
          setProduct({
            id: id,
            title: "iPhone 13 Pro Max 256GB",
            price: 45000,
            image: "/placeholder.svg?height=100&width=100",
            seller: "Rahul Kumar",
            college: "IIT Delhi",
            condition: "Excellent",
          })
        }
      } catch (error) {
        console.error("Error loading product data:", error)
        // Set fallback data
        setProduct({
          id: id,
          title: "iPhone 13 Pro Max 256GB",
          price: 45000,
          image: "/placeholder.svg?height=100&width=100",
          seller: "Rahul Kumar",
          college: "IIT Delhi",
          condition: "Excellent",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProductData()
  }, [id, searchParams])

  const deliveryCost = deliveryMethod === "gradkart" ? 99 : 0
  const productPrice = acceptedOffer ? acceptedOffer.amount : product?.price || 0
  const platformFee = Math.round(productPrice * 0.02) // 2% platform fee
  const total = productPrice + deliveryCost + platformFee

  const handlePlaceOrder = async () => {
    if (deliveryMethod === "gradkart" && !address.trim()) {
      alert("Please enter delivery address")
      return
    }

    setProcessing(true)

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || '{"id": "user123", "name": "John Doe", "email": "john@example.com"}',
      )

      // Create order object
      const order = {
        id: `ORD${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        amount: total,
        productPrice: productPrice,
        deliveryMethod,
        paymentMethod,
        address: deliveryMethod !== "pickup" ? address : null,
        notes,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        buyerId: currentUser.id || "unknown",
        buyerName: currentUser.name || "Unknown Buyer",
        buyerEmail: currentUser.email || "",
        sellerName: product.seller,
        isOfferPurchase: !!acceptedOffer,
        offerId: acceptedOffer?.id || null,
        offerAmount: acceptedOffer?.amount || null,
      }

      // Store order in localStorage
      const existingOrders = JSON.parse(localStorage.getItem("userOrders") || "[]")
      existingOrders.push(order)
      localStorage.setItem("userOrders", JSON.stringify(existingOrders))

      // If this was an accepted offer, mark the product as sold
      if (acceptedOffer) {
        const listingsData = localStorage.getItem("userListings")
        if (listingsData) {
          const listings = JSON.parse(listingsData)
          const updatedListings = listings.map((l: any) => {
            if (l.id === id) {
              return {
                ...l,
                status: "in_progress",
                soldTo: currentUser.name,
                soldAt: new Date().toISOString(),
              }
            }
            return l
          })
          localStorage.setItem("userListings", JSON.stringify(updatedListings))
        }
      }

      console.log("Order created:", order)

      // Navigate to success page
      router.push(`/order-success/${order.id}`)
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Failed to place order. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Product not found</p>
          <Link href="/home">
            <Button>Go Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-accent">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center text-white">
          <Link href={`/product/${id}`}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-semibold">Checkout</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Offer Info (if applicable) */}
        {acceptedOffer && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Accepted Offer</span>
              </div>
              <p className="text-sm text-green-700">
                You're purchasing this item for your accepted offer of ₹{acceptedOffer.amount.toLocaleString()}
                {acceptedOffer.comment && <span className="block mt-1 italic">"{acceptedOffer.comment}"</span>}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Product Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <img
                src={product.image || "/placeholder.svg?height=100&width=100"}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Sold by {product.seller} • {product.college}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary">{product.condition}</Badge>
                  <span className="font-bold text-primary">
                    ₹{productPrice.toLocaleString()}
                    {acceptedOffer && <span className="text-sm text-muted-foreground ml-1">(Offer price)</span>}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="pickup" id="pickup" />
                <User className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <Label htmlFor="pickup" className="font-medium cursor-pointer">
                    Pickup from Seller
                  </Label>
                  <p className="text-sm text-muted-foreground">Meet at {product.college}</p>
                </div>
                <Badge variant="secondary">Free</Badge>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="gradkart" id="gradkart" />
                <Truck className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <Label htmlFor="gradkart" className="font-medium cursor-pointer">
                    GradKart Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground">Delivered in 1-2 days</p>
                </div>
                <Badge>₹99</Badge>
              </div>
            </RadioGroup>

            {deliveryMethod === "gradkart" && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete delivery address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="upi" id="upi" />
                <CreditCard className="w-5 h-5 text-gray-400" />
                <Label htmlFor="upi" className="font-medium cursor-pointer flex-1">
                  UPI Payment
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="w-5 h-5 text-gray-400" />
                <Label htmlFor="card" className="font-medium cursor-pointer flex-1">
                  Credit/Debit Card
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="cod" id="cod" />
                <MapPin className="w-5 h-5 text-gray-400" />
                <Label htmlFor="cod" className="font-medium cursor-pointer flex-1">
                  Cash on Delivery
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Special Instructions (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any special instructions for the seller or delivery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Price Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Item Price</span>
              <span>₹{productPrice.toLocaleString()}</span>
            </div>

            {deliveryCost > 0 && (
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>₹{deliveryCost}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">₹{total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-800 mb-1">Secure Transaction</p>
                <ul className="text-green-700 space-y-1 text-xs">
                  <li>• 7-day return policy</li>
                  <li>• Dispute resolution support</li>
                  <li>• Verified seller guarantee</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          className="w-full h-12 text-lg"
          disabled={processing || (deliveryMethod === "gradkart" && !address.trim())}
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Order...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 w-5 h-5" />
              Place Order - ₹{total.toLocaleString()}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
