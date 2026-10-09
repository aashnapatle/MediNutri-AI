"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/firestore"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

export interface MealItem {
  id: string
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  quantity?: string
  date: string // YYYY-MM-DD
  time: string
}

export interface WeightEntry {
  date: string // YYYY-MM-DD
  weight: number
  bmi: number
}

export interface WaterEntry {
  date: string // YYYY-MM-DD
  day: string
  glasses: number
}

export interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  height: string
  weight: string
  goalWeight: string
  age: string
  gender: "male" | "female" | "others" | ""
  bloodType: string
  goal: "lose" | "maintain" | "gain"
  avatarUrl: string
}

export interface CycleData {
  lastPeriodDate: string // YYYY-MM-DD
  cycleLength: number // default 28
  periodDuration: number // default 5
  currentDay: number
  currentPhase: "menstrual" | "follicular" | "ovulation" | "luteal"
  nextPeriodDate: string
  fertileStart: string
  fertileEnd: string
  ovulationDate: string
}

interface HealthContextType {
  profile: UserProfile
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  bmi: { value: number | null; category: string }
  calculateAndSaveBMI: (heightCm: number, weightKg: number) => { bmi: number; category: string }
  calories: {
    target: number | null
    consumed: number
    remaining: number
    meals: MealItem[]
  }
  setCalorieTarget: (target: number) => Promise<void>
  addMeal: (meal: Omit<MealItem, "id" | "date" | "time"> & { date?: string; time?: string }) => Promise<void>
  deleteMeal: (mealId: string) => Promise<void>
  water: {
    today: number
    target: number
    history: WaterEntry[]
  }
  updateWater: (delta: number) => void
  setWaterToday: (amount: number) => void
  weightHistory: WeightEntry[]
  logWeight: (weightKg: number) => Promise<void>
  cycle: CycleData
  logPeriodToday: () => Promise<void>
  updateCycleSettings: (lastPeriod: string, cycleLen: number, duration: number) => Promise<void>
}

const HealthContext = createContext<HealthContextType | null>(null)

function getTodayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function calculateCycleDetails(lastPeriodStr: string, cycleLen = 28, duration = 5): CycleData {
  if (!lastPeriodStr) {
    return {
      lastPeriodDate: "",
      cycleLength: cycleLen,
      periodDuration: duration,
      currentDay: 1,
      currentPhase: "follicular",
      nextPeriodDate: "",
      fertileStart: "",
      fertileEnd: "",
      ovulationDate: "",
    }
  }

  const last = new Date(lastPeriodStr)
  const today = new Date()
  const diffTime = today.getTime() - last.getTime()
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))
  const currentDay = (diffDays % cycleLen) + 1

  let currentPhase: "menstrual" | "follicular" | "ovulation" | "luteal" = "follicular"
  if (currentDay <= duration) {
    currentPhase = "menstrual"
  } else if (currentDay < 12) {
    currentPhase = "follicular"
  } else if (currentDay <= 16) {
    currentPhase = "ovulation"
  } else {
    currentPhase = "luteal"
  }

  const nextPeriod = new Date(last)
  nextPeriod.setDate(last.getDate() + cycleLen)

  const ovulation = new Date(last)
  ovulation.setDate(last.getDate() + (cycleLen - 14))

  const fertileStart = new Date(ovulation)
  fertileStart.setDate(ovulation.getDate() - 5)

  const fertileEnd = new Date(ovulation)
  fertileEnd.setDate(ovulation.getDate() + 1)

  const formatDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return {
    lastPeriodDate: lastPeriodStr,
    cycleLength: cycleLen,
    periodDuration: duration,
    currentDay,
    currentPhase,
    nextPeriodDate: formatDate(nextPeriod),
    fertileStart: formatDate(fertileStart),
    fertileEnd: formatDate(fertileEnd),
    ovulationDate: formatDate(ovulation),
  }
}

export function HealthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    location: "",
    height: "",
    weight: "",
    goalWeight: "",
    age: "",
    gender: "",
    bloodType: "",
    goal: "maintain",
    avatarUrl: "",
  })

  const [bmi, setBmi] = useState<{ value: number | null; category: string }>({ value: null, category: "" })
  const [calorieTarget, setCalorieTargetState] = useState<number | null>(null)
  const [meals, setMeals] = useState<MealItem[]>([])
  const [waterToday, setWaterTodayState] = useState<number>(0)
  const [waterHistory, setWaterHistory] = useState<WaterEntry[]>([])
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([])
  const [cycleData, setCycleData] = useState<CycleData>(calculateCycleDetails(""))

  // Load from local storage or Firestore on mount
  useEffect(() => {
    // 1. Initial LocalStorage Cache Read
    try {
      const savedBmi = localStorage.getItem("bmi")
      const savedBmiStatus = localStorage.getItem("bmiStatus")
      if (savedBmi) setBmi({ value: parseFloat(savedBmi), category: savedBmiStatus || "Normal" })

      const savedCalories = localStorage.getItem("calories")
      if (savedCalories) setCalorieTargetState(parseInt(savedCalories))

      const savedWater = localStorage.getItem("water_intake")
      if (savedWater) setWaterTodayState(parseInt(savedWater))

      const savedMeals = localStorage.getItem("medinutri_meals")
      if (savedMeals) setMeals(JSON.parse(savedMeals))

      const savedWeights = localStorage.getItem("medinutri_weights")
      if (savedWeights) setWeightHistory(JSON.parse(savedWeights))

      const savedWaterHist = localStorage.getItem("medinutri_water_history")
      if (savedWaterHist) setWaterHistory(JSON.parse(savedWaterHist))

      const savedCycle = localStorage.getItem("medinutri_cycle")
      if (savedCycle) {
        const c = JSON.parse(savedCycle)
        setCycleData(calculateCycleDetails(c.lastPeriodDate, c.cycleLength, c.periodDuration))
      }
    } catch (e) {
      console.warn("Local storage parse error:", e)
    }

    // 2. Firebase Sync
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return
      try {
        const snap = await getDoc(doc(db, "users", user.uid))
        if (snap.exists()) {
          const d = snap.data()
          setProfileState((prev) => ({
            ...prev,
            name: d.name || user.displayName || "",
            email: d.email || user.email || "",
            phone: d.phone || "",
            location: d.location || "",
            height: d.height || "",
            weight: d.weight || "",
            goalWeight: d.goalWeight || "",
            age: d.age || "",
            gender: d.gender || "",
            bloodType: d.bloodType || "",
            goal: d.goal || "maintain",
            avatarUrl: d.avatarUrl || user.photoURL || "",
          }))

          if (d.calorieTarget) {
            setCalorieTargetState(d.calorieTarget)
            localStorage.setItem("calories", d.calorieTarget.toString())
          }
          if (d.bmi) {
            setBmi({ value: d.bmi, category: d.bmiStatus || "Normal" })
            localStorage.setItem("bmi", d.bmi.toString())
            localStorage.setItem("bmiStatus", d.bmiStatus || "Normal")
          }
          if (d.cycleData?.lastPeriodDate) {
            setCycleData(calculateCycleDetails(d.cycleData.lastPeriodDate, d.cycleData.cycleLength, d.cycleData.periodDuration))
            localStorage.setItem("medinutri_cycle", JSON.stringify(d.cycleData))
          }
          if (Array.isArray(d.weightHistory) && d.weightHistory.length > 0) {
            setWeightHistory(d.weightHistory)
            localStorage.setItem("medinutri_weights", JSON.stringify(d.weightHistory))
          }
        } else {
          setProfileState((prev) => ({
            ...prev,
            name: user.displayName || "",
            email: user.email || "",
            avatarUrl: user.photoURL || "",
          }))
        }
      } catch (err) {
        console.error("Firestore health data load error:", err)
      }
    })

    return () => unsubscribe()
  }, [])

  // Profile update
  const updateProfile = async (data: Partial<UserProfile>) => {
    const updated = { ...profile, ...data }
    setProfileState(updated)

    if (updated.height && updated.weight) {
      calculateAndSaveBMI(parseFloat(updated.height), parseFloat(updated.weight))
    }

    const user = auth.currentUser
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), updated, { merge: true })
      } catch (e) {
        console.error("Save profile error:", e)
      }
    }
  }

  // Calculate & Save BMI
  const calculateAndSaveBMI = (heightCm: number, weightKg: number) => {
    if (heightCm <= 0 || weightKg <= 0) return { bmi: 0, category: "Normal" }
    const heightM = heightCm / 100
    const val = Math.round((weightKg / (heightM * heightM)) * 10) / 10
    let cat = "Normal"
    if (val < 18.5) cat = "Underweight"
    else if (val < 25) cat = "Normal"
    else if (val < 30) cat = "Overweight"
    else cat = "Obese"

    const newBmi = { value: val, category: cat }
    setBmi(newBmi)
    localStorage.setItem("bmi", val.toString())
    localStorage.setItem("bmiStatus", cat)

    const user = auth.currentUser
    if (user) {
      setDoc(doc(db, "users", user.uid), { bmi: val, bmiStatus: cat }, { merge: true }).catch(() => {})
    }

    return newBmi
  }

  // Calorie target update
  const setCalorieTarget = async (target: number) => {
    setCalorieTargetState(target)
    localStorage.setItem("calories", target.toString())

    const user = auth.currentUser
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { calorieTarget: target }, { merge: true })
      } catch {}
    }
  }

  // Add meal
  const addMeal = async (mealData: Omit<MealItem, "id" | "date" | "time"> & { date?: string; time?: string }) => {
    const today = getTodayString()
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const newMeal: MealItem = {
      ...mealData,
      id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 6),
      date: mealData.date || today,
      time: mealData.time || nowTime,
    }

    const updated = [newMeal, ...meals]
    setMeals(updated)
    localStorage.setItem("medinutri_meals", JSON.stringify(updated))

    const user = auth.currentUser
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { meals: updated.slice(0, 50) }, { merge: true })
      } catch {}
    }
  }

  // Delete meal
  const deleteMeal = async (mealId: string) => {
    const updated = meals.filter((m) => m.id !== mealId)
    setMeals(updated)
    localStorage.setItem("medinutri_meals", JSON.stringify(updated))

    const user = auth.currentUser
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { meals: updated.slice(0, 50) }, { merge: true })
      } catch {}
    }
  }

  // Water updates
  const updateWater = (delta: number) => {
    const nextVal = Math.max(0, waterToday + delta)
    setWaterTodayState(nextVal)
    localStorage.setItem("water_intake", nextVal.toString())

    const todayStr = getTodayString()
    const dayName = new Date().toLocaleDateString("en-US", { weekday: "short" })

    setWaterHistory((prev) => {
      const idx = prev.findIndex((h) => h.date === todayStr)
      let nextHist: WaterEntry[]
      if (idx >= 0) {
        nextHist = prev.map((h, i) => (i === idx ? { ...h, glasses: nextVal } : h))
      } else {
        nextHist = [...prev, { date: todayStr, day: dayName, glasses: nextVal }].slice(-15)
      }
      localStorage.setItem("medinutri_water_history", JSON.stringify(nextHist))
      return nextHist
    })
  }

  const setWaterToday = (amount: number) => {
    const val = Math.max(0, amount)
    setWaterTodayState(val)
    localStorage.setItem("water_intake", val.toString())
  }

  // Log weight
  const logWeight = async (weightKg: number) => {
    const today = getTodayString()
    let bmiVal = 0
    if (profile.height) {
      const hM = parseFloat(profile.height) / 100
      bmiVal = Math.round((weightKg / (hM * hM)) * 10) / 10
    }

    const entry: WeightEntry = { date: today, weight: weightKg, bmi: bmiVal }
    const updated = [...weightHistory.filter((w) => w.date !== today), entry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    setWeightHistory(updated)
    localStorage.setItem("medinutri_weights", JSON.stringify(updated))

    // Update profile weight as well
    updateProfile({ weight: weightKg.toString() })

    const user = auth.currentUser
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { weightHistory: updated }, { merge: true })
      } catch {}
    }
  }

  // Cycle tracking
  const logPeriodToday = async () => {
    const today = getTodayString()
    const newDetails = calculateCycleDetails(today, cycleData.cycleLength, cycleData.periodDuration)
    setCycleData(newDetails)
    localStorage.setItem("medinutri_cycle", JSON.stringify(newDetails))

    const user = auth.currentUser
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { cycleData: newDetails }, { merge: true })
      } catch {}
    }
  }

  const updateCycleSettings = async (lastPeriod: string, cycleLen: number, duration: number) => {
    const newDetails = calculateCycleDetails(lastPeriod, cycleLen, duration)
    setCycleData(newDetails)
    localStorage.setItem("medinutri_cycle", JSON.stringify(newDetails))

    const user = auth.currentUser
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), { cycleData: newDetails }, { merge: true })
      } catch {}
    }
  }

  // Compute today's consumed calories
  const todayStr = getTodayString()
  const todayMeals = meals.filter((m) => m.date === todayStr)
  const consumed = todayMeals.reduce((acc, curr) => acc + (curr.calories || 0), 0)
  const remaining = calorieTarget ? Math.max(0, calorieTarget - consumed) : 0

  return (
    <HealthContext.Provider
      value={{
        profile,
        updateProfile,
        bmi,
        calculateAndSaveBMI,
        calories: {
          target: calorieTarget,
          consumed,
          remaining,
          meals,
        },
        setCalorieTarget,
        addMeal,
        deleteMeal,
        water: {
          today: waterToday,
          target: 8,
          history: waterHistory,
        },
        updateWater,
        setWaterToday,
        weightHistory,
        logWeight,
        cycle: cycleData,
        logPeriodToday,
        updateCycleSettings,
      }}
    >
      {children}
    </HealthContext.Provider>
  )
}

export function useHealth(): HealthContextType {
  const ctx = useContext(HealthContext)
  if (!ctx) throw new Error("useHealth must be used within HealthProvider")
  return ctx
}