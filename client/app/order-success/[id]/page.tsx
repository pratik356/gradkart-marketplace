"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ import useParams
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, MessageCircle, Home, Star } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  const { id } = useParams(); // ✅ correctly unwrap the param
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderData = () => {
      try {
        const orders = JSON.parse(localStorage.getItem("userOrders") || "[]");
        const currentOrder = orders.find((o: any) => o.id === id);

        if (currentOrder) {
          setOrder(currentOrder);
        } else {
          setOrder({
            id,
            productTitle: "iPhone 13 Pro Max 256GB",
            amount: 45000,
            deliveryMethod: "pickup",
            status: "confirmed",
            createdAt: new Date().toISOString(),
            sellerName: "Rahul Kumar",
          });
        }
      } catch (error) {
        console.error("Error loading order:", error);
        setOrder({
          id,
          productTitle: "iPhone 13 Pro Max 256GB",
          amount: 45000,
          deliveryMethod: "pickup",
          status: "confirmed",
          createdAt: new Date().toISOString(),
          sellerName: "Rahul Kumar",
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Order not found</p>
          <Link href="/home">
            <Button>Go Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-xl text-green-800">Order Placed Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Order ID</p>
            <p className="font-bold text-lg">{order.id}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Order Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Item:</span>
                <span className="font-medium">{order.productTitle}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold text-primary">₹{order.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <Badge variant="secondary">{order.deliveryMethod === "pickup" ? "Pickup" : "GradKart Delivery"}</Badge>
              </div>
              {order.isOfferPurchase && (
                <div className="flex justify-between">
                  <span>Purchase Type:</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Star className="w-3 h-3 mr-1" />
                    Accepted Offer
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Seller will be notified of your order</li>
              <li>• You'll receive updates via notifications</li>
              <li>• Chat with seller for coordination</li>
              {order.deliveryMethod === "pickup" ? (
                <li>• Arrange pickup time and location</li>
              ) : (
                <li>• Item will be delivered in 1-2 days</li>
              )}
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Chat Now Available!</h4>
            </div>
            <p className="text-sm text-green-700">
              You can now chat with the seller to coordinate pickup/delivery details and ask any questions about your order.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/orders">
              <Button className="w-full">
                <Package className="mr-2 w-4 h-4" />
                Track Order
              </Button>
            </Link>

            <Link href="/chat/1">
              <Button variant="outline" className="w-full">
                <MessageCircle className="mr-2 w-4 h-4" />
                Chat with Seller
              </Button>
            </Link>

            <Link href="/home">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
