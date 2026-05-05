"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Flame, Coffee, Utensils, Moon, Apple } from "lucide-react"

interface CalorieResult {
  calories: number
  meals: {
    name: string
    description: string
    icon: React.ElementType
    color: string
  }[]
}

const activityLevels = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "light", label: "Light (1-3 days/week)" },
  { value: "moderate", label: "Moderate (3-5 days/week)" },
  { value: "active", label: "Active (6-7 days/week)" },
  { value: "very-active", label: "Very Active (intense exercise)" },
]

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
}

function calculateCalories(age: number, gender: string, activity: string): CalorieResult | null {
  if (!age || !gender || !activity) return null

  // Base Metabolic Rate (simplified Harris-Benedict equation)
  let bmr: number
  if (gender === "male") {
    bmr = 88.362 + (13.397 * 70) + (4.799 * 175) - (5.677 * age)
  } else {
    bmr = 447.593 + (9.247 * 60) + (3.098 * 165) - (4.330 * age)
  }

  const multiplier = activityMultipliers[activity] || 1.55
  const calories = Math.round(bmr * multiplier)

  return {
    calories,
    meals: [
      {
        name: "Breakfast",
        description: "Oats with fruits, nuts and milk",
        icon: Coffee,
        color: "bg-orange-100 text-orange-500",
      },
      {
        name: "Lunch",
        description: "Brown rice, dal, sabzi, salad",
        icon: Utensils,
        color: "bg-green-100 text-green-500",
      },
      {
        name: "Dinner",
        description: "Roti, paneer, vegetables",
        icon: Moon,
        color: "bg-blue-100 text-blue-500",
      },
      {
        name: "Snacks",
        description: "Fruits, almonds, green tea",
        icon: Apple,
        color: "bg-purple-100 text-purple-500",
      },
    ],
  }
}

export default function CaloriesPage() {
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [activity, setActivity] = useState("")
  const [result, setResult] = useState<CalorieResult | null>(null)

  const handleCalculate = () => {
    const calorieResult = calculateCalories(parseInt(age), gender, activity)
    setResult(calorieResult)
  }

  return (
    <DashboardLayout title="Calorie Calculator" subtitle="Get your daily calorie requirement">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="rounded-2xl border-0 shadow-md h-fit">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Enter Details</h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Age</label>
                <Input
                  type="number"
                  placeholder="21"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-12 rounded-xl border-border bg-secondary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Gender</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-12 rounded-xl border-border bg-secondary/50">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Activity Level
                </label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger className="h-12 rounded-xl border-border bg-secondary/50">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                Calculate Calories
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {/* Calorie Result */}
          <Card className="rounded-2xl border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Your Daily Calorie Need</h3>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Flame className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary">
                      {result ? result.calories : "2100"}
                    </span>
                    <span className="text-lg text-muted-foreground">kcal</span>
                  </div>
                  <p className="text-sm text-primary font-medium">Recommended</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Diet Suggestion */}
          <Card className="rounded-2xl border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">AI Diet Suggestion</h3>
              <div className="space-y-4">
                {(result?.meals || [
                  {
                    name: "Breakfast",
                    description: "Oats with fruits, nuts and milk",
                    icon: Coffee,
                    color: "bg-orange-100 text-orange-500",
                  },
                  {
                    name: "Lunch",
                    description: "Brown rice, dal, sabzi, salad",
                    icon: Utensils,
                    color: "bg-green-100 text-green-500",
                  },
                  {
                    name: "Dinner",
                    description: "Roti, paneer, vegetables",
                    icon: Moon,
                    color: "bg-blue-100 text-blue-500",
                  },
                  {
                    name: "Snacks",
                    description: "Fruits, almonds, green tea",
                    icon: Apple,
                    color: "bg-purple-100 text-purple-500",
                  },
                ]).map((meal) => (
                  <div key={meal.name} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${meal.color}`}>
                      <meal.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{meal.name}</p>
                      <p className="text-sm text-muted-foreground">{meal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decorative Image */}
      <div className="fixed bottom-0 left-64 pointer-events-none opacity-30 hidden xl:block">
        <div className="text-[200px]">🥗</div>
      </div>
    </DashboardLayout>
  )
}
