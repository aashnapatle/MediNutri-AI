"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, Flame, Droplets, Footprints, TrendingUp } from "lucide-react"

const stats = [
  {
    label: "Your BMI",
    value: "22.5",
    status: "Normal",
    statusColor: "text-green-500",
    icon: Heart,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Daily Calories",
    value: "2100",
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

const nutrients = [
  { name: "Protein", value: 75, color: "bg-blue-500" },
  { name: "Carbs", value: 60, color: "bg-green-500" },
  { name: "Fats", value: 40, color: "bg-yellow-500" },
]

const calorieDistribution = [
  { name: "Carbs", value: 55, color: "#e84a7f" },
  { name: "Protein", value: 25, color: "#4ade80" },
  { name: "Fats", value: 20, color: "#f59e0b" },
]

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back! Here&apos;s your health summary.">
      <div className="space-y-6">
        {/* Stats Grid */}
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
                      {stat.status === "Good" && <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>}
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

        {/* Health Overview & AI Daily Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Overview */}
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

          {/* AI Daily Tip */}
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

        {/* Nutrient Balance & Calories Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nutrient Balance */}
          <Card className="rounded-2xl border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Nutrient Balance</h3>
              <div className="space-y-4">
                {nutrients.map((nutrient) => (
                  <div key={nutrient.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{nutrient.name}</span>
                      <span className="font-medium text-foreground">{nutrient.value}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${nutrient.color} transition-all duration-500`}
                        style={{ width: `${nutrient.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calories Distribution */}
          <Card className="rounded-2xl border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Calories Distribution</h3>
              <div className="flex items-center gap-8">
                {/* Simple Donut Chart */}
                <div className="relative h-32 w-32">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#fce7eb" strokeWidth="20" />
                    {/* Carbs - 55% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e84a7f"
                      strokeWidth="20"
                      strokeDasharray={`${55 * 2.51} ${100 * 2.51}`}
                      strokeDashoffset="0"
                    />
                    {/* Protein - 25% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="20"
                      strokeDasharray={`${25 * 2.51} ${100 * 2.51}`}
                      strokeDashoffset={`${-55 * 2.51}`}
                    />
                    {/* Fats - 20% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="20"
                      strokeDasharray={`${20 * 2.51} ${100 * 2.51}`}
                      strokeDashoffset={`${-80 * 2.51}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Flame className="h-6 w-6 text-primary mx-auto" />
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                  {calorieDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
