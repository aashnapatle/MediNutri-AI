"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Flame, Droplets, Footprints, Plus, Minus } from "lucide-react"
import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const [calories, setCalories] = useState("2100")
  const [bmi, setBmi] = useState("22.5")
  const [bmiStatus, setBmiStatus] = useState("Normal")
  const [bmiColor, setBmiColor] = useState("text-green-500")
  const [waterGlasses, setWaterGlasses] = useState(6)
  
  // ✅ NEW: Step Count State (Mocking 7350 steps)
  const [steps, setSteps] = useState(7350)
  const stepGoal = 10000

  // ✅ Helper to calculate distance and calories from steps
  const getStepStats = (currentSteps: number) => {
    const km = (currentSteps * 0.000762).toFixed(2) // Avg stride 0.76m
    const kcal = Math.floor(currentSteps * 0.04)   // Avg 0.04 kcal per step
    const progress = Math.min((currentSteps / stepGoal) * 100, 100)
    return { km, kcal, progress }
  }

  const stepStats = getStepStats(steps)

  const activityData = [
    { day: "Mon", water: 4, steps: 4000 },
    { day: "Tue", water: 7, steps: 5200 },
    { day: "Wed", water: 8, steps: 7500 },
    { day: "Thu", water: 6, steps: 6100 },
    { day: "Fri", water: 10, steps: 9200 },
    { day: "Sat", water: 12, steps: 11000 },
    { day: "Sun", water: waterGlasses, steps: steps }, 
  ]

  useEffect(() => {
    const savedCalories = localStorage.getItem("calories")
    const savedBmi = localStorage.getItem("bmi")
    const savedBmiStatus = localStorage.getItem("bmiStatus")
    const savedWater = localStorage.getItem("water_intake")

    if (savedCalories) setCalories(savedCalories)
    if (savedBmi) setBmi(savedBmi)
    if (savedWater) setWaterGlasses(parseInt(savedWater))

    if (savedBmiStatus) {
      setBmiStatus(savedBmiStatus)
      if (savedBmiStatus === "Underweight") setBmiColor("text-blue-500")
      else if (savedBmiStatus === "Normal") setBmiColor("text-green-500")
      else if (savedBmiStatus === "Overweight") setBmiColor("text-yellow-500")
      else setBmiColor("text-red-500")
    }
  }, [])

  const updateWater = (newValue: number) => {
    const value = Math.max(0, newValue) 
    setWaterGlasses(value)
    localStorage.setItem("water_intake", value.toString())
  }

  const getWaterStatus = () => {
    if (waterGlasses < 4) return { label: "Hydrate!", color: "text-red-500" }
    if (waterGlasses < 8) return { label: "Good", color: "text-blue-500" }
    if (waterGlasses < 12) return { label: "Perfect!", color: "text-green-500" }
    return { label: "Overhydrated!", color: "text-orange-600" }
  }

  const stats = [
    { id: "bmi", label: "Your BMI", value: bmi, status: bmiStatus, statusColor: bmiColor, icon: Heart, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { id: "calories", label: "Daily Calories", value: calories, unit: "kcal", status: "Recommended", statusColor: "text-primary", icon: Flame, iconBg: "bg-orange-100", iconColor: "text-orange-500" },
    { id: "water", label: "Water Intake", value: waterGlasses.toString(), unit: "glasses", status: getWaterStatus().label, statusColor: getWaterStatus().color, icon: Droplets, iconBg: "bg-blue-100", iconColor: "text-blue-500" },
    { 
      id: "steps", 
      label: "Steps", 
      value: steps.toLocaleString(), 
      unit: "steps", 
      // ✅ Now shows KM and Calories burned
      status: `${stepStats.km} km | ${stepStats.kcal} kcal`, 
      statusColor: "text-muted-foreground", 
      icon: Footprints, 
      iconBg: "bg-purple-100", 
      iconColor: "text-purple-500" 
    },
  ]

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's your health summary.">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.id} className="rounded-2xl border-0 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                      {stat.unit && <span className="text-sm text-muted-foreground">{stat.unit}</span>}
                    </div>
                    <p className={`text-sm font-medium mt-1 ${stat.statusColor}`}>{stat.status}</p>
                    
                    {/* ✅ Added buttons for Water, and could easily add for Steps here too */}
                    {stat.id === "water" && (
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="icon" className="h-7 w-7 rounded-md" onClick={() => updateWater(waterGlasses - 1)}><Minus className="h-3 w-3" /></Button>
                        <Button variant="outline" size="icon" className="h-7 w-7 rounded-md border-blue-200" onClick={() => updateWater(waterGlasses + 1)}><Plus className="h-3 w-3" /></Button>
                      </div>
                    )}

                    {/* ✅ Optional: Simple progress bar inside the Steps card */}
                    {stat.id === "steps" && (
                      <div className="mt-4 h-1 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-500" 
                          style={{ width: `${stepStats.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}><stat.icon className={`h-6 w-6 ${stat.iconColor}`} /></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border-0 shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Weekly Activity</h3>
            <p className="text-sm text-muted-foreground">Water consumption trend (Glasses)</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="water" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-0 shadow-md overflow-hidden">
            <CardContent className="p-0 flex">
                <div className="flex-1 p-6">
                  <h3 className="text-lg font-semibold">Health Overview</h3>
                  <p className="text-sm text-muted-foreground mt-2">You are maintaining a good balance. Keep it up!</p>
                  <Button className="mt-4 rounded-xl bg-primary">View Details</Button>
                </div>
                <div className="hidden sm:flex w-40 bg-primary/10 items-center justify-center text-6xl">🏃‍♂️</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-md overflow-hidden">
            <CardContent className="p-0 flex">
                <div className="flex-1 p-6">
                  <h3 className="text-lg font-semibold text-foreground">AI Daily Tip</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {/* ✅ Integrated AI Logic: Remind user to drink water if they walked a lot */}
                    {steps > 7000 && waterGlasses < 8 
                      ? "You've walked a lot! Increase your water intake to stay hydrated."
                      : waterGlasses >= 12 
                        ? "Take a break from water!" 
                        : "Everything looks great today!"}
                  </p>
                </div>
                <div className="hidden sm:flex w-40 bg-pink-50 items-center justify-center text-6xl">🥤</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}