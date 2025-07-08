"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function SheetTest() {
  const [open, setOpen] = useState(false)
  
  console.log("SheetTest render - open:", open)
  
  return (
    <div className="p-4 border border-blue-300 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Sheet Test</h3>
      <Button 
        onClick={() => {
          console.log("SheetTest button clicked")
          setOpen(true)
        }}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Open Test Sheet
      </Button>
      
      <Sheet open={open} onOpenChange={(newOpen) => {
        console.log("SheetTest onOpenChange:", newOpen)
        setOpen(newOpen)
      }}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Test Sheet</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <p>Hello! This is a test sheet.</p>
            <p>If you can see this, the Sheet component is working correctly.</p>
            <Button 
              onClick={() => setOpen(false)}
              className="mt-4"
            >
              Close Sheet
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
} 