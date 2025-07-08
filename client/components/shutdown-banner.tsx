"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ShutdownBannerProps {
  onDismiss?: () => void
}

export default function ShutdownBanner({ onDismiss }: ShutdownBannerProps) {
  const [shutdownData, setShutdownData] = useState<any>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const loadShutdownData = () => {
      try {
        const storedShutdown = localStorage.getItem("shutdownSettings")
        if (storedShutdown) {
          const data = JSON.parse(storedShutdown)
          setShutdownData(data)
          
          // Show banner if shutdown is scheduled and within 24 hours
          if (data.isScheduled && data.scheduledDate) {
            const scheduledTime = new Date(data.scheduledDate).getTime()
            const now = new Date().getTime()
            const timeDiff = scheduledTime - now
            const hoursDiff = timeDiff / (1000 * 60 * 60)
            
            if (hoursDiff <= 24 && hoursDiff > 0) {
              setIsVisible(true)
            }
          }
        }
      } catch (error) {
        console.error("Error loading shutdown data:", error)
      }
    }

    loadShutdownData()
  }, [])

  useEffect(() => {
    if (shutdownData?.scheduledDate) {
      const updateCountdown = () => {
        const now = new Date().getTime()
        const scheduledTime = new Date(shutdownData.scheduledDate).getTime()
        const difference = scheduledTime - now

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          setTimeRemaining(`${hours}h ${minutes}m`)
        } else {
          setTimeRemaining("Shutting down...")
        }
      }

      updateCountdown()
      const interval = setInterval(updateCountdown, 60000) // Update every minute
      return () => clearInterval(interval)
    }
  }, [shutdownData])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible || !shutdownData) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-300 flex-shrink-0" />
          <div className="flex items-center space-x-2">
            <span className="font-semibold">⚠️ Heads up!</span>
            <span className="text-sm">
              {shutdownData.warningMessage || "GradKart will be undergoing maintenance"}
            </span>
            {timeRemaining && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">in {timeRemaining}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Scheduled Maintenance
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 