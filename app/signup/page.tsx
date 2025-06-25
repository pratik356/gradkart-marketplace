"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Mail, Camera, Smartphone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentPreview, setDocumentPreview] = useState<string>("")
  const [step, setStep] = useState<"form" | "email-otp" | "mobile-otp">("form")
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""])
  const [mobileOtp, setMobileOtp] = useState(["", "", "", "", "", ""])
  const [verificationType, setVerificationType] = useState<"email" | "id">("email")
  const [resendTimer, setResendTimer] = useState(0)
  const [resendCount, setResendCount] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)

      // Create preview URL for the document
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setDocumentPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignup = (verificationType: "email" | "id") => {
    if (!name || !phone) {
      alert("Please fill all required fields")
      return
    }

    if (verificationType === "email" && !email) {
      alert("Please provide your college email")
      return
    }

    if (verificationType === "id") {
      if (!selectedFile) {
        alert("Please upload your college ID or marksheet")
        return
      }
      if (!email) {
        alert("Please provide your personal email for communication")
        return
      }
    }

    // Create user data
    const newUserData = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      college: verificationType === "email" ? email.split("@")[1] : "Unknown College",
      status: "pending",
      createdAt: new Date().toISOString(),
      verificationType,
      documentUrl: verificationType === "id" ? documentPreview : null,
      documentName: verificationType === "id" ? selectedFile?.name : null,
      isBlocked: false,
      blockReason: null,
      blockedAt: null,
      emailVerified: false,
      mobileVerified: false,
    }

    setUserData(newUserData)
    setVerificationType(verificationType)
    setStep("email-otp")
    startResendTimer()
    alert(`Email OTP sent to ${email}`)
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

  const handleResendOTP = (type: "email" | "mobile") => {
    if (resendCount >= 3) {
      setIsBlocked(true)
      alert("Too many attempts. Account blocked for 24 hours.")
      return
    }

    setResendCount((prev) => prev + 1)
    startResendTimer()
    alert(`${type === "email" ? "Email" : "Mobile"} OTP resent`)
  }

  const handleOtpChange = (index: number, value: string, type: "email" | "mobile") => {
    if (value.length <= 1) {
      if (type === "email") {
        const newOtp = [...emailOtp]
        newOtp[index] = value
        setEmailOtp(newOtp)
      } else {
        const newOtp = [...mobileOtp]
        newOtp[index] = value
        setMobileOtp(newOtp)
      }

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`${type}-otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleVerifyEmailOTP = () => {
    const otpValue = emailOtp.join("")
    if (otpValue.length !== 6) {
      alert("Please enter complete OTP")
      return
    }

    // In real app, verify OTP with backend
    setUserData((prev) => ({ ...prev, emailVerified: true }))
    setStep("mobile-otp")
    setResendTimer(0)
    setResendCount(0)
    startResendTimer()
    alert(`Mobile OTP sent to ${phone}`)
  }

  const handleVerifyMobileOTP = () => {
    const otpValue = mobileOtp.join("")
    if (otpValue.length !== 6) {
      alert("Please enter complete OTP")
      return
    }

    // Mark mobile as verified and complete signup
    const finalUserData = { ...userData, mobileVerified: true }

    // Store user data in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("signupData") || "[]")
    const updatedUsers = Array.isArray(existingUsers) ? [...existingUsers, finalUserData] : [finalUserData]
    localStorage.setItem("signupData", JSON.stringify(updatedUsers))
    localStorage.setItem("currentUser", JSON.stringify(finalUserData))

    console.log("User signed up:", finalUserData)
    router.push("/approval-pending")
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

  if (step === "email-otp") {
    return (
      <div className="min-h-screen bg-accent">
        <div className="gradient-bg p-4">
          <div className="flex items-center text-white">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setStep("form")}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="ml-4 text-xl font-semibold">Verify Email</h1>
          </div>
        </div>

        <div className="p-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Enter Email Verification Code</CardTitle>
              <p className="text-muted-foreground">
                We've sent a 6-digit code to
                <br />
                <span className="font-semibold">{email}</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center space-x-2">
                {emailOtp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`email-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value, "email")}
                    className="w-12 h-12 text-center text-lg font-semibold"
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
                <Button
                  variant="link"
                  className="text-primary p-0"
                  onClick={() => handleResendOTP("email")}
                  disabled={resendTimer > 0 || resendCount >= 3}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : `Resend Code (${resendCount}/3)`}
                </Button>
              </div>

              <Button onClick={handleVerifyEmailOTP} className="w-full">
                Verify Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "mobile-otp") {
    return (
      <div className="min-h-screen bg-accent">
        <div className="gradient-bg p-4">
          <div className="flex items-center text-white">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setStep("email-otp")}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="ml-4 text-xl font-semibold">Verify Mobile</h1>
          </div>
        </div>

        <div className="p-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Enter Mobile Verification Code</CardTitle>
              <p className="text-muted-foreground">
                We've sent a 6-digit code to
                <br />
                <span className="font-semibold">{phone}</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center space-x-2">
                {mobileOtp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`mobile-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value, "mobile")}
                    className="w-12 h-12 text-center text-lg font-semibold"
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
                <Button
                  variant="link"
                  className="text-primary p-0"
                  onClick={() => handleResendOTP("mobile")}
                  disabled={resendTimer > 0 || resendCount >= 3}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : `Resend Code (${resendCount}/3)`}
                </Button>
              </div>

              <Button onClick={handleVerifyMobileOTP} className="w-full">
                Complete Signup
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
          <h1 className="text-xl font-semibold">Create Account</h1>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Join GradKart</CardTitle>
            <p className="text-center text-muted-foreground">Verify your student status to get started</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">College Email</TabsTrigger>
                <TabsTrigger value="id">Upload ID</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">College Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.name@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">We'll auto-detect your college from your email domain</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <Button className="w-full mt-6" onClick={() => handleSignup("email")}>
                  <Mail className="mr-2 w-4 h-4" />
                  Send Verification OTP
                </Button>
              </TabsContent>

              <TabsContent value="id" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name-id">Full Name</Label>
                  <Input
                    id="name-id"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-id">Personal Email</Label>
                  <Input
                    id="email-id"
                    type="email"
                    placeholder="your.personal@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">We'll use this for communication and OTP verification</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-id">Phone Number</Label>
                  <Input
                    id="phone-id"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload College ID or Marksheet</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {selectedFile ? (
                        <div className="space-y-2">
                          {documentPreview && documentPreview.startsWith("data:image") && (
                            <img
                              src={documentPreview || "/placeholder.svg"}
                              alt="Document preview"
                              className="w-32 h-32 object-cover mx-auto rounded-lg border"
                            />
                          )}
                          <Camera className="w-8 h-8 mx-auto text-primary" />
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm">Click to upload your ID</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG, PDF up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Button className="w-full mt-6" onClick={() => handleSignup("id")}>
                  <Camera className="mr-2 w-4 h-4" />
                  Submit for Verification
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
