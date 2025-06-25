"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle } from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

const chatList = [
  {
    id: 1,
    name: "Rahul Kumar",
    college: "IIT Delhi",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Is the iPhone still available?",
    time: "2m ago",
    unread: 2,
    product: {
      title: "iPhone 13 Pro Max",
      price: "₹45,000",
      image: "/placeholder.svg?height=60&width=60",
    },
    online: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    college: "DTU",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the quick delivery!",
    time: "1h ago",
    unread: 0,
    product: {
      title: "Engineering Books Set",
      price: "₹800",
      image: "/placeholder.svg?height=60&width=60",
    },
    online: false,
  },
  {
    id: 3,
    name: "Amit Raj",
    college: "NSUT",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can we meet tomorrow at 3 PM?",
    time: "3h ago",
    unread: 1,
    product: {
      title: "Study Table with Chair",
      price: "₹3,500",
      image: "/placeholder.svg?height=60&width=60",
    },
    online: false,
  },
]

export default function ChatListPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-accent pb-20">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-xl font-bold">Messages</h1>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {chatList.filter((chat) => chat.unread > 0).length} new
          </Badge>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      <div className="p-4">
        {chatList.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No messages yet</h3>
            <p className="text-muted-foreground mb-4">Start buying or selling to connect with other students</p>
            <Link href="/home">
              <Button>Browse Items</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {chatList.map((chat) => (
              <Link key={chat.id} href={`/chat/${chat.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {chat.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {chat.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <h3 className="font-semibold text-sm">{chat.name}</h3>
                            <p className="text-xs text-muted-foreground">{chat.college}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{chat.time}</p>
                            {chat.unread > 0 && (
                              <Badge className="mt-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {chat.unread}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground truncate mb-2">{chat.lastMessage}</p>

                        {/* Product Preview */}
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <img
                            src={chat.product.image || "/placeholder.svg"}
                            alt={chat.product.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{chat.product.title}</p>
                            <p className="text-xs text-primary font-semibold">{chat.product.price}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
