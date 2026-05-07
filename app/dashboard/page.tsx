"use client"

import { useState } from "react"

export default function Dashboard() {
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [goal, setGoal] = useState("")
  const [result, setResult] = useState("")

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!age || !weight || !goal) {
      setResult("⚠️ Please fill all details")
      return
    }

    const w = Number(weight)
    const a = Number(age)

    let plan = ""

    if (goal === "loss") {
      if (w > 80) {
        plan = "🔥 Strict Weight Loss Plan:\n🥗 Breakfast: Oats + Fruits\n🍛 Lunch: Salad + Roti\n🍲 Dinner: Soup + Veggies\n🚶 30 min walk"
      } else {
        plan = "⚡ Moderate Weight Loss:\n🥗 Breakfast: Smoothie\n🍛 Lunch: Dal + Rice\n🍲 Dinner: Light Salad\n🏃 20 min cardio"
      }
    } else if (goal === "gain") {
      if (w < 60) {
        plan = "💪 Weight Gain Plan:\n🥛 Breakfast: Milk + Banana\n🍗 Lunch: Chicken + Rice\n🍲 Dinner: Paneer + Roti\n🏋️ Strength training"
      } else {
        plan = "⚖️ Lean Gain Plan:\n🥚 Breakfast: Eggs + Toast\n🍛 Lunch: Balanced diet\n🍲 Dinner: Protein rich meal\n🏃 Light gym"
      }
    }

    if (a > 40) {
      plan += "\n🩺 Note: Low sugar & low salt recommended"
    }

    setResult(plan)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200">

      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96">

        <h1 className="text-2xl font-bold mb-6 text-center">
          🧠 MediNutri AI Dashboard
        </h1>

        <form onSubmit={handleGenerate} className="space-y-4">

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Goal</option>
            <option value="loss">Weight Loss</option>
            <option value="gain">Weight Gain</option>
          </select>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white p-2 rounded hover:scale-105 transition"
          >
            Generate Plan
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded whitespace-pre-line text-sm">
            {result}
          </div>
        )}
      </div>
    </div>
  )
}