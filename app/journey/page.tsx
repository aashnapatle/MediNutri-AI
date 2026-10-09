"use client"

import { useState } from "react"
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
  TrendingUp,
  Scale,
  Flame,
  Droplets,
  Plus,
  CheckCircle2,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { useLanguage } from "@/context/LanguageContext"
import { useHealth } from "@/context/HealthContext"

export default function JourneyPage() {
  const { t } = useLanguage()
  const { profile, bmi, calories, water, weightHistory, logWeight } = useHealth()

  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false)
  const [weightInput, setWeightInput] = useState(profile.weight || "")
  const [toastMessage, setToastMessage] = useState("")

  const handleLogWeightSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(weightInput)
    if (!w || w <= 0) return
    await logWeight(w)
    setIsLogWeightOpen(false)
    setToastMessage("Weight entry logged successfully! 🌿")
    setTimeout(() => setToastMessage(""), 3500)
  }

  // Weight entries (up to last 15 entries)
  const rollingWeights = weightHistory.slice(-15)
  const currentWeightNum = parseFloat(profile.weight) || (rollingWeights.length > 0 ? rollingWeights[rollingWeights.length - 1].weight : 0)
  const startWeightNum = rollingWeights.length > 0 ? rollingWeights[0].weight : currentWeightNum
  const goalWeightNum = parseFloat(profile.goalWeight) || currentWeightNum
  const weightChange = (currentWeightNum - startWeightNum).toFixed(1)

  // Goal Progress percentage
  let progressPct = 0
  if (profile.goal === "lose" && startWeightNum > goalWeightNum) {
    progressPct = Math.min(100, Math.max(0, Math.round(((startWeightNum - currentWeightNum) / (startWeightNum - goalWeightNum)) * 100)))
  } else if (profile.goal === "gain" && goalWeightNum > startWeightNum) {
    progressPct = Math.min(100, Math.max(0, Math.round(((currentWeightNum - startWeightNum) / (goalWeightNum - startWeightNum)) * 100)))
  } else {
    progressPct = 100
  }

  // Real Calorie history (grouped from real logged meals)
  const calorieDaysMap: Record<string, number> = {}
  calories.meals.forEach((m) => {
    calorieDaysMap[m.date] = (calorieDaysMap[m.date] || 0) + m.calories
  })
  const calorieTrendData = Object.keys(calorieDaysMap).slice(-15).map((d) => ({
    date: d.slice(5),
    consumed: calorieDaysMap[d],
    target: calories.target || 2000,
  }))

  // Real Water trend
  const waterTrendData = water.history.slice(-15).map((w) => ({
    date: w.day || w.date.slice(5),
    glasses: w.glasses,
    target: 8,
  }))

  const avgWater = waterTrendData.length > 0
    ? (waterTrendData.reduce((acc, curr) => acc + curr.glasses, 0) / waterTrendData.length).toFixed(1)
    : water.today.toString()

  const avgCalories = calorieTrendData.length > 0
    ? Math.round(calorieTrendData.reduce((acc, curr) => acc + curr.consumed, 0) / calorieTrendData.length)
    : calories.consumed

  return (
    <DashboardLayout title={t("journeyTitle")} subtitle={t("journeySubtitle")}>
      <div className="space-y-6">

        {/* ── FEEDBACK TOAST ── */}
        {toastMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#E5F0DF] text-[#173B2D] border border-[#7EAA82]/30 shadow-xs animate-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4 text-[#7EAA82] shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* ── HERO BANNER ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/95 border border-[#E5E7DE] shadow-xs">
          <div>
            <h2 className="text-2xl font-bold text-[#172C23] font-serif flex items-center gap-2.5">
              <span>📈</span> {t("journeyTitle")}
            </h2>
            <p className="text-xs text-[#63736A] mt-1 font-normal">
              {t("journeySubtitle")}
            </p>
          </div>
          <Button
            onClick={() => setIsLogWeightOpen(true)}
            className="rounded-2xl bg-[#173B2D] hover:bg-[#102F24] text-white font-semibold cursor-pointer btn-hover shadow-xs px-5 py-2.5 text-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>{t("logNewWeight")}</span>
          </Button>
        </div>

        {/* ── SUMMARY STATS (4 CARDS) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="nature-card p-5 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#63736A]">
              {t("currentWeight")}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#172C23]">{currentWeightNum || "--"}</span>
              <span className="text-xs font-semibold text-[#63736A]">kg</span>
            </div>
            <p className="text-[11px] text-[#63736A] mt-2 flex items-center gap-1 font-medium">
              {parseFloat(weightChange) < 0 ? (
                <span className="text-[#2E6B40] flex items-center">
                  <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" /> {Math.abs(parseFloat(weightChange))} kg
                </span>
              ) : parseFloat(weightChange) > 0 ? (
                <span className="text-[#D97706] flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +{weightChange} kg
                </span>
              ) : (
                "0 kg change"
              )}
              <span className="opacity-70 ml-1">from start</span>
            </p>
          </Card>

          <Card className="nature-card p-5 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#63736A]">
              {t("goalWeight")}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#172C23]">{goalWeightNum || "--"}</span>
              <span className="text-xs font-semibold text-[#63736A]">kg</span>
            </div>
            <p className="text-[11px] text-[#63736A] mt-2 font-medium">
              Goal: {profile.goal === "lose" ? "Weight Loss" : profile.goal === "gain" ? "Weight Gain" : "Maintenance"}
            </p>
          </Card>

          <Card className="nature-card p-5 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#63736A]">
              {t("avgCalories")}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#172C23]">{avgCalories || "--"}</span>
              <span className="text-xs font-semibold text-[#63736A]">kcal</span>
            </div>
            <p className="text-[11px] text-[#63736A] mt-2 font-medium">
              Target: {calories.target || "2,000"} kcal
            </p>
          </Card>

          <Card className="nature-card p-5 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#63736A]">
              {t("avgWater")}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#172C23]">{avgWater}</span>
              <span className="text-xs font-semibold text-[#63736A]">glasses</span>
            </div>
            <p className="text-[11px] text-[#63736A] mt-2 font-medium">
              Target: 8 glasses daily
            </p>
          </Card>
        </div>

        {/* ── GOAL PROGRESS BAR CARD ── */}
        <Card className="nature-card p-6 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Target className="h-5 w-5 text-[#38664F]" />
              <h3 className="text-base font-bold text-[#172C23] font-serif">{t("goalProgress")}</h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E5F0DF] text-[#2E6B40] border border-[#DEECDA]">
              {progressPct}% Achieved
            </span>
          </div>

          <div className="w-full bg-[#FAF8F0] h-3.5 rounded-full overflow-hidden border border-[#E5E7DE]">
            <div
              className="h-full rounded-full transition-all duration-700 bg-[#7EAA82]"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-medium text-[#63736A] mt-3 px-1">
            <span>Starting: {startWeightNum} kg</span>
            <span className="text-[#172C23] font-bold">Current: {currentWeightNum} kg</span>
            <span>Goal: {goalWeightNum} kg</span>
          </div>
        </Card>

        {/* ── TWO CHARTS SIDE-BY-SIDE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Weight Trend Line Chart */}
          <Card className="nature-card p-6 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#172C23] font-serif">{t("weightTrend")} (kg)</h3>
                <p className="text-xs text-[#63736A]">Actual logged weight timeline</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E5F0DF] text-[#2E6B40]">
                Last 15 records
              </span>
            </div>

            {rollingWeights.length === 0 ? (
              <div className="h-[220px] flex flex-col items-center justify-center text-center p-6 bg-[#FAF8F0] rounded-2xl border border-dashed border-[#E5E7DE]">
                <Scale className="h-8 w-8 text-[#63736A]/50 mb-2" />
                <p className="text-xs font-semibold text-[#172C23]">No weight history logged yet.</p>
                <p className="text-[11px] text-[#63736A] mt-1">Click &ldquo;+ Log New Weight&rdquo; above to record your first weigh-in.</p>
              </div>
            ) : (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rollingWeights} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weightGradMaster" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7EAA82" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#7EAA82" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7DE" opacity={0.7} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#63736A", fontSize: 11 }} dy={6} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#63736A", fontSize: 11 }} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip
                      formatter={(val: any) => [`${val} kg`, "Weight"]}
                      contentStyle={{ borderRadius: "16px", border: "1px solid #E5E7DE", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    />
                    <Area type="monotone" dataKey="weight" stroke="#173B2D" strokeWidth={2.5} fillOpacity={1} fill="url(#weightGradMaster)" dot={{ fill: "#173B2D", r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Calories vs Target Bar Chart */}
          <Card className="nature-card p-6 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#172C23] font-serif">{t("caloriesTrend")}</h3>
                <p className="text-xs text-[#63736A]">Calories consumed vs daily target</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E5F0DF] text-[#2E6B40]">
                Calorie Log
              </span>
            </div>

            {calorieTrendData.length === 0 ? (
              <div className="h-[220px] flex flex-col items-center justify-center text-center p-6 bg-[#FAF8F0] rounded-2xl border border-dashed border-[#E5E7DE]">
                <Flame className="h-8 w-8 text-[#63736A]/50 mb-2" />
                <p className="text-xs font-semibold text-[#172C23]">No meal logs recorded in your 15-day history.</p>
                <p className="text-[11px] text-[#63736A] mt-1">Start logging meals in the Calorie tracker to view your progress trend.</p>
              </div>
            ) : (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calorieTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7DE" opacity={0.7} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#63736A", fontSize: 11 }} dy={6} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#63736A", fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any) => [`${val} kcal`, "Calories"]}
                      contentStyle={{ borderRadius: "16px", border: "1px solid #E5E7DE", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    />
                    <Bar dataKey="consumed" fill="#7EAA82" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

        </div>

      </div>

      {/* ── MODAL: LOG WEIGHT ── */}
      <Dialog open={isLogWeightOpen} onOpenChange={setIsLogWeightOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-[#E5E7DE] bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[#172C23] flex items-center gap-2 font-serif text-lg">
              <Scale className="h-5 w-5 text-[#38664F]" />
              <span>{t("logNewWeight")}</span>
            </DialogTitle>
            <DialogDescription className="text-[#63736A] text-xs">
              Record a new weigh-in to plot your progress over time.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogWeightSubmit} className="space-y-4 py-2">
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
                onClick={() => setIsLogWeightOpen(false)}
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