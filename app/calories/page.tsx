"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  Flame,
  Target,
  Sparkles,
  ArrowRight,
  Calculator,
  UtensilsCrossed,
  CheckCircle2,
  PieChart,
} from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { useHealth, MealItem } from "@/context/HealthContext"

export default function CaloriesPage() {
  const { t } = useLanguage()
  const { profile, calories, addMeal, deleteMeal, setCalorieTarget } = useHealth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<"log" | "calculator">("log")

  // Add Meal modal state
  const [isAddMealOpen, setIsAddMealOpen] = useState(false)
  const [mealForm, setMealForm] = useState({
    name: "",
    quantity: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    type: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
  })

  // Calculator Form state (pre-filled from profile)
  const [calcForm, setCalcForm] = useState({
    age: profile.age || "25",
    gender: profile.gender || "female",
    height: profile.height || "165",
    weight: profile.weight || "60",
    activity: "moderate",
    goal: profile.goal || "maintain",
  })

  const [calcResults, setCalcResults] = useState<{
    bmr: number
    tdee: number
    target: number
  } | null>(null)

  const [toastMessage, setToastMessage] = useState("")

  // Pre-fill calculator when profile loads
  useEffect(() => {
    if (profile.age || profile.height || profile.weight || profile.gender) {
      setCalcForm((prev) => ({
        ...prev,
        age: profile.age || prev.age,
        gender: profile.gender || prev.gender,
        height: profile.height || prev.height,
        weight: profile.weight || prev.weight,
        goal: profile.goal || prev.goal,
      }))
    }
  }, [profile])

  // Handle Add Meal
  const handleAddMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mealForm.name || !mealForm.calories) return

    await addMeal({
      name: mealForm.name,
      quantity: mealForm.quantity,
      calories: parseInt(mealForm.calories) || 0,
      protein: mealForm.protein ? parseFloat(mealForm.protein) : undefined,
      carbs: mealForm.carbs ? parseFloat(mealForm.carbs) : undefined,
      fat: mealForm.fat ? parseFloat(mealForm.fat) : undefined,
      type: mealForm.type,
    })

    setMealForm({
      name: "",
      quantity: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      type: "breakfast",
    })
    setIsAddMealOpen(false)
    setToastMessage("Meal added to today's log!")
    setTimeout(() => setToastMessage(""), 3000)
  }

  // Handle Calorie Calculation using Mifflin-St Jeor equation
  const handleCalculateTDEE = (e: React.FormEvent) => {
    e.preventDefault()
    const age = parseInt(calcForm.age) || 25
    const height = parseFloat(calcForm.height) || 165
    const weight = parseFloat(calcForm.weight) || 60
    const gender = calcForm.gender

    let bmr = 0
    if (gender === "male") {
      bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5)
    } else {
      bmr = Math.round(10 * weight + 6.25 * height - 5 * age - 161)
    }

    let multiplier = 1.375
    if (calcForm.activity === "sedentary") multiplier = 1.2
    else if (calcForm.activity === "light") multiplier = 1.375
    else if (calcForm.activity === "moderate") multiplier = 1.55
    else if (calcForm.activity === "very") multiplier = 1.725

    const tdee = Math.round(bmr * multiplier)

    let target = tdee
    if (calcForm.goal === "lose") target = Math.round(tdee - 450)
    else if (calcForm.goal === "gain") target = Math.round(tdee + 400)

    setCalcResults({ bmr, tdee, target })
  }

  // Save Calculated Target to Health Context & Firestore
  const handleSaveTarget = async () => {
    if (!calcResults) return
    await setCalorieTarget(calcResults.target)
    setToastMessage("Daily calorie target updated across the app!")
    setTimeout(() => setToastMessage(""), 3000)
  }

  // Group today's meals by category
  const todayMeals = calories.meals
  const breakfastMeals = todayMeals.filter((m) => m.type === "breakfast")
  const lunchMeals = todayMeals.filter((m) => m.type === "lunch")
  const dinnerMeals = todayMeals.filter((m) => m.type === "dinner")
  const snackMeals = todayMeals.filter((m) => m.type === "snack")

  // Macro totals
  const totalProtein = todayMeals.reduce((acc, m) => acc + (m.protein || 0), 0)
  const totalCarbs = todayMeals.reduce((acc, m) => acc + (m.carbs || 0), 0)
  const totalFat = todayMeals.reduce((acc, m) => acc + (m.fat || 0), 0)

  // Meal section renderer
  const renderMealSection = (
    title: string,
    type: "breakfast" | "lunch" | "dinner" | "snack",
    icon: string,
    items: MealItem[],
    accentBadge: string
  ) => {
    const sectionCals = items.reduce((acc, i) => acc + i.calories, 0)

    return (
      <div className="nature-card p-5 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7DE]">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 flex items-center justify-center rounded-2xl ${accentBadge} text-lg shadow-2xs`}>
              {icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#172C23] font-serif">{title}</h4>
              <span className="text-xs text-[#63736A]">{items.length} items logged</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-[#172C23] bg-[#FAF8F0] border border-[#E5E7DE] px-3 py-1 rounded-full">
              {sectionCals} kcal
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setMealForm((prev) => ({ ...prev, type }))
                setIsAddMealOpen(true)
              }}
              className="h-8 w-8 p-0 rounded-xl border-[#E5E7DE] text-[#173B2D] hover:bg-[#E5F0DF] hover:border-[#7EAA82] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-[#63736A] italic py-5 text-center">
            Nothing logged yet for {title.toLowerCase()}
          </p>
        ) : (
          <div className="divide-y divide-[#E5E7DE]/70 mt-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between text-xs hover:bg-[#FAF8F0] -mx-2 px-2 rounded-xl transition-colors"
              >
                <div>
                  <p className="font-semibold text-[#172C23] text-sm">{item.name}</p>
                  <p className="text-[#63736A] text-[11px] mt-0.5">
                    {item.quantity && <span>{item.quantity} · </span>}
                    {item.protein ? <span className="text-[#2E6B40]">P: {item.protein}g </span> : ""}
                    {item.carbs ? <span className="text-[#D97706]">C: {item.carbs}g </span> : ""}
                    {item.fat ? <span className="text-[#E05A5A]">F: {item.fat}g </span> : ""}
                    {item.time && <span className="opacity-70 ml-1">({item.time})</span>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#172C23] text-sm">{item.calories} kcal</span>
                  <button
                    onClick={() => deleteMeal(item.id)}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-[#63736A] hover:bg-[#FCE8E5] hover:text-[#E05A5A] transition-colors cursor-pointer"
                    aria-label="Delete meal"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <DashboardLayout title={t("calorieTitle")} subtitle={t("calorieSubtitle")}>
      <div className="space-y-6">

        {/* ── FEEDBACK TOAST ── */}
        {toastMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#E5F0DF] text-[#173B2D] border border-[#7EAA82]/30 shadow-xs animate-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4 text-[#7EAA82] shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* ── TAB SWITCHER ── */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/90 border border-[#E5E7DE] max-w-fit shadow-2xs">
          <button
            onClick={() => setActiveTab("log")}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "log"
                ? "bg-[#173B2D] text-white shadow-xs"
                : "text-[#63736A] hover:text-[#172C23]"
            }`}
          >
            {t("dailyMealLog")}
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "calculator"
                ? "bg-[#173B2D] text-white shadow-xs"
                : "text-[#63736A] hover:text-[#172C23]"
            }`}
          >
            {t("calorieCalculator")}
          </button>
        </div>

        {/* ════════ TAB 1: DAILY MEAL LOG ════════ */}
        {activeTab === "log" && (
          <div className="space-y-6">

            {/* 3 Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Consumed */}
              <Card className="nature-card stat-card-calories p-5 rounded-3xl border border-[#DEECDA] bg-[#F3F8F1] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E7855]">
                  {t("consumedToday")}
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#172C23]">
                    {calories.consumed}
                  </span>
                  <span className="text-xs font-semibold text-[#63736A]">kcal</span>
                </div>
              </Card>

              {/* Target */}
              <Card className="nature-card p-5 rounded-3xl border border-[#E5E7DE] bg-white/95 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#63736A]">
                  {t("dailyTarget")}
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#172C23]">
                    {calories.target || 2000}
                  </span>
                  <span className="text-xs font-semibold text-[#63736A]">kcal</span>
                </div>
              </Card>

              {/* Remaining */}
              <Card className="nature-card p-5 rounded-3xl border border-[#E5E7DE] bg-white/95 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#63736A]">
                  {t("remainingCalories")}
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className={`text-3xl sm:text-4xl font-extrabold ${calories.remaining < 0 ? "text-[#E05A5A]" : "text-[#172C23]"}`}>
                    {calories.remaining}
                  </span>
                  <span className="text-xs font-semibold text-[#63736A]">kcal</span>
                </div>
              </Card>
            </div>

            {/* Macro Breakdown Pills */}
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white/90 border border-[#E5E7DE] shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#63736A] mr-2">
                Today&apos;s Macros:
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E5F0DF] text-[#2E6B40] border border-[#DEECDA]">
                Protein: {totalProtein}g
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FFF4E5] text-[#D97706] border border-[#FED7AA]">
                Carbs: {totalCarbs}g
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FCE8E5] text-[#E05A5A] border border-[#F8DFD9]">
                Fat: {totalFat}g
              </span>
            </div>

            {/* "Ask AI" Helper Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#E5F0DF] to-[#F3F8F1] border border-[#DEECDA] shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white text-[#38664F] flex items-center justify-center shadow-2xs">
                  <Sparkles className="h-5 w-5 text-[#FF777F]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172C23] font-serif">
                    {t("dontKnowCalories")}
                  </h4>
                  <p className="text-xs text-[#63736A] mt-0.5">
                    {t("askAIDescription")}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/chat")}
                className="rounded-full bg-[#173B2D] hover:bg-[#102F24] text-white text-xs font-semibold px-5 py-2.5 shadow-xs cursor-pointer btn-hover"
              >
                <span>{t("askAI")}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>

            {/* 4 Meal Sections in 2-column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {renderMealSection(t("breakfast"), "breakfast", "🌅", breakfastMeals, "bg-[#FFF4E5]")}
              {renderMealSection(t("lunch"), "lunch", "☀️", lunchMeals, "bg-[#E5F0DF]")}
              {renderMealSection(t("dinner"), "dinner", "🌙", dinnerMeals, "bg-[#E8F4FC]")}
              {renderMealSection(t("snack"), "snack", "🍎", snackMeals, "bg-[#FCE8E5]")}
            </div>

          </div>
        )}

        {/* ════════ TAB 2: CALORIE CALCULATOR ════════ */}
        {activeTab === "calculator" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* Calculator Inputs Card */}
            <Card className="nature-card p-6 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-11 w-11 rounded-2xl bg-[#E5F0DF] text-[#173B2D] flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-[#38664F]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#172C23] font-serif">
                    Mifflin-St Jeor TDEE Engine
                  </h3>
                  <p className="text-xs text-[#63736A]">
                    Calculate your metabolic rate and daily calorie needs
                  </p>
                </div>
              </div>

              <form onSubmit={handleCalculateTDEE} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">Age</label>
                    <Input
                      type="number"
                      value={calcForm.age}
                      onChange={(e) => setCalcForm({ ...calcForm, age: e.target.value })}
                      required
                      className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">Gender</label>
                    <select
                      value={calcForm.gender}
                      onChange={(e) => setCalcForm({ ...calcForm, gender: e.target.value })}
                      className="mt-1.5 w-full h-9 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] px-3 text-xs text-[#172C23] focus:outline-none focus:border-[#7EAA82]"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">Height (cm)</label>
                    <Input
                      type="number"
                      value={calcForm.height}
                      onChange={(e) => setCalcForm({ ...calcForm, height: e.target.value })}
                      required
                      className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">Weight (kg)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={calcForm.weight}
                      onChange={(e) => setCalcForm({ ...calcForm, weight: e.target.value })}
                      required
                      className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">Activity Level</label>
                  <select
                    value={calcForm.activity}
                    onChange={(e) => setCalcForm({ ...calcForm, activity: e.target.value })}
                    className="mt-1.5 w-full h-9 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] px-3 text-xs text-[#172C23] focus:outline-none focus:border-[#7EAA82]"
                  >
                    <option value="sedentary">Sedentary (little to no exercise)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="very">Very Active (6-7 days/week)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">Health Goal</label>
                  <select
                    value={calcForm.goal}
                    onChange={(e) => setCalcForm({ ...calcForm, goal: e.target.value })}
                    className="mt-1.5 w-full h-9 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] px-3 text-xs text-[#172C23] focus:outline-none focus:border-[#7EAA82]"
                  >
                    <option value="lose">Gradual Weight Loss (-450 kcal)</option>
                    <option value="maintain">Weight Maintenance</option>
                    <option value="gain">Muscle Gain (+400 kcal)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 rounded-2xl bg-[#173B2D] hover:bg-[#102F24] text-white font-semibold py-5 cursor-pointer btn-hover shadow-xs"
                >
                  Calculate Daily Target
                </Button>
              </form>
            </Card>

            {/* Calculator Results Display Card */}
            <Card className="nature-card stat-card-calories p-6 bg-[#F3F8F1] border border-[#DEECDA] rounded-3xl shadow-xs min-h-[360px] flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#172C23] font-serif pb-4 border-b border-[#DEECDA]">
                  Caloric Blueprint
                </h3>

                {calcResults ? (
                  <div className="py-6 space-y-5">
                    <div className="text-center">
                      <span className="text-5xl font-extrabold text-[#172C23] tracking-tight">
                        {calcResults.target}
                      </span>
                      <span className="text-sm font-semibold text-[#63736A] ml-1.5">kcal / day</span>
                      <p className="text-xs text-[#4E7855] font-semibold mt-1">
                        Recommended Daily Caloric Target
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-white/80 border border-[#DEECDA] text-center">
                        <p className="text-[10px] font-bold text-[#63736A] uppercase tracking-wider">Basal Rate (BMR)</p>
                        <p className="text-lg font-extrabold text-[#172C23] mt-0.5">{calcResults.bmr} kcal</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white/80 border border-[#DEECDA] text-center">
                        <p className="text-[10px] font-bold text-[#63736A] uppercase tracking-wider">Total Burn (TDEE)</p>
                        <p className="text-lg font-extrabold text-[#172C23] mt-0.5">{calcResults.tdee} kcal</p>
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveTarget}
                      className="w-full rounded-2xl bg-[#7EAA82] hover:bg-[#68946C] text-white font-semibold py-5 shadow-xs cursor-pointer btn-hover"
                    >
                      Save as Daily Target
                    </Button>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-2">
                    <div className="text-4xl">🔥</div>
                    <p className="text-sm font-semibold text-[#172C23]">Ready to calculate</p>
                    <p className="text-xs text-[#63736A] max-w-xs mx-auto">
                      Fill out your metrics on the left to compute your Mifflin-St Jeor caloric target.
                    </p>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-[#63736A] italic pt-4 border-t border-[#DEECDA] leading-tight">
                Calculations use the clinically validated Mifflin-St Jeor metabolic expenditure equation.
              </p>
            </Card>

          </div>
        )}

      </div>

      {/* ── MODAL: ADD MEAL ── */}
      <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-[#E5E7DE] bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[#172C23] flex items-center gap-2 font-serif text-lg">
              <UtensilsCrossed className="h-5 w-5 text-[#38664F]" />
              <span>{t("addMeal")}</span>
            </DialogTitle>
            <DialogDescription className="text-[#63736A] text-xs">
              Record nutritional data to update your daily intake.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMealSubmit} className="space-y-3.5 py-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">{t("foodName")}</label>
              <Input
                placeholder="e.g. Masala Dosa with Sambar"
                value={mealForm.name}
                onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                required
                className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">{t("estimatedCalories")}</label>
                <Input
                  type="number"
                  placeholder="e.g. 350"
                  value={mealForm.calories}
                  onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
                  required
                  className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">Portion Size</label>
                <Input
                  placeholder="e.g. 1 bowl"
                  value={mealForm.quantity}
                  onChange={(e) => setMealForm({ ...mealForm, quantity: e.target.value })}
                  className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A]">Protein (g)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="12"
                  value={mealForm.protein}
                  onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
                  className="mt-1 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A]">Carbs (g)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="45"
                  value={mealForm.carbs}
                  onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
                  className="mt-1 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A]">Fat (g)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="8"
                  value={mealForm.fat}
                  onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })}
                  className="mt-1 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddMealOpen(false)}
                className="rounded-xl border-[#E5E7DE] text-[#63736A] hover:bg-[#F5F0E5]"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="rounded-xl text-white font-semibold bg-[#173B2D] hover:bg-[#102F24]"
              >
                {t("saveMeal")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}