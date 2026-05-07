"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { translations } from "@/lib/translations"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Moon, Globe, Shield, Smartphone, Mail } from "lucide-react"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const { language, setLanguage } = useLanguage()
  const t = translations[language]

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
    <DashboardLayout title={t.settings} subtitle={t.subtitle}>
      <div className="max-w-3xl space-y-6">

        {/* Notifications */}
        <Card className="rounded-2xl border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t.notifications}</h3>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="rounded-2xl border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t.preferences}</h3>

            <div className="space-y-4">

              {/* Dark Mode */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-4">
                  <Moon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t.darkMode}</p>
                    <p className="text-sm text-muted-foreground">{t.darkModeDesc}</p>
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
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t.language}</p>
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
            <h3 className="text-lg font-semibold mb-4">{t.security}</h3>

            <Button className="rounded-xl">
              {t.changePassword}
            </Button>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}