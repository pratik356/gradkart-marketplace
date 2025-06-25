"use client"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, MessageCircle, FileText, Shield, Phone } from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

const helpCategories = [
  {
    icon: MessageCircle,
    title: "Getting Started",
    description: "Learn the basics of GradKart",
    articles: 12,
  },
  {
    icon: FileText,
    title: "Buying & Selling",
    description: "How to buy and sell items safely",
    articles: 8,
  },
  {
    icon: Shield,
    title: "Safety & Security",
    description: "Stay safe while trading",
    articles: 6,
  },
  {
    icon: Phone,
    title: "Account & Settings",
    description: "Manage your account",
    articles: 10,
  },
]

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-accent pb-20">
      <div className="gradient-bg p-4">
        <div className="flex items-center space-x-3 text-white mb-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Help Center</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input placeholder="Search for help..." className="pl-10 bg-white" />
        </div>
      </div>

      <div className="p-4 -mt-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {helpCategories.map((category, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <category.icon className="w-6 h-6 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{category.title}</p>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Badge variant="secondary">{category.articles}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="w-4 h-4 mr-2" />
              Live Chat
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
