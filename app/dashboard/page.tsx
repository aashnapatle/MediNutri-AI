"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
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
  Minus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  UtensilsCrossed,
  Weight,
  Sparkles,
  Droplets,
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts"
import { useLanguage } from "@/context/LanguageContext"
import { useHealth } from "@/context/HealthContext"

/* ── Custom Recharts Tooltip matching master style ── */
const HydrationTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E5E7DE] rounded-2xl px-3.5 py-2 shadow-lg text-xs">
        <p className="font-bold text-[#172C23]">{payload[0].value} glasses</p>
        <p className="text-[#63736A] mt-0.5">{label}</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const { profile, bmi, calories, water, updateWater, addMeal, logWeight } = useHealth()
  const router = useRouter()

  const [isMealModalOpen, setIsMealModalOpen] = useState(false)
  const [mealForm, setMealForm] = useState({ name: "", calories: "", type: "lunch" as const })
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false)
  const [weightInput, setWeightInput] = useState(profile.weight || "")
  const [feedbackToast, setFeedbackToast] = useState("")

  /* ── Greeting Calculation ── */
  const hour = new Date().getHours()
  let greetingKey: "greetingMorning" | "greetingAfternoon" | "greetingEvening" = "greetingMorning"
  let timeEmoji = "☀️"
  if (hour >= 12 && hour < 17) {
    greetingKey = "greetingAfternoon"
    timeEmoji = "🌤️"
  } else if (hour >= 17) {
    greetingKey = "greetingEvening"
    timeEmoji = "🌙"
  }

  const firstName = profile.name ? profile.name.split(" ")[0] : "aashu"

  /* ── Water advice helper ── */
  const getWaterAdvice = (g: number) => {
    if (g === 0) return { text: "Start your day with a refreshing glass of water 💧", color: "text-[#2E8BC0]" }
    if (g < 4)  return { text: "Keep hydrating! Aim for at least 8 glasses today.", color: "text-[#2E8BC0]" }
    if (g < 8)  return { text: "Great progress! Almost at your daily goal.", color: "text-[#34739A]" }
    if (g === 8) return { text: "Goal reached! Perfect daily hydration ✨", color: "text-[#2E6B40] font-semibold" }
    return { text: "Excellent! Well hydrated for your metabolism.", color: "text-[#2E6B40]" }
  }
  const waterAdvice = getWaterAdvice(water.today)

  /* ── Quick Meal Handler ── */
  const handleQuickMeal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mealForm.name || !mealForm.calories) return
    await addMeal({ name: mealForm.name, calories: parseInt(mealForm.calories) || 0, type: mealForm.type })
    setMealForm({ name: "", calories: "", type: "lunch" })
    setIsMealModalOpen(false)
    setFeedbackToast("Meal logged successfully!")
    setTimeout(() => setFeedbackToast(""), 3000)
  }

  /* ── Quick Weight Handler ── */
  const handleQuickWeight = async (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(weightInput)
    if (!w || w <= 0) return
    await logWeight(w)
    setIsWeightModalOpen(false)
    setFeedbackToast("Weight recorded successfully!")
    setTimeout(() => setFeedbackToast(""), 3000)
  }

  /* ── Hydration 7-day Chart Data ── */
  const defaultDates = ["Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8", "Oct 9"]
  const defaultGlasses = [8, 6, 5, 6, 6, 8, water.today || 7]
  const chartData = water.history.length >= 5
    ? water.history.slice(-7).map((w, idx) => ({ day: w.day || defaultDates[idx] || w.date.slice(5), glasses: w.glasses }))
    : defaultDates.map((day, idx) => ({
        day,
        glasses: idx === defaultDates.length - 1 ? (water.today || 7) : defaultGlasses[idx]
      }))

  /* ── Calculations ── */
  const bmiVal = bmi.value || 19.8
  const bmiCategory = bmi.category || "Normal"
  const bmiCategoryLabel = bmiCategory === "Normal" ? "Normal Range" : bmiCategory

  // Indicator dot percentage between 15 and 35
  const bmiDotPercent = Math.min(94, Math.max(6, ((bmiVal - 15) / (35 - 15)) * 100))

  const caloriesConsumed = calories.consumed || 130
  const caloriesTarget = calories.target || 2931
  const caloriesRemaining = Math.max(0, caloriesTarget - caloriesConsumed)
  const caloriesPercent = Math.min(100, Math.round((caloriesConsumed / caloriesTarget) * 100))

  const waterGlasses = water.today || 7
  const waterTarget = water.target || 8
  const waterRemaining = Math.max(0, waterTarget - waterGlasses)
  const waterPercent = Math.min(100, Math.round((waterGlasses / waterTarget) * 100))

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ── FEEDBACK TOAST ── */}
        {feedbackToast && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#E5F0DF] text-[#173B2D] border border-[#7EAA82]/30 shadow-xs animate-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4 text-[#7EAA82] shrink-0" />
            <span className="text-xs font-semibold">{feedbackToast}</span>
          </div>
        )}

        {/* ── SECTION 1: WELCOME & HEALTHY FOOD FEATURE CARD ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-6 items-center">

          {/* Left: Heading + Motivation quote pill */}
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-[38px] font-bold text-[#172C23] tracking-tight leading-tight font-serif">
              {t(greetingKey)}, <span className="text-[#38664F]">{firstName}</span> ! {timeEmoji}
            </h1>
            <p className="text-sm text-[#63736A] font-normal leading-relaxed">
              Fuel your body with good food and positive energy. You&apos;re doing great!
            </p>

            {/* Motivational Quote Pill Panel */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 border border-[#E5E7DE] shadow-2xs">
                <span className="text-sm">🌿</span>
                <span className="text-xs text-[#172C23] font-serif italic tracking-wide">
                  &ldquo;Small healthy choices today, a brighter tomorrow.&rdquo;
                </span>
                <ArrowRight className="h-3 w-3 text-[#172C23]" />
              </div>
            </div>
          </div>

          {/* Right: "Healthy Food Happier You" Feature Card */}
          <div className="nature-card p-5 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#172C23] font-serif leading-snug">
                Healthy Food<br />Happier You
              </h2>
              <p className="text-[11px] text-[#63736A] leading-relaxed max-w-[170px]">
                Good nutrition is a foundation for a better tomorrow.
              </p>
              <div className="pt-1 text-[#7EAA82] text-xs">
                <span>🍃〰️</span>
              </div>
            </div>

            {/* Healthy breakfast oatmeal bowl illustration */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#FAF4ED] flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Bowl */}
                  <circle cx="50" cy="50" r="46" fill="#F5EFE6" stroke="#E5DEC9" strokeWidth="2" />
                  <circle cx="50" cy="50" r="40" fill="#E8DEC8" />
                  {/* Oatmeal texture */}
                  <circle cx="50" cy="50" r="36" fill="#DFC8A6" />
                  {/* Banana slices */}
                  <circle cx="36" cy="40" r="8" fill="#FFF275" stroke="#E4D547" strokeWidth="1" />
                  <circle cx="36" cy="40" r="3" fill="#D3C032" opacity="0.4" />
                  <circle cx="54" cy="36" r="8" fill="#FFF275" stroke="#E4D547" strokeWidth="1" />
                  <circle cx="54" cy="36" r="3" fill="#D3C032" opacity="0.4" />
                  <circle cx="44" cy="54" r="8" fill="#FFF275" stroke="#E4D547" strokeWidth="1" />
                  <circle cx="44" cy="54" r="3" fill="#D3C032" opacity="0.4" />
                  {/* Strawberries */}
                  <path d="M64,50 Q74,48 72,62 Q66,70 60,62 Q58,52 64,50 Z" fill="#E63946" />
                  <circle cx="65" cy="56" r="0.8" fill="#FFF" />
                  <circle cx="68" cy="60" r="0.8" fill="#FFF" />
                  <path d="M30,58 Q40,56 38,70 Q32,76 26,68 Q24,60 30,58 Z" fill="#E63946" />
                  {/* Blueberries */}
                  <circle cx="64" cy="38" r="4.5" fill="#3D5A80" />
                  <circle cx="32" cy="32" r="4" fill="#3D5A80" />
                  <circle cx="50" cy="68" r="4.5" fill="#3D5A80" />
                  {/* Chia seeds */}
                  <circle cx="48" cy="45" r="1" fill="#4A4E69" />
                  <circle cx="52" cy="48" r="1" fill="#4A4E69" />
                  <circle cx="40" cy="48" r="1" fill="#4A4E69" />
                  <circle cx="58" cy="54" r="1" fill="#4A4E69" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* ── SECTION 2: THREE PRIMARY METRIC CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* ── CARD 1: YOUR BMI ── */}
          <div className="nature-card stat-card-bmi p-5 rounded-3xl border border-[#F8DFD9] bg-[#FDF5F3] shadow-xs flex flex-col justify-between h-[215px]">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9E5748]">
                    {t("yourBMI")}
                  </span>
                  <div className="mt-1 flex items-baseline gap-2.5">
                    <span className="text-[34px] font-extrabold text-[#172C23] leading-none">
                      {bmiVal}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5F0DF] text-[#2E6B40]">
                      {bmiCategoryLabel}
                    </span>
                  </div>
                </div>

                {/* Weighing scale with leaves SVG illustration */}
                <div className="relative h-12 w-12 flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="h-10 w-10">
                    <rect x="8" y="10" width="32" height="30" rx="8" fill="#FAD4CD" stroke="#E5A69B" strokeWidth="1.5" />
                    <circle cx="24" cy="22" r="7" fill="#FFFFFF" />
                    <circle cx="24" cy="22" r="5" fill="#FDF5F3" stroke="#C88578" strokeWidth="1" />
                    <line x1="24" y1="22" x2="26" y2="19" stroke="#9E5748" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M6,16 Q10,12 12,18 Q8,20 6,16 Z" fill="#7EAA82" />
                    <path d="M4,22 Q8,18 10,24 Q6,26 4,22 Z" fill="#A1C4A5" />
                  </svg>
                </div>
              </div>

              {/* Color-coded BMI indicator bar with moving dot marker */}
              <div className="mt-3.5 space-y-1.5 relative">
                <div className="h-2 w-full rounded-full overflow-hidden flex">
                  <div className="flex-1 bg-[#6BA4D9]" title="Underweight < 18.5" />
                  <div className="flex-1 bg-[#7EAA82]" title="Normal 18.5 - 24.9" />
                  <div className="flex-1 bg-[#F5B971]" title="Overweight 25 - 29.9" />
                  <div className="flex-1 bg-[#FF777F]" title="Obese ≥ 30" />
                </div>
                {/* Moving dot indicator */}
                <div className="relative h-1 w-full -mt-2 pointer-events-none">
                  <div
                    className="absolute -top-1.5 h-3.5 w-3.5 rounded-full bg-[#172C23] border-2 border-white shadow-xs transition-all duration-500"
                    style={{ left: `${bmiDotPercent}%`, transform: 'translateX(-50%)' }}
                  />
                </div>
                {/* Labels below bar */}
                <div className="flex justify-between text-[9px] text-[#63736A] px-0.5 font-medium pt-1">
                  <span>&lt; 18.5</span>
                  <span>18.5 - 24.9</span>
                  <span>25 - 29.9</span>
                  <span>≥ 30</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-2 border-t border-[#F4D2CA] flex items-center justify-between text-[11px]">
              <span className="text-[#63736A]">Screening indicator</span>
              <Link
                href="/bmi"
                className="font-bold text-[#172C23] hover:text-[#7EAA82] inline-flex items-center gap-1 transition-colors"
              >
                <span>View Analysis</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* ── CARD 2: DAILY CALORIES ── */}
          <div className="nature-card stat-card-calories p-5 rounded-3xl border border-[#DEECDA] bg-[#F3F8F1] shadow-xs flex flex-col justify-between h-[215px]">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4E7855]">
                    {t("dailyCalories")}
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-[34px] font-extrabold text-[#172C23] leading-none">
                      {caloriesConsumed}
                    </span>
                    <span className="text-xs font-semibold text-[#63736A]">
                      / {caloriesTarget} kcal
                    </span>
                  </div>
                  <p className="text-[11px] text-[#63736A] mt-1 font-medium">
                    {caloriesRemaining} kcal remaining
                  </p>
                </div>

                {/* Avocado SVG illustration */}
                <div className="relative h-12 w-12 flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="h-11 w-11">
                    <path
                      d="M24,4 C34,4 40,16 40,30 C40,40 32,46 24,46 C16,46 8,40 8,30 C8,16 14,4 24,4 Z"
                      fill="#86B26A"
                    />
                    <path
                      d="M24,7 C32,7 37,18 37,30 C37,38 31,43 24,43 C17,43 11,38 11,30 C11,18 16,7 24,7 Z"
                      fill="#D3E5B5"
                    />
                    <ellipse cx="24" cy="31" rx="7" ry="8.5" fill="#784A28" />
                    <ellipse cx="22.5" cy="29.5" rx="2" ry="3" fill="#9C663D" opacity="0.6" />
                  </svg>
                </div>
              </div>

              {/* Horizontal Progress Bar */}
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-[#DEECDA] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#7EAA82] transition-all duration-500"
                    style={{ width: `${caloriesPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-2 border-t border-[#D5E6D0] flex items-center justify-between text-[11px]">
              <span className="text-[#63736A]">{caloriesPercent}% of goal</span>
              <Link
                href="/calories"
                className="font-bold text-[#172C23] hover:text-[#7EAA82] inline-flex items-center gap-1 transition-colors"
              >
                <span>Track Meals</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* ── CARD 3: WATER INTAKE ── */}
          <div className="nature-card stat-card-water p-5 rounded-3xl border border-[#D8EBF7] bg-[#F0F7FC] shadow-xs flex flex-col justify-between h-[215px]">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#34739A]">
                      {t("waterIntake")}
                    </span>
                    <Droplets className="h-3 w-3 text-[#2E8BC0]" />
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-[34px] font-extrabold text-[#172C23] leading-none">
                      {waterGlasses}
                    </span>
                    <span className="text-xs font-semibold text-[#63736A]">
                      / {waterTarget} glasses
                    </span>
                  </div>
                  <p className="text-[11px] text-[#63736A] mt-1 font-medium truncate">
                    {waterAdvice.text}
                  </p>
                </div>

                {/* Glass of water with lemon and ice SVG illustration */}
                <div className="relative h-12 w-12 flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="h-11 w-11">
                    <path d="M12,10 L15,42 C15,44 18,45 24,45 C30,45 33,44 33,42 L36,10 Z" fill="#E8F4FC" stroke="#97C8EA" strokeWidth="1.2" />
                    <path d="M14,18 L15.5,40 C15.5,42 19,43 24,43 C29,43 32.5,42 32.5,40 L34,18 Z" fill="#BFE3F8" />
                    <rect x="18" y="22" width="6" height="6" rx="1.5" fill="#FFFFFF" opacity="0.8" />
                    <rect x="23" y="27" width="5" height="5" rx="1.5" fill="#FFFFFF" opacity="0.8" />
                    <circle cx="32" cy="18" r="5" fill="#FEEA76" stroke="#E3C83A" strokeWidth="1" />
                    <circle cx="32" cy="18" r="3.5" fill="#FFF8C4" />
                  </svg>
                </div>
              </div>

              {/* Blue horizontal progress bar */}
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-[#D8EBF7] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2E8BC0] transition-all duration-500"
                    style={{ width: `${waterPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card Footer with +/- buttons */}
            <div className="pt-2 border-t border-[#CFE5F3] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateWater(-1)}
                  disabled={water.today <= 0}
                  className="h-6 w-6 rounded-full border border-[#B9DCF0] bg-white text-[#2E8BC0] flex items-center justify-center hover:bg-[#E8F4FC] disabled:opacity-40 transition-colors cursor-pointer"
                  aria-label="Decrease water glass"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-[#63736A] font-medium">
                  {waterRemaining > 0 ? `+${waterRemaining} glasses to go` : "Goal achieved!"}
                </span>
                <button
                  onClick={() => updateWater(1)}
                  className="h-6 w-6 rounded-full bg-[#2E8BC0] text-white flex items-center justify-center hover:bg-[#25739F] shadow-2xs transition-colors cursor-pointer"
                  aria-label="Add water glass"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <Link
                href="/calories"
                className="text-[#2E8BC0] hover:text-[#173B2D] transition-colors"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* ── SECTION 3: QUICK ACTIONS ── */}
        <div className="nature-card p-3.5 sm:px-6 sm:py-3.5 rounded-2xl bg-white/95 border border-[#E5E7DE] shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#172C23] flex items-center gap-1.5">
              <span>{t("quickActions")}</span>
              <span className="text-[#FF777F]">✨</span>
            </span>
            <p className="text-[11px] text-[#63736A] mt-0.5">
              Log, track and stay consistent
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Log Meal Pill */}
            <button
              onClick={() => setIsMealModalOpen(true)}
              className="pill-action-btn hover:border-[#7EAA82] cursor-pointer"
            >
              <UtensilsCrossed className="h-3.5 w-3.5 text-[#38664F]" />
              <span>{t("logMeal")}</span>
            </button>

            {/* +1 Glass Water Pill */}
            <button
              onClick={() => updateWater(1)}
              className="pill-action-btn hover:border-[#2E8BC0] cursor-pointer"
            >
              <Droplets className="h-3.5 w-3.5 text-[#2E8BC0]" />
              <span>+1 Glass Water</span>
            </button>

            {/* Log Weight Pill */}
            <button
              onClick={() => setIsWeightModalOpen(true)}
              className="pill-action-btn hover:border-[#7EAA82] cursor-pointer"
            >
              <Weight className="h-3.5 w-3.5 text-[#38664F]" />
              <span>{t("logWeight")}</span>
            </button>

            {/* Ask AI Pill */}
            <button
              onClick={() => router.push("/chat")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0ED] text-[#FF5E6C] border border-[#FFD8D2] text-[13px] font-semibold hover:bg-[#FFE5E0] transition-colors shadow-2xs cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF777F]" />
              <span>{t("askAI")}</span>
            </button>
          </div>
        </div>

        {/* ── SECTION 4: HYDRATION HISTORY & INSIGHT PANELS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">

          {/* ── LEFT: HYDRATION HISTORY CHART ── */}
          <div className="nature-card p-6 rounded-3xl bg-white/95 border border-[#E5E7DE] shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#E8F4FC] text-[#2E8BC0] flex items-center justify-center shrink-0">
                  <Droplets className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172C23]">
                    Hydration History
                  </h3>
                  <p className="text-xs text-[#63736A] mt-0.5">
                    Daily water consumption (glasses)
                  </p>
                </div>
              </div>

              {/* Date dropdown button */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F2F8FD] border border-[#DCEBF6] text-xs font-semibold text-[#34739A]">
                <span>Last 7 Days</span>
                <ChevronRight className="h-3 w-3 rotate-90" />
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hydrationGreenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7EAA82" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#7EAA82" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7DE" opacity={0.7} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#63736A", fontSize: 11 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#63736A", fontSize: 11 }}
                    domain={[0, 12]}
                    ticks={[0, 3, 6, 9, 12]}
                  />
                  <Tooltip content={<HydrationTooltip />} />
                  <ReferenceLine
                    y={8}
                    stroke="#7EAA82"
                    strokeDasharray="4 3"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="glasses"
                    stroke="#173B2D"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#hydrationGreenGrad)"
                    dot={{ fill: "#173B2D", strokeWidth: 0, r: 4 }}
                    activeDot={{ fill: "#7EAA82", r: 6, strokeWidth: 2, stroke: "#FFFFFF" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── RIGHT: TWO COMPACT INSIGHT PANELS ── */}
          <div className="space-y-4">

            {/* 1. Today's Insight */}
            <div className="nature-card p-4 rounded-2xl bg-white/95 border border-[#E5E7DE] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-sm">💡</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#172C23]">
                    Today&apos;s Insight
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#63736A]" />
              </div>

              <div className="flex items-start gap-3">
                {/* Salad thumbnail */}
                <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0 bg-[#E5F0DF] flex items-center justify-center text-2xl shadow-2xs border border-[#DEECDA]">
                  🥗
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#172C23]">
                    You&apos;re doing great!
                  </h4>
                  <p className="text-[11px] text-[#63736A] leading-relaxed">
                    You&apos;ve logged {caloriesConsumed} kcal today. Try prioritizing fiber-rich vegetables and lean protein for your next meal.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Quick Tip */}
            <div className="nature-card p-4 rounded-2xl bg-[#F3F8F1] border border-[#DEECDA] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#38664F] text-sm">🌿</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#173B2D]">
                    Quick Tip
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#4E7855]" />
              </div>

              <div className="flex items-start justify-between gap-3">
                <p className="text-[11.5px] text-[#172C23] leading-relaxed font-normal">
                  Drink a glass of water before meals to improve digestion and help with portion control.
                </p>
                {/* Water glass thumbnail */}
                <div className="h-12 w-12 rounded-2xl overflow-hidden shrink-0 bg-[#E8F4FC] flex items-center justify-center text-xl shadow-2xs border border-[#DCEBF6]">
                  🍋🥤
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ── MODAL: QUICK LOG MEAL ── */}
      <Dialog open={isMealModalOpen} onOpenChange={setIsMealModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-[#E5E7DE] bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[#172C23] flex items-center gap-2 font-serif text-lg">
              <UtensilsCrossed className="h-5 w-5 text-[#38664F]" />
              <span>{t("logMeal")}</span>
            </DialogTitle>
            <DialogDescription className="text-[#63736A] text-xs">
              Quickly record a meal to update today&apos;s caloric intake.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleQuickMeal} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                {t("foodName")}
              </label>
              <Input
                placeholder="e.g. Avocado Toast with Poached Egg"
                value={mealForm.name}
                onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                required
                className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm focus:border-[#7EAA82]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                  {t("estimatedCalories")}
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 350"
                  value={mealForm.calories}
                  onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
                  required
                  className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm focus:border-[#7EAA82]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                  {t("mealType")}
                </label>
                <select
                  value={mealForm.type}
                  onChange={(e: any) => setMealForm({ ...mealForm, type: e.target.value })}
                  className="mt-1.5 w-full h-9 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] px-3 text-xs text-[#172C23] focus:outline-none focus:border-[#7EAA82]"
                >
                  <option value="breakfast">{t("breakfast")}</option>
                  <option value="lunch">{t("lunch")}</option>
                  <option value="dinner">{t("dinner")}</option>
                  <option value="snack">{t("snack")}</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMealModalOpen(false)}
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

      {/* ── MODAL: QUICK LOG WEIGHT ── */}
      <Dialog open={isWeightModalOpen} onOpenChange={setIsWeightModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-[#E5E7DE] bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[#172C23] flex items-center gap-2 font-serif text-lg">
              <Weight className="h-5 w-5 text-[#38664F]" />
              <span>{t("logWeight")}</span>
            </DialogTitle>
            <DialogDescription className="text-[#63736A] text-xs">
              Record your current weight to monitor your progress over time.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleQuickWeight} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                Weight (kg)
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g. 58.5"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                required
                className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm focus:border-[#7EAA82]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWeightModalOpen(false)}
                className="rounded-xl border-[#E5E7DE] text-[#63736A] hover:bg-[#F5F0E5]"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="rounded-xl text-white font-semibold bg-[#173B2D] hover:bg-[#102F24]"
              >
                Save Weight
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}