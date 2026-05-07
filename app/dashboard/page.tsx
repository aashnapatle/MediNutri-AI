"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Flame, Droplets, Footprints } from "lucide-react"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [calories, setCalories] = useState("2100")
  const [bmi, setBmi] = useState("22.5")
  const [bmiStatus, setBmiStatus] = useState("Normal")
  const [bmiColor, setBmiColor] = useState("text-green-500")

  useEffect(() => {
    const savedCalories = localStorage.getItem("calories")
    const savedBmi = localStorage.getItem("bmi")
    const savedBmiStatus = localStorage.getItem("bmiStatus")

    if (savedCalories) setCalories(savedCalories)
    if (savedBmi) setBmi(savedBmi)

    if (savedBmiStatus) {
      setBmiStatus(savedBmiStatus)

      // ✅ color change logic
      if (savedBmiStatus === "Underweight") setBmiColor("text-blue-500")
      else if (savedBmiStatus === "Normal") setBmiColor("text-green-500")
      else if (savedBmiStatus === "Overweight") setBmiColor("text-yellow-500")
      else setBmiColor("text-red-500")
    }
  }, [])

  const stats = [
    {
      label: "Your BMI",
      value: bmi,
      status: bmiStatus,
      statusColor: bmiColor, // ✅ dynamic
      icon: Heart,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Daily Calories",
      value: calories,
      unit: "kcal",
      status: "Recommended",
      statusColor: "text-primary",
      icon: Flame,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      label: "Water Intake",
      value: "6",
      unit: "glasses",
      status: "Good",
      statusColor: "text-green-500",
      icon: Droplets,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      label: "Steps",
      value: "7,350",
      unit: "steps",
      status: "Today",
      statusColor: "text-muted-foreground",
      icon: Footprints,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
    },
  ]

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's your health summary.">
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="rounded-2xl border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                      {stat.unit && <span className="text-sm text-muted-foreground">{stat.unit}</span>}
                    </div>
                    <p className={`text-sm font-medium mt-1 ${stat.statusColor}`}>
                      {stat.status}
                    </p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* UI SAME */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Card className="rounded-2xl border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h3 className="text-lg font-semibold text-foreground">Health Overview</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    You are maintaining a good balance. Keep following a healthy lifestyle!
                  </p>
                  <Button className="mt-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                    View Details
                  </Button>
                </div>
                <div className="hidden sm:flex w-40 bg-gradient-to-br from-primary/10 to-primary/5 items-center justify-center">
                  <div className="text-6xl">🏃‍♂️</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h3 className="text-lg font-semibold text-foreground">AI Daily Tip</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Drink more water and include green vegetables in your diet.
                  </p>
                </div>
                <div className="hidden sm:flex w-40 bg-gradient-to-br from-pink-100 to-pink-50 items-center justify-center">
                  <div className="text-6xl">🥤</div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </DashboardLayout>
  )
}