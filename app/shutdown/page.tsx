"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Clock, AlertTriangle, Home } from "lucide-react"
import Link from "next/link"

export default function ShutdownPage() {
  const [shutdownData, setShutdownData] = useState<any>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadShutdownData = () => {
      try {
        const storedShutdown = localStorage.getItem("shutdownSettings")
        if (storedShutdown) {
          const data = JSON.parse(storedShutdown)
          setShutdownData(data)
        }
      } catch (error) {
        console.error("Error loading shutdown data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadShutdownData()
  }, [])

  useEffect(() => {
    if (shutdownData?.reopenDate) {
      const updateCountdown = () => {
        const now = new Date().getTime()
        const reopenTime = new Date(shutdownData.reopenDate).getTime()
        const difference = reopenTime - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeRemaining("Reopening soon...")
        }
      }

      updateCountdown()
      const interval = setInterval(updateCountdown, 1000)
      return () => clearInterval(interval)
    }
  }, [shutdownData])

  const handleRefresh = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="pb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800 mb-2">
            GradKartGo is Temporarily Unavailable
          </CardTitle>
          <Badge variant="destructive" className="mb-4">
            Maintenance Mode
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {shutdownData?.reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Reason for Shutdown</h3>
              <p className="text-red-700">{shutdownData.reason}</p>
            </div>
          )}

          {shutdownData?.customMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Message from Team</h3>
              <p className="text-blue-700">{shutdownData.customMessage}</p>
            </div>
          )}

          {shutdownData?.reopenDate && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Expected Reopening</h3>
              </div>
              <p className="text-green-700 mb-2">
                {new Date(shutdownData.reopenDate).toLocaleString()}
              </p>
              {timeRemaining && (
                <div className="text-sm text-green-600">
                  <strong>Time remaining:</strong> {timeRemaining}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handleRefresh} className="w-full">
              <RefreshCw className="mr-2 w-4 h-4" />
              Try Again Later
            </Button>
            
            <Link href="/home">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 w-4 h-4" />
                Go to Home
              </Button>
            </Link>
          </div>

          <div className="text-xs text-gray-500 mt-6">
            <p>We apologize for the inconvenience. Our team is working to restore service as quickly as possible.</p>
            <p className="mt-1">For urgent matters, please contact support at support@gradkartgo.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 