"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Moon, Globe, Shield, Smartphone, Mail } from "lucide-react"

const notificationSettings = [
  {
    id: "email",
    label: "Email Notifications",
    description: "Receive updates via email",
    icon: Mail,
    enabled: true,
  },
  {
    id: "push",
    label: "Push Notifications",
    description: "Receive push notifications on your device",
    icon: Smartphone,
    enabled: true,
  },
  {
    id: "reminders",
    label: "Daily Reminders",
    description: "Get daily health and fitness reminders",
    icon: Bell,
    enabled: false,
  },
]

const securitySettings = [
  {
    id: "2fa",
    label: "Two-Factor Authentication",
    description: "Add an extra layer of security",
    icon: Shield,
    enabled: false,
  },
]

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
      <div className="max-w-3xl space-y-6">

        {/* Notifications */}
        <Card className="rounded-2xl border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <setting.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{setting.label}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="rounded-2xl border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preferences</h3>

            <div className="space-y-4">

              {/* 🌙 DARK MODE */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Moon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                  </div>
                </div>

                <Switch
                  checked={darkMode}
                  onCheckedChange={() => setDarkMode(!darkMode)}
                />
              </div>

              {/* 🌐 LANGUAGE */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">English (US)</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="rounded-xl">
                  Change
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="rounded-2xl border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Security</h3>
            <div className="space-y-4">
              {securitySettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <setting.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{setting.label}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}

              <div className="pt-4 border-t">
                <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary hover:text-white">
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-2xl border border-red-200 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-red-500 mb-4">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back.
            </p>
            <Button variant="destructive" className="rounded-xl">
              Delete Account
            </Button>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}