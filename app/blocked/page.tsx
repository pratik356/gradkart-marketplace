"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Mail, Phone, MessageCircle, AlertTriangle, Clock } from "lucide-react"

export default function BlockedPage() {
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user = JSON.parse(currentUser)

      // Check latest status from signupData
      const signupData = localStorage.getItem("signupData")
      if (signupData) {
        const users = JSON.parse(signupData)
        const updatedUser = users.find((u: any) => u.id === user.id)
        if (updatedUser) {
          setUserData(updatedUser)
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-12 h-12 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-800">Account Blocked</CardTitle>
          <Badge variant="destructive" className="mx-auto">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Access Restricted
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">Your account has been temporarily blocked</h4>
            {userData?.blockReason && (
              <div className="text-sm text-red-700 mb-3">
                <p className="font-medium">Reason:</p>
                <p>{userData.blockReason}</p>
              </div>
            )}
            {userData?.blockedAt && (
              <div className="text-xs text-red-600 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Blocked on: {new Date(userData.blockedAt).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Need Help? Contact Support</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Email Support</p>
                  <p className="text-sm text-blue-700">admin@gradkart.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Phone Support</p>
                  <p className="text-sm text-blue-700">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Live Chat</p>
                  <p className="text-sm text-blue-700">Available 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">Appeal Process</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Contact support with your appeal</li>
              <li>• Provide any relevant documentation</li>
              <li>• Appeals are reviewed within 24-48 hours</li>
              <li>• You'll receive an email with the decision</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() =>
                (window.location.href =
                  "mailto:admin@gradkart.com?subject=Account Appeal Request&body=Hello, I would like to appeal my account block. My account details: Name: " +
                  (userData?.name || "N/A") +
                  ", Phone: " +
                  (userData?.phone || "N/A"))
              }
            >
              <Mail className="mr-2 w-4 h-4" />
              Send Appeal Email
            </Button>

            <Button variant="outline" className="w-full" onClick={() => (window.location.href = "tel:+919876543210")}>
              <Phone className="mr-2 w-4 h-4" />
              Call Support
            </Button>
          </div>

          <div className="text-center border-t pt-4">
            <p className="text-xs text-muted-foreground">Account ID: {userData?.id || "N/A"}</p>
            <p className="text-xs text-muted-foreground">
              For faster resolution, mention your Account ID when contacting support
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
