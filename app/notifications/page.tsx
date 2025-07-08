"use client"

import { useEffect, useState } from "react";
import { Bell, Trash2, CheckCircle, AlertCircle, User, MessageCircle, Star, Tag, ShoppingCart, DollarSign, Users, Info, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { key: "offers", label: "Offers", icon: Tag },
  { key: "comments", label: "Comments", icon: MessageCircle },
  { key: "review", label: "Item Review", icon: Star },
  { key: "order", label: "Order Updates", icon: ShoppingCart },
  { key: "earnings", label: "Earnings", icon: DollarSign },
  { key: "community", label: "Community", icon: Users },
  { key: "freeup", label: "FreeUp Updates", icon: Info },
  { key: "item", label: "Item Updates", icon: Info },
];

function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

function getUserNotifications(userId: any) {
  if (typeof window === "undefined") return [];
  const all = JSON.parse(localStorage.getItem("notifications") || "[]");
  return all.filter((n: any) => n.userId === userId);
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setNotifications(getUserNotifications(u.id));
    }
    setLoading(false);
  }, []);

  const markAllAsRead = () => {
    if (!user) return;
    const all = JSON.parse(localStorage.getItem("notifications") || "[]");
    const updated = all.map((n: any) => n.userId === user.id ? { ...n, read: true } : n);
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated.filter((n: any) => n.userId === user.id));
  };

  const markAsRead = (id: any) => {
    if (!user) return;
    const all = JSON.parse(localStorage.getItem("notifications") || "[]");
    const updated = all.map((n: any) => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated.filter((n: any) => n.userId === user.id));
  };

  const markAsUnread = (id: any) => {
    if (!user) return;
    const all = JSON.parse(localStorage.getItem("notifications") || "[]");
    const updated = all.map((n: any) => n.id === id ? { ...n, read: false } : n);
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated.filter((n: any) => n.userId === user.id));
  };

  const deleteNotification = (id: any) => {
    if (!user) return;
    const all = JSON.parse(localStorage.getItem("notifications") || "[]");
    const updated = all.filter((n: any) => n.id !== id);
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated.filter((n: any) => n.userId === user.id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Category counts
  const categoryCounts = CATEGORIES.map((cat) => {
    let count = notifications.filter((n) => n.category === cat.key).length;
    return { ...cat, count };
  });

  // Filtered notifications
  const filteredNotifications = activeCategory
    ? notifications.filter((n) => n.category === activeCategory)
    : notifications;

  // Avatar/Icon logic
  function getNotificationIcon(n) {
    if (n.avatar) return <img src={n.avatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />;
    if (n.type === "success") return <CheckCircle className="w-8 h-8 text-green-500" />;
    if (n.type === "error") return <AlertCircle className="w-8 h-8 text-red-500" />;
    if (n.type === "info") return <Bell className="w-8 h-8 text-blue-500" />;
    if (n.type === "like") return <Heart className="w-8 h-8 text-pink-500" />;
    return <User className="w-8 h-8 text-gray-400" />;
  }

  return (
    <div className="min-h-screen bg-white pb-24 flex flex-col items-center justify-start">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col px-2 sm:px-0 md:px-8">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 flex flex-col items-center pt-6 pb-2 md:pt-10 md:pb-4">
          <div className="flex justify-between items-center w-full px-4 md:px-8">
            <div className="text-base md:text-2xl font-bold">Messages</div>
            <button className="text-blue-600 text-xs md:text-base font-semibold" onClick={markAllAsRead}>Read All</button>
          </div>
        </div>

        {/* Chat Availability Notice */}
        <div className="px-4 md:px-8 mt-2">
          <div className="flex items-center bg-orange-50 rounded-xl p-3 mb-2 border border-orange-200">
            <span className="mr-3"><MessageCircle className="w-5 h-5 text-orange-600" /></span>
            <span className="flex-1 font-medium text-orange-800">Chat Feature</span>
            <span className="text-orange-600 text-xs">Available after order</span>
          </div>
        </div>

        {/* Need help card */}
        <div className="px-4 md:px-8 mt-2">
          <div className="flex items-center bg-gray-50 rounded-xl p-3 mb-2 border border-gray-100">
            <span className="mr-3"><MessageCircle className="w-5 h-5 text-gray-400" /></span>
            <span className="flex-1 font-medium text-gray-700">Need help?</span>
            <span className="text-gray-400">&gt;</span>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex overflow-x-auto gap-2 px-4 md:px-8 pb-2 scrollbar-thin scrollbar-thumb-gray-200">
          <button
            key="all"
            className={`px-3 py-1 md:px-5 md:py-2 rounded-full border text-sm md:text-base font-medium whitespace-nowrap ${activeCategory === null ? 'user-gradient-tab user-soft-rounded' : 'bg-gray-100 text-gray-800'} flex items-center gap-1`}
            onClick={() => setActiveCategory(null)}
          >
            All
            <span className="ml-1 font-bold">{notifications.length}</span>
          </button>
          {categoryCounts.map((cat) => (
            <button
              key={cat.key}
              className={`px-3 py-1 md:px-5 md:py-2 rounded-full border text-sm md:text-base font-medium whitespace-nowrap ${activeCategory === cat.key ? 'user-gradient-tab user-soft-rounded' : 'bg-gray-100 text-gray-800'} flex items-center gap-1`}
              onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
            >
              {cat.label}
              {cat.count > 0 && <span className="ml-1 font-bold">{cat.count}</span>}
            </button>
          ))}
        </div>

        {/* Notification List Card */}
        <div className="flex-1 flex flex-col gap-1 px-0 sm:px-0 md:px-0 mt-2 w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 md:p-6 w-full">
            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Bell className="w-12 h-12 mb-4" />
                <div className="text-lg md:text-2xl font-semibold mb-2">No notifications yet</div>
                <div className="text-sm md:text-base">You'll see important updates here.</div>
              </div>
            ) : (
              filteredNotifications.map((n: any) => (
                <div
                  key={n.id}
                  className={`flex items-center gap-3 bg-white rounded-xl px-3 py-3 md:px-6 md:py-5 mb-1 shadow-sm border ${!n.read ? 'border-black/60' : 'border-gray-100'} transition cursor-pointer hover:bg-gray-50`}
                  onClick={() => {
                    markAsRead(n.id);
                    if (n.link) {
                      router.push(n.link);
                    }
                  }}
                >
                  <div className="relative">
                    {getNotificationIcon(n)}
                    {!n.read && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm md:text-lg truncate">
                      {n.title}
                    </div>
                    <div className="text-xs md:text-base text-gray-600 truncate">
                      {n.description}
                    </div>
                  </div>
                  <div className="flex flex-col items-end ml-2 min-w-fit">
                    <span className="text-[10px] md:text-xs text-gray-400 font-mono">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() + ' ' + new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    <Button size="icon" variant="ghost" className="mt-1" onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}>
                      <Trash2 className="w-4 h-4 text-gray-300" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 