"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/LanguageContext"
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
  const { language, setLanguage } = useLanguage()

  // load saved theme + language
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const savedLang = localStorage.getItem("lang")

    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  // apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  // save language
  useEffect(() => {
    localStorage.setItem("lang", language)
  }, [language])

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

              {/* Dark Mode */}
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

              {/* Language */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">{language}</p>
                  </div>
                </div>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border rounded px-3 py-1 bg-white dark:bg-gray-800"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                </select>
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