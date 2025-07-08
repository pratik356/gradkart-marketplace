"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, ShoppingBag, Truck, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleGetStarted = () => {
    if (currentUser) {
      router.push("/home")
    } else {
      router.push("/signup")
    }
  }

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600"></div>

      {/* Animated Background Slogan */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center opacity-10">
          <h1 className="text-6xl md:text-8xl font-bold text-white animate-pulse">Where Students Grow</h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white animate-pulse delay-1000">and Goals Begin</h2>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-3">
            <img src="/gradkart-logo.png" alt="GradKart" className="w-12 h-12" />
            <div>
              <h1 className="text-white text-2xl font-bold">GradKart</h1>
              <p className="text-white/80 text-sm">Student Marketplace</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6 pb-20">
          {/* Animated Main Slogan */}
          <div className="text-center mb-12">
            <div className="animate-fade-in-up">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Where Students Grow
                <br />
                <span className="text-green-300">and Goals Begin</span>
              </h2>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center space-x-4 animate-slide-in-left">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Verified Students Only</h3>
                <p className="text-white/80 text-sm">Safe trading within your college network</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 animate-slide-in-left delay-200">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Buy & Sell Easily</h3>
                <p className="text-white/80 text-sm">Books, electronics, furniture & more</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 animate-slide-in-left delay-400">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Local Delivery</h3>
                <p className="text-white/80 text-sm">Within 50km of your college</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 animate-slide-in-left delay-600">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Secure Transactions</h3>
                <p className="text-white/80 text-sm">Protected by dispute resolution</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 animate-fade-in-up delay-800">
            <Button
              onClick={handleGetStarted}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-base rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {currentUser ? "Continue to Home" : "Get Started"}
            </Button>

            {!currentUser && (
              <Button
                onClick={handleLogin}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold py-3 text-base rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-200"
              >
                Already have an account
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-800 {
          animation-delay: 0.8s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}
