"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Phone, MoreVertical, ImageIcon, CheckCheck, Check } from "lucide-react"
import Link from "next/link"

const messages = [
  {
    id: 1,
    text: "Hi! Is the iPhone 13 Pro Max still available?",
    sender: "buyer",
    time: "10:30 AM",
    status: "read",
  },
  {
    id: 2,
    text: "Yes, it's still available! Are you interested?",
    sender: "seller",
    time: "10:32 AM",
    status: "read",
  },
  {
    id: 3,
    text: "Great! Can you tell me more about the condition? Any scratches or issues?",
    sender: "buyer",
    time: "10:35 AM",
    status: "read",
  },
  {
    id: 4,
    text: "It's in excellent condition. I've always used it with a screen protector and case. Battery health is 94%. No scratches at all.",
    sender: "seller",
    time: "10:37 AM",
    status: "read",
  },
  {
    id: 5,
    text: "That sounds perfect! Can we meet for pickup? I'm also at IIT Delhi.",
    sender: "buyer",
    time: "10:40 AM",
    status: "delivered",
  },
]

export default function ChatPage() {
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-accent flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/chat">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>RK</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Rahul Kumar</h2>
              <p className="text-xs text-muted-foreground">IIT Delhi • Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Preview */}
      <div className="p-4 bg-white border-b">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <img
                src="/placeholder.svg?height=60&width=60"
                alt="iPhone 13 Pro Max"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">iPhone 13 Pro Max 256GB</h3>
                <p className="text-primary font-bold">₹45,000</p>
              </div>
              <Link href="/product/1">
                <Button variant="outline" size="sm">
                  View Item
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "seller" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === "seller" ? "bg-primary text-white rounded-br-md" : "bg-white border rounded-bl-md"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div
                className={`flex items-center justify-end mt-1 space-x-1 ${
                  message.sender === "seller" ? "text-white/70" : "text-muted-foreground"
                }`}
              >
                <span className="text-xs">{message.time}</span>
                {message.sender === "seller" && (
                  <div className="text-xs">
                    {message.status === "read" ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="pr-12"
            />
          </div>
          <Button size="icon" onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
