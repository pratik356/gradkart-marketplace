"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, MessageSquare, Eye, Clock, CheckCircle, AlertTriangle, FileText, ImageIcon } from "lucide-react"
import Link from "next/link"

interface Dispute {
  id: string
  type: string
  orderId: string
  subject: string
  description: string
  evidence: Array<{
    name: string
    url: string
    type: string
  }>
  status: "pending" | "investigating" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  createdAt: string
  userId: string
  resolution?: string
  resolvedAt?: string
  timeline?: Array<{
    status: string
    date: string
    description: string
  }>
}

export default function MyDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Get current user
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }

    // Load user's disputes
    const disputesData = localStorage.getItem("disputes")
    if (disputesData) {
      const allDisputes = JSON.parse(disputesData)
      const userDisputes = allDisputes.filter((d: Dispute) => d.userId === JSON.parse(user || "{}").id)

      // Add timeline to each dispute
      const disputesWithTimeline = userDisputes.map((dispute: Dispute) => ({
        ...dispute,
        timeline: [
          {
            status: "submitted",
            date: dispute.createdAt,
            description: "Dispute submitted and under review",
          },
          ...(dispute.status === "investigating"
            ? [
                {
                  status: "investigating",
                  date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                  description: "Admin is investigating your dispute",
                },
              ]
            : []),
          ...(dispute.status === "resolved" && dispute.resolvedAt
            ? [
                {
                  status: "resolved",
                  date: dispute.resolvedAt,
                  description: `Dispute resolved: ${dispute.resolution}`,
                },
              ]
            : []),
        ],
      }))

      setDisputes(disputesWithTimeline)
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "investigating":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "investigating":
        return <AlertTriangle className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "closed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-accent pb-20">
      {/* Header */}
      <div className="gradient-bg p-4">
        <div className="flex items-center text-white mb-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-semibold">My Disputes</h1>
        </div>

        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{disputes.length}</div>
            <div className="text-xs text-white/80">Total Disputes</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {disputes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No disputes found</h3>
              <p className="text-muted-foreground mb-4">You haven't raised any disputes yet</p>
              <Link href="/raise-dispute">
                <Button>Raise a Dispute</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <Card key={dispute.id} className={dispute.status === "pending" ? "border-yellow-200 bg-yellow-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{dispute.subject}</h3>
                        <Badge className={getPriorityColor(dispute.priority)}>{dispute.priority} priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        <strong>Type:</strong> {dispute.type.replace("-", " ")} | <strong>ID:</strong> {dispute.id}
                      </p>
                      {dispute.orderId !== "N/A" && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Order ID:</strong> {dispute.orderId}
                        </p>
                      )}
                    </div>
                    <Badge className={getStatusColor(dispute.status)}>
                      {getStatusIcon(dispute.status)}
                      <span className="ml-1">{dispute.status}</span>
                    </Badge>
                  </div>

                  <p className="text-sm mb-3 line-clamp-2">{dispute.description}</p>

                  {/* Status Timeline */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Status Timeline:</p>
                    <div className="space-y-2">
                      {dispute.timeline?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.status === "resolved"
                                ? "bg-green-500"
                                : item.status === "investigating"
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                            }`}
                          />
                          <span className="text-muted-foreground">
                            {new Date(item.date).toLocaleDateString()} - {item.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {dispute.evidence.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <ImageIcon className="w-3 h-3" />
                        <span>
                          {dispute.evidence.length} evidence file{dispute.evidence.length > 1 ? "s" : ""} attached
                        </span>
                      </div>
                    </div>
                  )}

                  {dispute.resolution && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-xs font-medium text-green-800">Admin Resolution:</p>
                      <p className="text-xs text-green-700">{dispute.resolution}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Submitted on {new Date(dispute.createdAt).toLocaleDateString()}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Dispute Details - {dispute.subject}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Basic Info */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Dispute ID</p>
                              <p>{dispute.id}</p>
                            </div>
                            <div>
                              <p className="font-medium">Type</p>
                              <p>{dispute.type.replace("-", " ")}</p>
                            </div>
                            <div>
                              <p className="font-medium">Priority</p>
                              <Badge className={getPriorityColor(dispute.priority)}>{dispute.priority}</Badge>
                            </div>
                            <div>
                              <p className="font-medium">Status</p>
                              <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <p className="font-medium mb-2">Description</p>
                            <p className="text-sm text-muted-foreground">{dispute.description}</p>
                          </div>

                          {/* Timeline */}
                          <div>
                            <p className="font-medium mb-2">Timeline</p>
                            <div className="space-y-3">
                              {dispute.timeline?.map((item, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div
                                    className={`w-3 h-3 rounded-full mt-1 ${
                                      item.status === "resolved"
                                        ? "bg-green-500"
                                        : item.status === "investigating"
                                          ? "bg-blue-500"
                                          : "bg-yellow-500"
                                    }`}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-sm capitalize">{item.status}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(item.date).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Evidence */}
                          {dispute.evidence.length > 0 && (
                            <div>
                              <p className="font-medium mb-2">Evidence ({dispute.evidence.length} files)</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {dispute.evidence.map((evidence, index) => (
                                  <div key={index} className="space-y-2">
                                    <p className="text-sm font-medium">
                                      Evidence {index + 1}: {evidence.name}
                                    </p>
                                    {evidence.type.startsWith("image/") ? (
                                      <img
                                        src={evidence.url || "/placeholder.svg"}
                                        alt={`Evidence ${index + 1}`}
                                        className="w-full max-h-32 object-contain border rounded"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center p-4 border rounded">
                                        <div className="text-center">
                                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                          <p className="text-xs text-muted-foreground">{evidence.name}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Resolution */}
                          {dispute.resolution && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="font-medium text-green-800 mb-2">Final Resolution</p>
                              <p className="text-sm text-green-700">{dispute.resolution}</p>
                              {dispute.resolvedAt && (
                                <p className="text-xs text-green-600 mt-2">
                                  Resolved on {new Date(dispute.resolvedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Raise a new dispute or get support</p>
              </div>
              <div className="flex space-x-2">
                <Link href="/raise-dispute">
                  <Button size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    New Dispute
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
