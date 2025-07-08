"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter, Heart, Star } from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

export default function BrowseAllPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState([])

  useEffect(() => {
    // Load all items from localStorage
    const listingsData = localStorage.getItem("userListings")
    if (listingsData) {
      const allListings = JSON.parse(listingsData)
      const activeListings = allListings.filter((l) => l.status === "active")
      setItems(activeListings)
    }
  }, [])

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-accent pb-20">
      <div className="gradient-bg p-4">
        <div className="flex items-center space-x-3 text-white mb-4">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Browse All Items</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search all items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 bg-white"
          />
          <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <Filter className="w-5 h-5 text-gray-400" />
          </Button>
        </div>
      </div>

      <div className="p-4 -mt-2">
        <p className="text-sm text-muted-foreground mb-4">Showing {filteredItems.length} items</p>

        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                        <Button variant="ghost" size="icon" className="w-6 h-6 -mt-1">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold text-primary">₹{item.price}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.condition || "Good"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <span>{item.seller || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No items found</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
