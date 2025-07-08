"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

const mockPaymentMethods = [
  {
    id: 1,
    type: "UPI",
    details: "student@paytm",
    isDefault: true,
  },
  {
    id: 2,
    type: "Bank Account",
    details: "**** **** **** 1234",
    isDefault: false,
  },
]

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)

  const handleAddPayment = () => {
    alert("Add Payment Method functionality would open here")
  }

  const handleRemovePayment = (id: number) => {
    setPaymentMethods((methods) => methods.filter((method) => method.id !== id))
  }

  return (
    <div className="min-h-screen bg-accent pb-20">
      <div className="gradient-bg p-4">
        <div className="flex items-center space-x-3 text-white mb-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Payment Methods</h1>
        </div>
      </div>

      <div className="p-4 -mt-2 space-y-4">
        <Button onClick={handleAddPayment} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>

        {paymentMethods.map((method) => (
          <Card key={method.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">{method.type}</p>
                    <p className="text-sm text-muted-foreground">{method.details}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault && <Badge variant="secondary">Default</Badge>}
                  <Button variant="ghost" size="icon" onClick={() => handleRemovePayment(method.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
