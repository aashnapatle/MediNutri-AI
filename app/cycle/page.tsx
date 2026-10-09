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
  MoonStar,
  Settings,
  CheckCircle2,
  Flower2,
  Heart,
  Droplets,
  Calendar,
  Sparkles,
} from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { useHealth } from "@/context/HealthContext"

export default function CycleTrackerPage() {
  const { t } = useLanguage()
  const { cycle, logPeriodToday, updateCycleSettings } = useHealth()

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [lastDateInput, setLastDateInput] = useState(cycle.lastPeriodDate || "")
  const [cycleLengthInput, setCycleLengthInput] = useState(cycle.cycleLength.toString())
  const [durationInput, setDurationInput] = useState(cycle.periodDuration.toString())
  const [toastMessage, setToastMessage] = useState("")

  const handlePeriodToday = async () => {
    await logPeriodToday()
    setToastMessage("Period logged for today! Cycle day reset to Day 1. 🌸")
    setTimeout(() => setToastMessage(""), 3500)
  }

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateCycleSettings(lastDateInput, parseInt(cycleLengthInput) || 28, parseInt(durationInput) || 5)
    setIsSettingsOpen(false)
    setToastMessage("Cycle settings updated! ✨")
    setTimeout(() => setToastMessage(""), 3000)
  }

  const getPhaseDetails = (phase: string) => {
    switch (phase) {
      case "menstrual":
        return {
          name: t("menstrualPhase"),
          emoji: "🩸",
          badge: "bg-[#FCE8E5] text-[#E05A5A] border-[#F8DFD9]",
          advice: "Prioritize iron-rich foods (spinach, lentils, seeds), gentle hydration, and restorative sleep.",
          nutrition: ["Warm herbal teas & hydration", "Iron & Vitamin C pairing", "Magnesium for muscle comfort"],
        }
      case "follicular":
        return {
          name: t("follicularPhase"),
          emoji: "🌱",
          badge: "bg-[#FFF4E5] text-[#D97706] border-[#FED7AA]",
          advice: "Rising estrogen boosts energy. Great time for vibrant leafy greens, fermented foods, and progressive workouts.",
          nutrition: ["Complex carbs & quinoa", "Sprouted legumes & salads", "Lean protein & avocado"],
        }
      case "ovulation":
        return {
          name: t("ovulationPhase"),
          emoji: "🌸",
          badge: "bg-[#E5F0DF] text-[#2E6B40] border-[#DEECDA]",
          advice: "Peak metabolic and hormonal vitality. Focus on antioxidant-rich berries, colorful veggies, and plenty of water.",
          nutrition: ["Colorful antioxidants (berries)", "Healthy fats (flaxseeds, walnuts)", "Light fiber-rich grains"],
        }
      case "luteal":
        return {
          name: t("lutealPhase"),
          emoji: "🌾",
          badge: "bg-[#EEEAF8] text-[#7C3AED] border-[#DDD6FE]",
          advice: "Progesterone peaks. Satisfy appetite with complex carbs (sweet potatoes, oats), dark chocolate, and adequate magnesium.",
          nutrition: ["Roasted sweet potatoes & brown rice", "Magnesium-rich dark chocolate", "Warm soups & herbal infusions"],
        }
      default:
        return {
          name: "Active Cycle",
          emoji: "✨",
          badge: "bg-[#FAF8F0] text-[#172C23] border-[#E5E7DE]",
          advice: "Maintain balanced nutrition and listen to your body's energy rhythms.",
          nutrition: ["Balanced nutrition", "Daily hydration", "Regular sleep"],
        }
    }
  }

  const phaseInfo = getPhaseDetails(cycle.currentPhase)

  return (
    <DashboardLayout title={t("cycleTitle")} subtitle={t("cycleSubtitle")}>
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
              <span>🌸</span> {t("cycleTitle")}
            </h2>
            <p className="text-xs text-[#63736A] mt-1 font-normal">
              {t("cycleSubtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handlePeriodToday}
              className="rounded-full bg-[#173B2D] hover:bg-[#102F24] text-white font-semibold cursor-pointer btn-hover shadow-xs px-5 py-2.5 text-xs"
            >
              <MoonStar className="h-3.5 w-3.5 mr-1.5" />
              <span>{t("periodStartedToday")}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="h-9 w-9 rounded-full border-[#E5E7DE] bg-white text-[#172C23] hover:bg-[#FAF8F0] shadow-2xs"
              title="Cycle Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── CURRENT PHASE & SCHEDULE CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Current Phase Card */}
          <Card className="nature-card p-6 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#63736A]">
                Current Phase
              </span>
              <div className="mt-3 flex items-center gap-3.5">
                <span className="text-4xl">{phaseInfo.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold text-[#172C23] font-serif">{phaseInfo.name}</h3>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 border ${phaseInfo.badge}`}>
                    Day {cycle.currentDay} of {cycle.cycleLength}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#63736A] mt-4 leading-relaxed font-normal">
                {phaseInfo.advice}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#E5E7DE]">
              <span className="text-[10px] font-bold text-[#63736A] uppercase tracking-wider">
                Cycle: {cycle.cycleLength} days · Period: {cycle.periodDuration} days
              </span>
            </div>
          </Card>

          {/* Predictions 3-Card Column */}
          <Card className="nature-card p-6 lg:col-span-2 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7DE] mb-5">
                <h3 className="text-base font-bold text-[#172C23] font-serif flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#7EAA82]" />
                  <span>Estimated Cycle Predictions</span>
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5F0DF] text-[#2E6B40] uppercase tracking-wider">
                  Rhythms
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F0F7FC] border border-[#D8EBF7] text-center">
                  <Flower2 className="h-5 w-5 text-[#2E8BC0] mx-auto mb-1.5" />
                  <span className="text-[10px] font-bold text-[#34739A] uppercase tracking-wider">{t("estimatedOvulation")}</span>
                  <p className="text-lg font-extrabold text-[#172C23] mt-1">{cycle.ovulationDate || "--"}</p>
                  <span className="text-[10px] text-[#63736A]">Mid-cycle</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDF5F3] border border-[#F8DFD9] text-center">
                  <Heart className="h-5 w-5 text-[#E05A5A] mx-auto mb-1.5" />
                  <span className="text-[10px] font-bold text-[#9E5748] uppercase tracking-wider">{t("estimatedFertileWindow")}</span>
                  <p className="text-lg font-extrabold text-[#172C23] mt-1">
                    {cycle.fertileStart ? `${cycle.fertileStart} – ${cycle.fertileEnd}` : "--"}
                  </p>
                  <span className="text-[10px] text-[#63736A]">~6 day window</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F3F8F1] border border-[#DEECDA] text-center">
                  <Droplets className="h-5 w-5 text-[#2E6B40] mx-auto mb-1.5" />
                  <span className="text-[10px] font-bold text-[#4E7855] uppercase tracking-wider">{t("nextPeriodDue")}</span>
                  <p className="text-lg font-extrabold text-[#172C23] mt-1">{cycle.nextPeriodDate || "--"}</p>
                  <span className="text-[10px] text-[#63736A]">Expected date</span>
                </div>
              </div>
            </div>

            {/* Nutrition Guidance Pills */}
            <div className="mt-5 pt-4 border-t border-[#E5E7DE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] block mb-2">
                Nutritional Focus for this Phase:
              </span>
              <div className="flex flex-wrap gap-2">
                {phaseInfo.nutrition.map((item, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-[#FAF8F0] border border-[#E5E7DE] text-[#172C23]">
                    🌿 {item}
                  </span>
                ))}
              </div>
            </div>
          </Card>

        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-[#63736A] italic p-4 rounded-2xl bg-white/80 border border-[#E5E7DE] leading-relaxed">
          {t("cycleDisclaimer")}
        </p>

      </div>

      {/* ── MODAL: CYCLE SETTINGS ── */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-[#E5E7DE] bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[#172C23] font-serif text-lg">Cycle Settings</DialogTitle>
            <DialogDescription className="text-xs text-[#63736A]">
              Configure your cycle parameters for accurate predictive estimates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSettingsSubmit} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                First Day of Last Period
              </label>
              <Input
                type="date"
                value={lastDateInput}
                onChange={(e) => setLastDateInput(e.target.value)}
                required
                className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                  Average Cycle (days)
                </label>
                <Input
                  type="number"
                  min="21"
                  max="45"
                  value={cycleLengthInput}
                  onChange={(e) => setCycleLengthInput(e.target.value)}
                  required
                  className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">
                  Period Length (days)
                </label>
                <Input
                  type="number"
                  min="2"
                  max="10"
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  required
                  className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-xl border-[#E5E7DE] text-[#63736A] hover:bg-[#F5F0E5]"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[#173B2D] hover:bg-[#102F24] text-white font-semibold"
              >
                Save Settings
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}