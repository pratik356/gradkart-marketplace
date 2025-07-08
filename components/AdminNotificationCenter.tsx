import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Loader, Clock, Bell, Gift, X, Edit, Eye, Trash2 } from "lucide-react"

const AdminNotificationCenter = ({
  notificationTab,
  setNotificationTab,
  notificationTarget,
  setNotificationTarget,
  notificationTitle,
  setNotificationTitle,
  notificationMessage,
  setNotificationMessage,
  notificationType,
  setNotificationType,
  notificationFile,
  setNotificationFile,
  notificationFilePreview,
  setNotificationFilePreview,
  notificationSchedule,
  setNotificationSchedule,
  sendingNotification,
  setSendingNotification,
  scheduledNotifications,
  setScheduledNotifications,
  sentNotifications,
  setSentNotifications,
  notificationTemplates,
  setNotificationTemplates,
  templateName,
  setTemplateName,
  fileInputRef,
  users,
  saveAsTemplate,
  useTemplate,
  deleteTemplate,
  sendNotification,
  deleteScheduled,
  editScheduled,
  notificationAnalytics,
  handleFileChange,
  removeFile,
  showNotificationModal,
  setShowNotificationModal,
}) => (
  <DialogContent className="max-w-2xl w-full p-0 overflow-y-auto">
    <DialogHeader className="p-4 pb-0">
      <DialogTitle>Notification Center</DialogTitle>
    </DialogHeader>
    <div className="p-4">
      <Tabs value={notificationTab} onValueChange={setNotificationTab}>
        <TabsList className="mb-4 flex gap-2">
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="send">
          {/* Send Notification Form */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={notificationTarget} onValueChange={setNotificationTarget}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={notificationType} onValueChange={v => setNotificationType(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Title" value={notificationTitle} onChange={e => setNotificationTitle(e.target.value)} />
            <Textarea placeholder="Message" value={notificationMessage} onChange={e => setNotificationMessage(e.target.value)} rows={3} />
            <div className="flex gap-2 items-center">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="notif-file-upload" />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Attach File</Button>
              {notificationFilePreview && (
                <div className="flex items-center gap-2">
                  <img src={notificationFilePreview} alt="Preview" className="w-10 h-10 object-cover rounded" />
                  <Button variant="ghost" size="icon" onClick={removeFile}><X className="w-4 h-4" /></Button>
                </div>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Label className="mr-2">Schedule:</Label>
              <Input type="datetime-local" value={notificationSchedule || ''} onChange={e => setNotificationSchedule(e.target.value)} className="w-56" />
              <Button size="sm" onClick={() => sendNotification(true)} disabled={sendingNotification || !notificationTitle.trim() || !notificationMessage.trim() || !notificationSchedule}>
                {sendingNotification ? <Loader className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4 mr-1" />} Schedule
              </Button>
              <Button size="sm" onClick={() => sendNotification(false)} disabled={sendingNotification || !notificationTitle.trim() || !notificationMessage.trim()}>
                {sendingNotification ? <Loader className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4 mr-1" />} Send Now
              </Button>
              <Button size="sm" variant="outline" onClick={saveAsTemplate} disabled={!notificationTitle.trim() || !notificationMessage.trim() || !templateName.trim()}>
                <Gift className="w-4 h-4 mr-1" /> Save as Template
              </Button>
              <Input placeholder="Template Name" value={templateName} onChange={e => setTemplateName(e.target.value)} className="w-40" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="scheduled">
          {/* Scheduled Notifications List */}
          <div className="space-y-2">
            {scheduledNotifications.length === 0 ? (
              <p className="text-muted-foreground text-sm">No scheduled notifications.</p>
            ) : (
              scheduledNotifications.map(n => (
                <Card key={n.id} className="flex items-center justify-between p-2">
                  <div>
                    <div className="font-semibold">{n.title}</div>
                    <div className="text-xs text-muted-foreground">Scheduled: {n.scheduled ? new Date(n.scheduled).toLocaleString() : ''}</div>
                    <div className="text-xs">To: {n.userId === 'all' ? 'All Users' : users.find(u => u.id === n.userId)?.name}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => editScheduled(n)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteScheduled(n.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="history">
          {/* Sent Notifications List */}
          <div className="space-y-2">
            {sentNotifications.length === 0 ? (
              <p className="text-muted-foreground text-sm">No sent notifications.</p>
            ) : (
              sentNotifications.map(n => (
                <Card key={n.id} className="flex items-center justify-between p-2">
                  <div>
                    <div className="font-semibold">{n.title}</div>
                    <div className="text-xs text-muted-foreground">Sent: {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
                    <div className="text-xs">To: {n.userId === 'all' ? 'All Users' : users.find(u => u.id === n.userId)?.name}</div>
                    <div className="text-xs">Type: {n.type}</div>
                    <div className="text-xs">Read: {n.readCount || 0}</div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="templates">
          {/* Notification Templates List */}
          <div className="space-y-2">
            {notificationTemplates.length === 0 ? (
              <p className="text-muted-foreground text-sm">No templates saved.</p>
            ) : (
              notificationTemplates.map(t => (
                <Card key={t.id} className="flex items-center justify-between p-2">
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">Type: {t.type}</div>
                    <div className="text-xs">Title: {t.title}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => useTemplate(t)}><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteTemplate(t.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      {/* Analytics */}
      <div className="mt-4 p-2 bg-gray-50 rounded">
        <div className="font-semibold mb-2">Notification Analytics</div>
        <div className="flex gap-4 text-xs">
          <div>Total Sent: {notificationAnalytics.totalSent}</div>
          <div>Scheduled: {notificationAnalytics.totalScheduled}</div>
          <div>Delivered: {notificationAnalytics.delivered}</div>
          <div>Read: {notificationAnalytics.read}</div>
          <div>Read Rate: {notificationAnalytics.readRate}%</div>
        </div>
      </div>
    </div>
  </DialogContent>
)

export default AdminNotificationCenter 