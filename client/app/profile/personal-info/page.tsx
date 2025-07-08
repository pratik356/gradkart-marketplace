"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Edit } from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

export default function PersonalInfoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    year: "",
  })

  const [avatar, setAvatar] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        college: user.college || "",
        course: user.course || "",
        year: user.year || "",
      })
      setAvatar(user.avatar || "")
      setPreviewUrl(user.avatar || "")
    }
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatar(result)
        setPreviewUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      const updatedUser = { ...user, ...formData, avatar }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      alert("Personal information updated successfully!")
    }
  }

  return (
    <div className="min-h-screen bg-accent pb-20">
      <div className="gradient-bg p-4">
        <div className="flex items-center space-x-3 text-white mb-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Personal Information</h1>
        </div>
      </div>

      <div className="p-4 -mt-2">
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Details</CardTitle>
          </CardHeader>
          <div className="flex flex-col items-center space-y-4 mb-6 p-4 border rounded-lg">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-2xl font-bold text-gray-400">
                    {formData.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </div>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={() => document.getElementById("avatar-upload")?.click()}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <p className="text-sm text-muted-foreground">Click to change profile picture</p>
          </div>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="college">College/University</Label>
              <Input
                id="college"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="course">Course/Major</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="year">Academic Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
