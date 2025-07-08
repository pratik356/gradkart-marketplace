"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, X, Upload, AlertCircle, Truck, User, Package } from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

export default function SellPage() {
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [condition, setCondition] = useState("")
  const [shipping, setShipping] = useState("")

  const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && images.length < 5) {
      const imageUrl = URL.createObjectURL(file)
      setImages([...images, imageUrl])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!title || !category || !price || images.length === 0) {
      alert("Please fill all required fields and add at least one image")
      return
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

    const newListing = {
      id: Date.now().toString(),
      title,
      category,
      description,
      price: Number.parseFloat(price),
      condition,
      shipping,
      images,
      status: "active",
      createdAt: new Date().toISOString(),
      sellerId: currentUser.id || "unknown",
      sellerName: currentUser.name || "Unknown Seller",
      sellerEmail: currentUser.email || "",
      sellerCollege: currentUser.college || "Unknown College",
    }

    // Store listing in localStorage
    const existingListings = JSON.parse(localStorage.getItem("userListings") || "[]")
    existingListings.push(newListing)
    localStorage.setItem("userListings", JSON.stringify(existingListings))

    alert("Item listed successfully!")
    // Reset form
    setImages([])
    setTitle("")
    setCategory("")
    setDescription("")
    setPrice("")
    setCondition("")
    setShipping("")
  }

  return (
    <div className="min-h-screen bg-accent pb-20">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center text-white">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-semibold">Sell Item</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Images</CardTitle>
            <p className="text-sm text-muted-foreground">Add up to 5 photos</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 w-6 h-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  <input type="file" accept="image/*" onChange={addImage} className="hidden" />
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-xs">Add Photo</span>
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                placeholder="e.g., iPhone 13 Pro Max 256GB"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="sports">Sports & Fitness</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Brand New</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item, mention any defects, reason for selling..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Commission Info</p>
                <p className="text-yellow-700">
                  GradKart charges 9% commission on successful sales. You'll receive ₹
                  {price ? Math.round(Number.parseFloat(price) * 0.91) : 0} after commission.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="shipping"
                  value="pickup"
                  checked={shipping === "pickup"}
                  onChange={(e) => setShipping(e.target.value)}
                  className="text-primary"
                />
                <User className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium">Buyer Pickup</p>
                  <p className="text-sm text-muted-foreground">Buyer collects from you</p>
                </div>
                <Badge variant="secondary">Free</Badge>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="shipping"
                  value="self"
                  checked={shipping === "self"}
                  onChange={(e) => setShipping(e.target.value)}
                  className="text-primary"
                />
                <Package className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium">Self Delivery</p>
                  <p className="text-sm text-muted-foreground">You deliver to buyer</p>
                </div>
                <Badge variant="secondary">Free</Badge>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="shipping"
                  value="gradkart"
                  checked={shipping === "gradkart"}
                  onChange={(e) => setShipping(e.target.value)}
                  className="text-primary"
                />
                <Truck className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium">GradKart Delivery</p>
                  <p className="text-sm text-muted-foreground">We handle pickup & delivery</p>
                </div>
                <Badge>₹50-150</Badge>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="space-y-3">
          <Button className="w-full h-12 text-lg" onClick={handleSubmit}>
            <Upload className="mr-2 w-5 h-5" />
            List Item for Sale
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By listing, you agree to our Terms of Service and accept a 9% commission on successful sales.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
