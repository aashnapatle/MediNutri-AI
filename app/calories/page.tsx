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

function calculateCalories(
  age: number,
  gender: string,
  activity: string,
  weight: number,
  height: number
): CalorieResult | null {
  if (!age || !gender || !activity || !weight || !height) return null

  let bmr: number
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
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
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [result, setResult] = useState<CalorieResult | null>(null)

  // ✅ FIXED FUNCTION (NO DUPLICATE)
  const handleCalculate = () => {
    const calorieResult = calculateCalories(
      parseInt(age),
      gender,
      activity,
      parseInt(weight),
      parseInt(height)
    )

    setResult(calorieResult)

    // ✅ SAVE FOR DASHBOARD
    if (calorieResult) {
      localStorage.setItem("calories", calorieResult.calories.toString())
    }
  }

  return (
    <DashboardLayout title="Calorie Calculator" subtitle="Get your daily calorie requirement">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <Card className="rounded-2xl border-0 shadow-md h-fit">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Enter Details</h3>

            <div className="space-y-5">

              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Height (cm)</label>
                <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Activity Level</label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger>
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
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Calculate Calories
              </Button>

            </div>
          </CardContent>
        </Card>

        {/* RESULT SAME */}
        <Card className="rounded-2xl border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Daily Calorie Need</h3>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Flame className="h-8 w-8 text-primary" />
              </div>
              <div>
                <span className="text-4xl font-bold text-primary">
                  {result ? result.calories : "2100"}
                </span>
                <span className="ml-1">kcal</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}
