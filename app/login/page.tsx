"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Smartphone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [resendTimer, setResendTimer] = useState(0)
  const [resendCount, setResendCount] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [loginUser, setLoginUser] = useState<any>(null)

  const handleSendOTP = () => {
    if (!phone.trim()) {
      alert("Please enter your phone number")
      return
    }

    // Check if user exists
    const signupData = localStorage.getItem("signupData")
    if (signupData) {
      const users = JSON.parse(signupData)
      const user = users.find((u: any) => u.phone === phone)

      if (!user) {
        alert("No account found with this phone number. Please sign up first.")
        return
      }

      // Check if user is blocked
      if (user.isBlocked) {
        alert("Your account is blocked. Please contact support.")
        return
      }

      setLoginUser(user)
      setStep("otp")
      startResendTimer()
      alert(`OTP sent to ${phone}`)
    } else {
      alert("No account found with this phone number. Please sign up first.")
    }
  }

  const startResendTimer = () => {
    setResendTimer(60)
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResendOTP = () => {
    if (resendCount >= 3) {
      setIsBlocked(true)
      // Block user account for 24 hours
      if (loginUser) {
        const signupData = localStorage.getItem("signupData")
        if (signupData) {
          const users = JSON.parse(signupData)
          const updatedUsers = users.map((u: any) =>
            u.id === loginUser.id
              ? { ...u, isBlocked: true, blockReason: "Too many login attempts", blockedAt: new Date().toISOString() }
              : u,
          )
          localStorage.setItem("signupData", JSON.stringify(updatedUsers))
        }
      }
      alert("Too many attempts. Account blocked for 24 hours.")
      return
    }

    setResendCount((prev) => prev + 1)
    startResendTimer()
    alert(`OTP resent to ${phone}`)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleVerifyOTP = () => {
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      alert("Please enter complete OTP")
      return
    }

    // In real app, verify OTP with backend
    // For demo, accept any 6-digit OTP
    if (loginUser) {
      localStorage.setItem("currentUser", JSON.stringify(loginUser))

      // Check if user has location stored
      const storedLocation = localStorage.getItem("userLocation")
      const locationSkipped = localStorage.getItem("locationSkipped")

      if (storedLocation || locationSkipped) {
        router.push("/home")
      } else {
        router.push("/location-setup")
      }
    }
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Account Blocked</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Too many incorrect attempts. Your account has been blocked for 24 hours.
            </p>
            <Link href="/">
              <Button className="w-full">Go Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-accent">
        {/* Header */}
        <div className="gradient-bg p-4">
          <div className="flex items-center text-white">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setStep("phone")}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <img src="/gradkart-logo.png" alt="GradKart" className="w-8 h-8 ml-4 mr-2" />
            <h1 className="text-xl font-semibold">Verify OTP</h1>
          </div>
        </div>

        <div className="p-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Enter Verification Code</CardTitle>
              <p className="text-muted-foreground">
                We've sent a 6-digit code to
                <br />
                <span className="font-semibold">{phone}</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
                <Button
                  variant="link"
                  className="text-primary p-0"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || resendCount >= 3}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : `Resend Code (${resendCount}/3)`}
                </Button>
              </div>

              <Button onClick={handleVerifyOTP} className="w-full">
                Verify & Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-accent">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center text-white">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <img src="/gradkart-logo.png" alt="GradKart" className="w-8 h-8 ml-4 mr-2" />
          <h1 className="text-xl font-semibold">Sign In</h1>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back!</CardTitle>
            <p className="text-center text-muted-foreground">Enter your phone number to receive OTP</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button onClick={handleSendOTP} className="w-full mt-6">
              <Smartphone className="mr-2 w-4 h-4" />
              Send OTP
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup">
                  <Button variant="link" className="text-primary p-0">
                    Sign Up
                  </Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
