"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Smartphone, Tablet, Laptop } from "lucide-react"
import { cn } from "@/lib/utils"

type DeviceType = "mobile" | "tablet" | "laptop"

interface DevicePreviewProps {
  children: React.ReactNode
  className?: string
}

export function DevicePreview({ children, className }: DevicePreviewProps) {
  const [deviceType, setDeviceType] = useState<DeviceType>("mobile")

  const deviceConfig = {
    mobile: {
      maxWidth: "max-w-sm",
      width: "w-full",
      icon: Smartphone,
      label: "Mobile",
      frameClass: "rounded-3xl border-8 border-gray-800 shadow-2xl"
    },
    tablet: {
      maxWidth: "max-w-2xl",
      width: "w-full",
      icon: Tablet,
      label: "Tablet",
      frameClass: "rounded-2xl border-6 border-gray-800 shadow-xl"
    },
    laptop: {
      maxWidth: "max-w-4xl",
      width: "w-full",
      icon: Laptop,
      label: "Laptop",
      frameClass: "rounded-lg border-4 border-gray-800 shadow-lg"
    }
  }

  const config = deviceConfig[deviceType]

  return (
    <div className={cn("min-h-screen bg-gray-100 p-4", className)}>
      {/* Device Preview Controls */}
      <div className="mb-6 flex justify-center">
        <div className="bg-white rounded-lg p-2 shadow-md flex space-x-1">
          {(["mobile", "tablet", "laptop"] as DeviceType[]).map((device) => {
            const Icon = deviceConfig[device].icon
            return (
              <Button
                key={device}
                variant={deviceType === device ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeviceType(device)}
                className="flex items-center space-x-2 px-3 py-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{deviceConfig[device].label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Device Frame */}
      <div className="flex justify-center">
        <div className={cn(config.maxWidth, config.width, "mx-auto")}>
          <div className={cn("bg-white overflow-hidden", config.frameClass)}>
            {/* Device Screen */}
            <div className="bg-white min-h-screen">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 