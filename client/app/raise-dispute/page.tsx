"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertTriangle, Upload, Send, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RaiseDisputePage() {
  const router = useRouter()
  const [disputeType, setDisputeType] = useState("")
  const [orderId, setOrderId] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [evidence, setEvidence] = useState<{ file: File; preview: string }[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        setEvidence((prev) => [...prev, { file, preview }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    setEvidence(evidence.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!disputeType || !subject || !description) {
      alert("Please fill all required fields")
      return
    }

    const dispute = {
      id: `DISP${Date.now()}`,
      type: disputeType,
      orderId: orderId || "N/A",
      subject,
      description,
      evidence: evidence.map((e) => ({
        name: e.file.name,
        url: e.preview,
        type: e.file.type,
      })),
      status: "pending",
      priority: disputeType === "fraud" ? "high" : disputeType === "payment" ? "medium" : "low",
      createdAt: new Date().toISOString(),
      userId: JSON.parse(localStorage.getItem("currentUser") || "{}")?.id || "unknown",
    }

    // Store dispute
    const existingDisputes = JSON.parse(localStorage.getItem("disputes") || "[]")
    existingDisputes.push(dispute)
    localStorage.setItem("disputes", JSON.stringify(existingDisputes))

    alert("Dispute raised successfully! You'll receive updates via email and notifications.")
    router.push("/profile")
  }

  return (
    <div className="min-h-screen bg-accent">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center text-white">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-semibold">Raise Dispute</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 mb-1">Before raising a dispute</p>
                <p className="text-orange-700">
                  Try contacting the other party directly through chat. Most issues can be resolved quickly through
                  communication.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispute Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dispute-type">Dispute Type</Label>
              <Select value={disputeType} onValueChange={setDisputeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dispute type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="item-not-received">Item Not Received</SelectItem>
                  <SelectItem value="item-not-as-described">Item Not As Described</SelectItem>
                  <SelectItem value="payment-issue">Payment Issue</SelectItem>
                  <SelectItem value="seller-unresponsive">Seller Unresponsive</SelectItem>
                  <SelectItem value="buyer-unresponsive">Buyer Unresponsive</SelectItem>
                  <SelectItem value="fraud">Fraud/Scam</SelectItem>
                  <SelectItem value="damaged-item">Damaged Item</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-id">Order ID (Optional)</Label>
              <Input
                id="order-id"
                placeholder="Enter order ID if applicable"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of the issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed explanation of the issue, including timeline and any communication attempts..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Evidence (Screenshots, Photos, etc.)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="evidence-upload"
                />
                <label htmlFor="evidence-upload" className="cursor-pointer block text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm">Click to upload evidence</p>
                  <p className="text-xs text-muted-foreground">Images, PDFs up to 5MB each</p>
                </label>
              </div>

              {evidence.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Files:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {evidence.map((item, index) => (
                      <div key={index} className="relative">
                        {item.file.type.startsWith("image/") ? (
                          <div className="relative">
                            <img
                              src={item.preview || "/placeholder.svg"}
                              alt={`Evidence ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 w-6 h-6 p-0"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                            <span className="text-sm truncate">{item.file.name}</span>
                            <Button size="sm" variant="ghost" onClick={() => removeFile(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Our team will review your dispute within 24 hours</li>
              <li>• We may contact both parties for additional information</li>
              <li>• You'll receive updates via email and app notifications</li>
              <li>• Most disputes are resolved within 3-5 business days</li>
            </ul>
          </CardContent>
        </Card>

        <Button onClick={handleSubmit} className="w-full h-12">
          <Send className="mr-2 w-4 h-4" />
          Submit Dispute
        </Button>
      </div>
    </div>
  )
}
