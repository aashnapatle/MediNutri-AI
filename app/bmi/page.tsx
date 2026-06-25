"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Heart, Scale } from "lucide-react"

interface BMIResult {
  bmi: number
  category: string
  categoryColor: string
  suggestion: string
}

function calculateBMI(height: number, weight: number): BMIResult | null {
  if (height <= 0 || weight <= 0) return null

  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)
  const roundedBMI = Math.round(bmi * 10) / 10

  let category: string
  let categoryColor: string
  let suggestion: string

  if (bmi < 18.5) {
    category = "Underweight"
    categoryColor = "bg-blue-100 text-blue-600"
    suggestion = "You are underweight. Consider a balanced diet with more calories."
  } else if (bmi < 25) {
    category = "Normal"
    categoryColor = "bg-green-100 text-green-600"
    suggestion = "You are in good shape! Maintain a balanced diet."
  } else if (bmi < 30) {
    category = "Overweight"
    categoryColor = "bg-yellow-100 text-yellow-600"
    suggestion = "You are slightly overweight. Focus on balanced diet + exercise."
  } else {
    category = "Obese"
    categoryColor = "bg-red-100 text-red-600"
    suggestion = "Consult a professional for weight management."
  }

  return { bmi: roundedBMI, category, categoryColor, suggestion }
}

const bmiRanges = [
  { range: "< 18.5", category: "Underweight", color: "bg-blue-500" },
  { range: "18.5 - 24.9", category: "Normal", color: "bg-green-500" },
  { range: "25 - 29.9", category: "Overweight", color: "bg-yellow-500" },
  { range: "> 30", category: "Obese", color: "bg-red-500" },
]

export default function BMIPage() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [result, setResult] = useState<BMIResult | null>(null)

  const handleCalculate = () => {
    const h = parseFloat(height)
    const w = parseFloat(weight)

    const bmiResult = calculateBMI(h, w)
    setResult(bmiResult)

    // ✅ MAIN FIX (dashboard ke liye)
    if (bmiResult) {
      localStorage.setItem("bmi", bmiResult.bmi.toString())
      localStorage.setItem("bmiStatus", bmiResult.category)
    }
  }

  return (
    <DashboardLayout title="BMI Calculator" subtitle="Calculate your Body Mass Index">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <Card className="rounded-2xl border-0 shadow-md h-fit">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Enter Your Details</h3>
                <p className="text-sm text-muted-foreground">Height and weight for BMI calculation</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Height (cm)
                </label>
                <Input
                  type="number"
                  placeholder="170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="h-12 rounded-xl border-border bg-secondary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  placeholder="65"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-12 rounded-xl border-border bg-secondary/50"
                />
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                Calculate BMI
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">BMI Categories</h4>
              <div className="space-y-2">
                {bmiRanges.map((item) => (
                  <div key={item.category} className="flex items-center gap-3 text-sm">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground">{item.range}</span>
                    <span className="text-foreground font-medium">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RESULT UI SAME */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Your BMI Result</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-foreground">
                      {result ? result.bmi : "22.5"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${result?.categoryColor || "bg-green-100 text-green-600"}`}>
                      {result?.category || "Normal"}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {result?.suggestion || "You are in good shape!"}
                  </p>
                </div>
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">AI Suggestion</h3>
                  <p className="text-muted-foreground mt-2">
                    {result?.suggestion || "Maintain a balanced diet and exercise regularly."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  )
}