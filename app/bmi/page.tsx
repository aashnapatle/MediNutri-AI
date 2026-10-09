"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Scale, Heart, Sparkles, CheckCircle2, Info, ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { useHealth } from "@/context/HealthContext"

export default function BMIPage() {
  const { t } = useLanguage()
  const { profile, bmi, calculateAndSaveBMI, updateProfile } = useHealth()
  const router = useRouter()

  const [height, setHeight] = useState(profile.height || "")
  const [weight, setWeight] = useState(profile.weight || "")
  const [currentResult, setCurrentResult] = useState<{ bmi: number; category: string } | null>(
    bmi.value ? { bmi: bmi.value, category: bmi.category } : null
  )
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    if (profile.height && !height) setHeight(profile.height)
    if (profile.weight && !weight) setWeight(profile.weight)
    if (bmi.value && !currentResult) {
      setCurrentResult({ bmi: bmi.value, category: bmi.category })
    }
  }, [profile, bmi])

  const bmiRanges = [
    { range: "< 18.5", category: t("underweight"), color: "bg-[#6BA4D9]", key: "underweight", badge: "bg-[#E8F4FC] text-[#2E8BC0]" },
    { range: "18.5 - 24.9", category: t("normal"), color: "bg-[#7EAA82]", key: "normal", badge: "bg-[#E5F0DF] text-[#2E6B40]" },
    { range: "25 - 29.9", category: t("overweight"), color: "bg-[#F5B971]", key: "overweight", badge: "bg-[#FFF4E5] text-[#D97706]" },
    { range: "≥ 30", category: t("obese"), color: "bg-[#FF777F]", key: "obese", badge: "bg-[#FCE8E5] text-[#E05A5A]" },
  ]

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const h = parseFloat(height)
    const w = parseFloat(weight)
    if (!h || !w || h <= 0 || w <= 0) return

    const res = calculateAndSaveBMI(h, w)
    setCurrentResult(res)
    updateProfile({ height: h.toString(), weight: w.toString() })

    setToastMessage("BMI calculated and synced with your Dashboard & Profile!")
    setTimeout(() => setToastMessage(""), 3500)
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Underweight":
        return "bg-[#E8F4FC] text-[#2E8BC0]"
      case "Normal":
        return "bg-[#E5F0DF] text-[#2E6B40]"
      case "Overweight":
        return "bg-[#FFF4E5] text-[#D97706]"
      case "Obese":
        return "bg-[#FCE8E5] text-[#E05A5A]"
      default:
        return "bg-[#F5F0E5] text-[#63736A]"
    }
  }

  const getCategoryAdvice = (cat: string) => {
    switch (cat) {
      case "Underweight":
        return t("underweightSuggestion")
      case "Normal":
        return t("normalSuggestion")
      case "Overweight":
        return t("overweightSuggestion")
      case "Obese":
        return t("obeseSuggestion")
      default:
        return t("maintainBalanced")
    }
  }

  const getIndicatorPosition = (val: number) => {
    const min = 15
    const max = 35
    const clamped = Math.min(max, Math.max(min, val))
    return ((clamped - min) / (max - min)) * 100
  }

  return (
    <DashboardLayout title={t("bmiTitle")} subtitle={t("bmiSubtitle")}>
      <div className="space-y-6">

        {/* ── FEEDBACK TOAST ── */}
        {toastMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#E5F0DF] text-[#173B2D] border border-[#7EAA82]/30 shadow-xs animate-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4 text-[#7EAA82] shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* ── TWO-COLUMN HERO/INPUT & RESULT SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── CARD 1: INPUT DETAILS ── */}
          <Card className="nature-card p-6 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#173B2D]">
                <Scale className="h-5 w-5 text-[#38664F]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#172C23] font-serif">
                  {t("enterYourDetails")}
                </h3>
                <p className="text-xs text-[#63736A]">
                  Height and weight for BMI calculation
                </p>
              </div>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                  {t("height")}
                </label>
                <div className="relative mt-1.5">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 165"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    className="pr-12 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm focus:border-[#7EAA82]"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-[#63736A]">
                    cm
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                  {t("weight")}
                </label>
                <div className="relative mt-1.5">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 60"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    className="pr-12 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm focus:border-[#7EAA82]"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-[#63736A]">
                    kg
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-2 rounded-2xl bg-[#173B2D] hover:bg-[#102F24] text-white font-semibold py-5 shadow-xs cursor-pointer btn-hover"
              >
                <span>{t("calculateBMI")}</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>

            <p className="text-[11px] text-[#63736A] mt-4 flex items-center gap-1.5 leading-relaxed">
              <Info className="h-3.5 w-3.5 text-[#7EAA82] shrink-0" />
              <span>{t("metricNotice")}</span>
            </p>
          </Card>

          {/* ── CARD 2: BMI RESULT DISPLAY ── */}
          <Card className="nature-card stat-card-bmi p-6 bg-[#FDF5F3] border border-[#F8DFD9] rounded-3xl shadow-xs flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F4D2CA]">
                <h3 className="text-base sm:text-lg font-bold text-[#172C23] font-serif">
                  {t("yourBMIResult")}
                </h3>
                {currentResult && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryColor(currentResult.category)}`}>
                    {currentResult.category}
                  </span>
                )}
              </div>

              {currentResult ? (
                <div className="py-6 space-y-6">
                  {/* Big Number */}
                  <div className="text-center">
                    <span className="text-5xl sm:text-6xl font-extrabold text-[#172C23] tracking-tight">
                      {currentResult.bmi}
                    </span>
                    <p className="text-xs text-[#63736A] mt-1 font-medium">
                      Body Mass Index Score
                    </p>
                  </div>

                  {/* Horizontal Gauge Bar */}
                  <div className="space-y-2">
                    <div className="relative h-3 w-full rounded-full overflow-hidden flex shadow-2xs">
                      <div className="flex-1 bg-[#6BA4D9]" />
                      <div className="flex-1 bg-[#7EAA82]" />
                      <div className="flex-1 bg-[#F5B971]" />
                      <div className="flex-1 bg-[#FF777F]" />
                    </div>

                    <div className="relative h-2 w-full">
                      <div
                        className="absolute -top-1 -ml-1.5 h-4 w-3 rounded-full bg-[#172C23] border-2 border-white shadow-sm transition-all duration-700"
                        style={{ left: `${getIndicatorPosition(currentResult.bmi)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-[#63736A] px-1 font-semibold">
                      <span>&lt; 18.5</span>
                      <span>18.5 - 24.9</span>
                      <span>25 - 29.9</span>
                      <span>≥ 30</span>
                    </div>
                  </div>

                  {/* Category Wellness Suggestion */}
                  <div className="p-4 rounded-2xl bg-white/80 border border-[#F8DFD9] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#172C23]">
                      <Sparkles className="h-3.5 w-3.5 text-[#FF777F]" />
                      <span>{t("aiSuggestion")}</span>
                    </div>
                    <p className="text-xs text-[#63736A] leading-relaxed">
                      {getCategoryAdvice(currentResult.category)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-2">
                  <div className="text-4xl">⚖️</div>
                  <p className="text-sm font-semibold text-[#172C23]">{t("enterDetailsToView")}</p>
                  <p className="text-xs text-[#63736A] max-w-xs mx-auto">
                    Enter your height and weight above to compute your body mass index screening indicator.
                  </p>
                </div>
              )}
            </div>

            <p className="text-[10px] text-[#63736A] italic pt-4 border-t border-[#F4D2CA] leading-tight">
              {t("bmiDisclaimer")}
            </p>
          </Card>

        </div>

        {/* ── CARD 3: REFERENCE CATEGORIES GRID ── */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#63736A] uppercase tracking-wider">
            {t("bmiCategories")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {bmiRanges.map((range) => {
              const isCurrent = currentResult && currentResult.category.toLowerCase() === range.key.toLowerCase()
              return (
                <Card
                  key={range.range}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? "border-[#7EAA82] bg-white ring-2 ring-[#7EAA82]/30 shadow-sm"
                      : "border-[#E5E7DE] bg-white/90"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${range.color}`} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${range.badge}`}>
                      {range.range}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#172C23]">{range.category}</h4>
                  <p className="text-[11px] text-[#63736A] mt-1 line-clamp-2 leading-relaxed">
                    {t(`${range.key}Suggestion` as any)}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}