"use client"
import React from "react"
import { useParams } from "next/navigation";

import { useState, useEffect, useMemo, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Heart,
  Share,
  Star,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Shield,
  Truck,
  User,
  ChevronLeft,
  ChevronRight,
  Send,
  Eye,
  CheckCircle,
  Clock,
  X,
} from "lucide-react"
import Link from "next/link"

const productImages = [
  "/placeholder.svg?height=400&width=400&text=Image1",
  "/placeholder.svg?height=400&width=400&text=Image2",
  "/placeholder.svg?height=400&width=400&text=Image3",
]

export default function ProductDetailPage() {
  const params = useParams(); // ✅ get the params object
  const id = params?.id as string; // ✅ define `id` safely
  const { toast } = useToast()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showCommentDialog, setShowCommentDialog] = useState(false)

  const [offers, setOffers] = useState<any[]>([])
  const [newOffer, setNewOffer] = useState("")
  const [offerComment, setOfferComment] = useState("")
  const [showOfferDialog, setShowOfferDialog] = useState(false)
  const [userOffers, setUserOffers] = useState<any[]>([])
  const [showOfferConfirmation, setShowOfferConfirmation] = useState(false)
  const [pendingOfferData, setPendingOfferData] = useState<any>(null)

  // Add product details state
  const [product, setProduct] = useState<any>(null)

  const minimumOfferAmount = useMemo(() => {
    if (!product) return 0
    const productPrice = Number.parseFloat(product.price?.toString().replace(/[₹,]/g, "") || "0")
    return productPrice * 0.9
  }, [product])

  const acceptedOffer = useMemo(() => {
    return offers.find((offer) => offer.buyerId === currentUser?.id && offer.status === "accepted")
  }, [offers, currentUser?.id])

  const pendingOffers = useMemo(() => {
    return offers.filter((offer) => offer.status === "pending")
  }, [offers])

      useEffect(() => {
    if (!id) return;

    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    const listingsData = localStorage.getItem("userListings");
    if (listingsData) {
      const listings = JSON.parse(listingsData);
      const currentListing = listings.find((l: any) => l.id === id);
      if (currentListing) {
        setProduct(currentListing);
        // ... (rest of your logic)
      }
    }
  }, [id]); // ✅ make sure `id` is in the dependency array




  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return

    const comment = {
      id: `comment_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      comment: newComment,
      createdAt: new Date().toISOString(),
    }

    // Update comments state
    const updatedComments = [...comments, comment]
    setComments(updatedComments)

    // Update localStorage
    const listingsData = localStorage.getItem("userListings")
    if (listingsData) {
      const listings = JSON.parse(listingsData)
      const updatedListings = listings.map((l: any) => {
        if (l.id === id) {
          return {
            ...l,
            comments: updatedComments,
          }
        }
        return l
      })
      localStorage.setItem("userListings", JSON.stringify(updatedListings))
    }

    setNewComment("")
    setShowCommentDialog(false)
    toast({
      title: "Comment Posted! 💬",
      description: "Your question has been posted. The seller will respond soon.",
      duration: 3000,
    })
  }

  const handleMakeOffer = useCallback(() => {
    if (!newOffer.trim() || !currentUser || !product) return

    const offerAmount = Number.parseFloat(newOffer)

    if (offerAmount < minimumOfferAmount) {
      alert(`Minimum offer amount is ₹${minimumOfferAmount.toLocaleString()}`)
      return
    }

    if (userOffers.length >= 3) {
      toast({
        title: "Maximum Offers Reached",
        description: "You have reached the maximum limit of 3 offers for this product. You can only buy at the listed price now.",
        duration: 5000,
      })
      return
    }

    // Show confirmation dialog for 2nd and 3rd offers
    if (userOffers.length >= 1) {
      setPendingOfferData({
        amount: offerAmount,
        comment: offerComment,
        offerNumber: userOffers.length + 1
      })
      setShowOfferConfirmation(true)
      return
    }

    // For first offer, proceed directly
    submitOffer(offerAmount, offerComment)
  }, [newOffer, currentUser, product, minimumOfferAmount, userOffers, offerComment])

  const submitOffer = (amount: number, comment: string) => {
    if (!currentUser || !product) return

    const offer = {
      id: `offer_${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      amount: amount,
      comment: comment,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    const updatedOffers = [...offers, offer]
    setOffers(updatedOffers)
    setUserOffers([...userOffers, offer])

    // Update localStorage
    const listingsData = localStorage.getItem("userListings")
    if (listingsData) {
      const listings = JSON.parse(listingsData)
      const updatedListings = listings.map((l: any) => {
        if (l.id === id) {
          return { ...l, offers: updatedOffers }
        }
        return l
      })
      localStorage.setItem("userListings", JSON.stringify(updatedListings))
    }

    setNewOffer("")
    setOfferComment("")
    setShowOfferDialog(false)
    setShowOfferConfirmation(false)
    setPendingOfferData(null)
    toast({
      title: "Offer Submitted! 📝",
      description: "Your offer has been sent to the seller. You'll be notified when they respond.",
      duration: 4000,
    })
  }

  const handleOfferAction = (offerId: string, action: "accept" | "reject") => {
    if (!currentUser || !product) return

    const updatedOffers = offers.map((offer) => {
      if (offer.id === offerId) {
        return { ...offer, status: action === "accept" ? "accepted" : "rejected" }
      }
      return offer
    })

    setOffers(updatedOffers)

    // Update localStorage
    const listingsData = localStorage.getItem("userListings")
    if (listingsData) {
      const listings = JSON.parse(listingsData)
      const updatedListings = listings.map((l: any) => {
        if (l.id === id) {
          return {
            ...l,
            offers: updatedOffers,
          }
        }
        return l
      })
      localStorage.setItem("userListings", JSON.stringify(updatedListings))
    }

    if (action === "accept") {
      toast({
        title: "Offer Accepted! 🎉",
        description: "The buyer has been notified and can now proceed to payment. Chat will be available after payment.",
        duration: 5000,
      })
    } else {
      toast({
        title: "Offer Rejected",
        description: "The offer has been rejected.",
        duration: 3000,
      })
    }
  }

  const getAcceptedOffer = () => {
    return offers.find((offer) => offer.buyerId === currentUser?.id && offer.status === "accepted")
  }

  return (
    <div className="min-h-screen bg-accent">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)}>
              <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="relative">
        <div className="aspect-square bg-white">
          <img
            src={productImages[currentImageIndex] || "/placeholder.svg"}
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>

        {productImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {productImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Product Info */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-xl font-bold mb-2">iPhone 13 Pro Max 256GB</h1>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-primary">₹45,000</span>
                    <span className="text-lg text-muted-foreground line-through">₹55,000</span>
                    <Badge variant="destructive">18% OFF</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <Badge variant="secondary">Excellent Condition</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (24 reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span>156 views</span>
                </div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                <span>2.3 km away • Available for pickup</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">Rahul Kumar</h3>
                <p className="text-sm text-muted-foreground">IIT Delhi • Computer Science</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm">4.8 (156 sales)</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    Verified
                  </Badge>
                </div>
              </div>
              <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Comment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Comment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="comment">Your Comment</Label>
                      <Textarea
                        id="comment"
                        placeholder="Ask questions about the product, condition, availability..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <Send className="w-4 h-4 mr-1" />
                        Post Comment
                      </Button>
                      <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Seller's Offer Management (only for product owner) */}
        {product && currentUser?.id === product.sellerId && offers.some((o) => o.status === "pending") && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">
                Pending Offers ({offers.filter((o) => o.status === "pending").length})
              </h3>
              <div className="space-y-3">
                {offers
                  .filter((offer) => offer.status === "pending")
                  .map((offer) => (
                    <div key={offer.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">₹{offer.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">by {offer.buyerName}</p>
                          {offer.comment && <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{offer.comment}</p>}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleOfferAction(offer.id, "accept")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleOfferAction(offer.id, "reject")}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        {comments.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Comments ({comments.length})</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {comment.userName
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              iPhone 13 Pro Max in excellent condition. Used for 8 months with screen protector and case always on.
              Battery health is 94%. No scratches or dents. Selling because upgrading to iPhone 15. Includes original
              box, charger, and unused EarPods.
            </p>
          </CardContent>
        </Card>

        {/* Delivery Options */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Delivery Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Pickup Available</p>
                  <p className="text-xs text-muted-foreground">Meet at IIT Delhi campus</p>
                </div>
                <Badge variant="secondary">Free</Badge>
              </div>

              <div className="flex items-center space-x-3 p-2 border rounded-lg">
                <Truck className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-sm">GradKart Delivery</p>
                  <p className="text-xs text-muted-foreground">Delivered in 1-2 days</p>
                </div>
                <Badge>₹99</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Availability Notice */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 mb-1">Chat Feature</p>
                <p className="text-orange-700 text-xs">
                  Chat with the seller will be available only after you place an order or make a payment. 
                  This ensures focused communication for serious buyers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">Safe Transaction Guaranteed</p>
                <ul className="text-blue-700 space-y-1 text-xs">
                  <li>• Verified student seller</li>
                  <li>• 7-day return policy</li>
                  <li>• Dispute resolution support</li>
                  <li>• Secure payment processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="flex space-x-2">
          {/* Offer Button - only show for buyers */}
          {product && currentUser?.id !== product.sellerId && (
            <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  disabled={userOffers.length >= 3 || userOffers.some((o) => o.status === "pending")}
                >
                  {acceptedOffer ? (
                    <>
                      <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
                      Accepted
                    </>
                  ) : userOffers.some((o) => o.status === "pending") ? (
                    <>
                      <Clock className="mr-2 w-4 h-4" />
                      Pending
                    </>
                  ) : userOffers.length >= 3 ? (
                    <>
                      <X className="mr-2 w-4 h-4" />
                      Max Limit Exceeded
                    </>
                  ) : (
                    "Make Offer"
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make an Offer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Minimum offer:</strong> ₹
                      {product
                        ? (
                            Number.parseFloat(product.price?.toString().replace(/[₹,]/g, "") || "0") * 0.9
                          ).toLocaleString()
                        : "0"}
                      <br />
                      <strong>Listed price:</strong> ₹{product?.price?.toLocaleString()}
                    </p>
                  </div>

                  {/* Show user's previous offers */}
                  {userOffers.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Your Previous Offers ({userOffers.length}/3):</p>
                      {userOffers.map((offer) => (
                        <div
                          key={offer.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                        >
                          <span>₹{offer.amount.toLocaleString()}</span>
                          <Badge
                            variant={
                              offer.status === "accepted"
                                ? "default"
                                : offer.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {offer.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="offer-amount">Your Offer (₹)</Label>
                    <Input
                      id="offer-amount"
                      type="number"
                      placeholder="Enter your offer amount"
                      value={newOffer}
                      onChange={(e) => setNewOffer(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offer-comment">Comment (Optional)</Label>
                    <Textarea
                      id="offer-comment"
                      placeholder="Explain your offer..."
                      value={offerComment}
                      onChange={(e) => setOfferComment(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleMakeOffer} disabled={!newOffer.trim()} className="flex-1">
                      Submit Offer
                    </Button>
                    <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Ask Question Button */}
          <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 h-12">
                <MessageCircle className="mr-2 w-5 h-5" />
                Ask Question
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ask a Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comment">Your Question</Label>
                  <Textarea
                    id="comment"
                    placeholder="Ask about condition, availability, etc..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="w-4 h-4 mr-1" />
                    Post Question
                  </Button>
                  <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Buy Now Button */}
          {acceptedOffer ? (
            <Link href={`/checkout/${id}?offer=${acceptedOffer?.id}`} className="flex-1">
              <Button className="w-full h-12 bg-green-600 hover:bg-green-700">
                <ShoppingCart className="mr-2 w-5 h-5" />
                Pay ₹{acceptedOffer?.amount.toLocaleString()}
              </Button>
            </Link>
          ) : (
            <Link href={`/checkout/${id}`} className="flex-1">
              <Button className="w-full h-12">
                <ShoppingCart className="mr-2 w-5 h-5" />
                Buy Now
              </Button>
            </Link>
          )}
        </div>

        {/* Seller's Offer Notifications */}
        {product && currentUser?.id === product.sellerId && offers.some((o) => o.status === "pending") && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 text-center">
              You have {offers.filter((o) => o.status === "pending").length} pending offer(s) to review
            </p>
          </div>
        )}
      </div>

      {/* Offer Confirmation Dialog */}
      <Dialog open={showOfferConfirmation} onOpenChange={setShowOfferConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your {pendingOfferData?.offerNumber === 2 ? '2nd' : '3rd'} Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> This is your {pendingOfferData?.offerNumber === 2 ? '2nd' : '3rd'} offer. 
                {pendingOfferData?.offerNumber === 3 && ' After this, you will not be able to make more offers for this product.'}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Offer Details:</p>
              <div className="p-2 bg-gray-50 rounded text-sm">
                <p><strong>Amount:</strong> ₹{pendingOfferData?.amount?.toLocaleString()}</p>
                {pendingOfferData?.comment && (
                  <p><strong>Comment:</strong> {pendingOfferData.comment}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => submitOffer(pendingOfferData?.amount, pendingOfferData?.comment)} 
                className="flex-1"
              >
                Confirm Offer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowOfferConfirmation(false)
                  setPendingOfferData(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
