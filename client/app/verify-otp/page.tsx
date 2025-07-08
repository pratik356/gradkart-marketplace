"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Smartphone } from "lucide-react"
import Link from "next/link"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

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

  return (
    <div className="min-h-screen bg-accent">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center text-white">
          <Link href="/signup">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-semibold">Verify Phone</h1>
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
              <span className="font-semibold">+91 98765 43210</span>
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
              <Button variant="link" className="text-primary p-0">
                Resend Code
              </Button>
            </div>

            <Link href="/location-setup">
              <Button className="w-full">Verify & Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
