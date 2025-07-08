"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import LeafletAddressForm from "@/components/LeafletAddressForm"
import { toast } from "sonner"

interface Address {
  id: string
  type: "home" | "college" | "other"
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    type: "home" as "home" | "college" | "other",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  })

  useEffect(() => {
    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem("userAddresses")
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses))
    } else {
      // Add default college address if location is available
      const userLocation = localStorage.getItem("userLocation")
      if (userLocation) {
        const location = JSON.parse(userLocation)
        const defaultAddress: Address = {
          id: "default",
          type: "college",
          name: "College Address",
          phone: "+91 98765 43210",
          address: location.address || "College Campus",
          city: location.city || "Unknown",
          state: location.state || "Unknown",
          pincode: "110001",
          isDefault: true,
        }
        setAddresses([defaultAddress])
        localStorage.setItem("userAddresses", JSON.stringify([defaultAddress]))
      }
    }
  }, [])

  const handleSaveAddress = () => {
    const newAddress: Address = {
      id: editingAddress?.id || Date.now().toString(),
      ...formData,
    }

    let updatedAddresses
    if (editingAddress) {
      updatedAddresses = addresses.map((addr) => (addr.id === editingAddress.id ? newAddress : addr))
    } else {
      updatedAddresses = [...addresses, newAddress]
    }

    // If this is set as default, remove default from others
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) =>
        addr.id === newAddress.id ? addr : { ...addr, isDefault: false },
      )
    }

    setAddresses(updatedAddresses)
    localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses))
    setShowAddForm(false)
    setEditingAddress(null)
    setFormData({
      type: "home",
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    })
  }

  const handleDeleteAddress = (id: string) => {
    const updatedAddresses = addresses.filter((addr) => addr.id !== id)
    setAddresses(updatedAddresses)
    localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses))
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      type: address.type,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    })
    setShowAddForm(true)
  }

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-accent">
        {/* Header */}
        <div className="gradient-bg p-4">
          <div className="flex items-center text-white">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => {
                setShowAddForm(false)
                setEditingAddress(null)
              }}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="ml-4 text-xl font-semibold">{editingAddress ? "Edit Address" : "Add New Address"}</h1>
          </div>
        </div>
        <div className="p-4">
          <LeafletAddressForm onSave={() => {
            toast.success("Address saved successfully!");
            setShowAddForm(false);
            setEditingAddress(null);
            window.location.reload();
          }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-accent">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="ml-4 text-xl font-semibold">My Addresses</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No addresses saved</h3>
              <p className="text-muted-foreground mb-4">Add your first address to get started</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 w-4 h-4" />
                Add Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {addresses.map((address) => (
              <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold capitalize">{address.type}</h3>
                      {address.isDefault && <Badge variant="default">Default</Badge>}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditAddress(address)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{address.name}</p>
                    <p className="text-muted-foreground">{address.phone}</p>
                    <p className="text-muted-foreground">{address.address}</p>
                    <p className="text-muted-foreground">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button onClick={() => setShowAddForm(true)} variant="outline" className="w-full">
              <Plus className="mr-2 w-4 h-4" />
              Add New Address
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
