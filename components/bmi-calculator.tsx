"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Heart, Activity } from "lucide-react"

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
    suggestion = "You are underweight. Consider a balanced diet with more calories and consult a nutritionist for a healthy weight gain plan."
  } else if (bmi < 25) {
    category = "Normal"
    categoryColor = "bg-green-100 text-green-600"
    suggestion = "You are in good shape! Maintain a balanced diet and exercise regularly to stay healthy."
  } else if (bmi < 30) {
    category = "Overweight"
    categoryColor = "bg-yellow-100 text-yellow-600"
    suggestion = "You are slightly overweight. Focus on a balanced diet with fewer calories and include regular physical activity."
  } else {
    category = "Obese"
    categoryColor = "bg-red-100 text-red-600"
    suggestion = "Your BMI indicates obesity. Please consult a healthcare professional for a personalized weight management plan."
  }

  return { bmi: roundedBMI, category, categoryColor, suggestion }
}

export function BMICalculator() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [result, setResult] = useState<BMIResult | null>(null)

  const handleCalculate = () => {
    const h = parseFloat(height)
    const w = parseFloat(weight)
    const bmiResult = calculateBMI(h, w)
    setResult(bmiResult)
  }

  return (
    <Card className="w-full max-w-md rounded-3xl shadow-xl border-0 bg-card overflow-hidden">
      <CardContent className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Calculate Your <span className="text-primary">BMI</span>
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Height (cm)
            </label>
            <Input
              type="number"
              placeholder="170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="h-12 rounded-xl border-border bg-secondary/50 focus:ring-primary"
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
              className="h-12 rounded-xl border-border bg-secondary/50 focus:ring-primary"
            />
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-base"
        >
          Calculate BMI
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {result && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your BMI</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-foreground">{result.bmi}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.categoryColor}`}>
                    {result.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.category === "Normal" ? "Great! You have a normal body weight." : ""}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">AI Suggestion</p>
                  <p className="text-sm text-muted-foreground mt-1">{result.suggestion}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
