"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)

  // 🔥 load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // 🔥 apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  return (
    <DashboardLayout title="Settings" subtitle="Manage your app preferences">
      
      <div className="space-y-6">

        {/* Preferences */}
        <Card className="rounded-2xl border-0 shadow-md">
          <CardContent className="p-6">

            <h3 className="text-lg font-semibold text-foreground mb-4">
              Preferences
            </h3>

            {/* 🌙 DARK MODE */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
              
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Switch to dark theme
                </p>
              </div>

              {/* TOGGLE */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  darkMode ? "bg-pink-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    darkMode ? "translate-x-6" : ""
                  }`}
                />
              </button>

            </div>

          </CardContent>
        </Card>

      </div>

    </DashboardLayout>
  )
}