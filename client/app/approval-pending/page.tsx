"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ApprovalPendingPage() {
  const router = useRouter()
  const [userStatus, setUserStatus] = useState<"pending" | "approved" | "rejected" | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [checking, setChecking] = useState(false)

  const checkApprovalStatus = () => {
    setChecking(true)

    // Get current user data
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/signup")
      return
    }

    const user = JSON.parse(currentUser)
    setUserData(user)

    // Check status in signupData (where admin updates are stored)
    const signupData = localStorage.getItem("signupData")
    if (signupData) {
      const users = JSON.parse(signupData)
      const updatedUser = users.find((u: any) => u.id === user.id)

      if (updatedUser) {
        setUserStatus(updatedUser.status)

        // Update current user with latest status
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))

        // If approved, redirect after showing success
        if (updatedUser.status === "approved") {
          setTimeout(() => {
            router.push("/approved")
          }, 2000)
        }
      } else {
        setUserStatus(user.status || "pending")
      }
    } else {
      setUserStatus(user.status || "pending")
    }

    setTimeout(() => setChecking(false), 1000)
  }

  useEffect(() => {
    checkApprovalStatus()

    // Auto-check every 10 seconds
    const interval = setInterval(checkApprovalStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  if (userStatus === "approved") {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-green-200">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-800">🎉 Account Approved!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-semibold mb-2">Welcome to GradKart!</p>
              <p className="text-green-700 text-sm">
                Your student verification has been approved. You can now start buying and selling with verified students
                in your area.
              </p>
            </div>

            <div className="text-sm text-muted-foreground">Redirecting to your dashboard...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (userStatus === "rejected") {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-800">Application Rejected</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 font-semibold mb-2">Sorry, we couldn't verify your student status</p>
              <p className="text-red-700 text-sm">
                Your application has been reviewed and we were unable to verify your student credentials. This could be
                due to:
              </p>
              <ul className="text-red-700 text-sm mt-2 text-left space-y-1">
                <li>• Invalid or unclear documentation</li>
                <li>• Email domain not recognized as educational</li>
                <li>• Incomplete information provided</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button onClick={() => router.push("/signup")} className="w-full bg-red-600 hover:bg-red-700">
                Try Again with Different Details
              </Button>

              <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                Back to Home
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              If you believe this is an error, please contact our support team.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pending status
  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          <CardTitle className="text-xl">Verification Pending</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">Phone number verified</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm">Student verification in progress</span>
            </div>
          </div>

          {userData && (
            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold text-blue-800 mb-2">Your Application Details:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Name: {userData.name}</p>
                <p>• Email: {userData.email || "ID Upload"}</p>
                <p>• College: {userData.college}</p>
                <p>• Submitted: {new Date(userData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          <div className="text-left bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">What happens next?</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Our admin team will verify your student status</li>
              <li>• This usually takes a few minutes to 24 hours</li>
              <li>• You'll see the status update on this page</li>
              <li>• Once approved, you can start buying and selling!</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={checkApprovalStatus} className="w-full" disabled={checking}>
              {checking ? (
                <>
                  <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                  Checking Status...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 w-4 h-4" />
                  Check Status Now
                </>
              )}
            </Button>

            <div className="text-xs text-center text-muted-foreground">
              Status updates automatically every 10 seconds
            </div>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600 mb-2">Development Mode</p>
              <Button onClick={() => router.push("/admin")} variant="outline" size="sm" className="w-full">
                Open Admin Panel to Approve
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
