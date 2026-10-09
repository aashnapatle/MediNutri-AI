"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Send, Loader2, Camera, X, Flame, CheckCircle2, Plus, Sparkles } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { useHealth } from "@/context/HealthContext"

interface ParsedMealEstimate {
  foodName: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}

interface Message {
  role: "ai" | "user"
  content: string
  imageUrl?: string
  mealEstimate?: ParsedMealEstimate
}

export default function ChatPage() {
  const { t } = useLanguage()
  const { addMeal } = useHealth()
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello! I am your AI Nutrition Companion 🌱\n\nI can estimate calories, analyze your meals from photos, and suggest healthy meal plans. How can I support your nutrition goals today?",
    },
  ])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [base64Image, setBase64Image] = useState<string | null>(null)

  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [selectedEstimate, setSelectedEstimate] = useState<ParsedMealEstimate | null>(null)
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch")
  const [toastMessage, setToastMessage] = useState("")

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const fullDataUrl = reader.result as string
        setPreviewImage(fullDataUrl)
        setBase64Image(fullDataUrl.split(",")[1])
      }
      reader.readAsDataURL(file)
    }
  }

  const extractNutrition = (text: string, userQuery: string): ParsedMealEstimate | undefined => {
    const calMatch = text.match(/(\d{2,4})\s*(?:kcal|calories)/i)
    if (calMatch) {
      const calories = parseInt(calMatch[1])
      const proteinMatch = text.match(/(\d{1,3}(?:\.\d)?)\s*g\s*(?:of\s*)?protein/i)
      const carbsMatch = text.match(/(\d{1,3}(?:\.\d)?)\s*g\s*(?:of\s*)?carbs/i)
      const fatMatch = text.match(/(\d{1,3}(?:\.\d)?)\s*g\s*(?:of\s*)?fat/i)

      let foodName = userQuery.replace(/estimate|calories|for|of|is|healthy|this|\?/gi, "").trim()
      if (!foodName || foodName.length < 2) foodName = "Analyzed Meal"

      return {
        foodName,
        calories,
        protein: proteinMatch ? parseFloat(proteinMatch[1]) : undefined,
        carbs: carbsMatch ? parseFloat(carbsMatch[1]) : undefined,
        fat: fatMatch ? parseFloat(fatMatch[1]) : undefined,
      }
    }
    return undefined
  }

  const sendMessage = async (customText?: string) => {
    const query = customText || input
    if ((!query.trim() && !base64Image) || loading) return

    const userMsg = query.trim() || "Analyze this food image"
    const currentImg = previewImage
    const currentBase64 = base64Image

    setInput("")
    setPreviewImage(null)
    setBase64Image(null)

    setMessages((prev) => [...prev, { role: "user", content: userMsg, imageUrl: currentImg || undefined }])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, image: currentBase64 || undefined }),
      })
      const data = await res.json()
      const aiReply = data.reply || "I am analyzing your nutrition request. Please try again."

      const estimate = extractNutrition(aiReply, userMsg)
      setMessages((prev) => [...prev, { role: "ai", content: aiReply, mealEstimate: estimate }])
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "Connection to AI service failed. Please try again." }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const openSaveModal = (estimate: ParsedMealEstimate) => {
    setSelectedEstimate(estimate)
    setSaveModalOpen(true)
  }

  const handleConfirmSave = async () => {
    if (!selectedEstimate) return
    await addMeal({
      name: selectedEstimate.foodName,
      calories: selectedEstimate.calories,
      protein: selectedEstimate.protein,
      carbs: selectedEstimate.carbs,
      fat: selectedEstimate.fat,
      type: selectedMealType,
    })
    setSaveModalOpen(false)
    setToastMessage(`Saved ${selectedEstimate.foodName} (${selectedEstimate.calories} kcal) to today's log!`)
    setTimeout(() => setToastMessage(""), 3500)
  }

  return (
    <DashboardLayout title={t("chatTitle") || "AI Nutritionist"} subtitle={t("chatSubtitle") || "Your personal food & nutrition assistant"}>
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-4">

        {toastMessage && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#E5F0DF] text-[#173B2D] border border-[#7EAA82]/30 shadow-xs animate-in slide-in-from-top-2 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#7EAA82] shrink-0" />
              <span className="text-xs font-semibold">{toastMessage}</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => router.push("/calories")} className="h-7 text-xs rounded-full border-[#E5E7DE]">
              View in Log
            </Button>
          </div>
        )}

        {/* Header Card */}
        <div className="nature-card p-4 rounded-3xl bg-white/95 border border-[#E5E7DE] shadow-xs flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-[#FF777F] to-[#FF5E6C] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#172C23] font-serif">AI Nutritionist</h2>
              <p className="text-xs text-[#63736A]">Ask questions, upload meals, or get instant macro breakdowns</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 nature-card rounded-3xl bg-white/95 border border-[#E5E7DE] shadow-xs flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF8F0]/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in-50`}>
                <div
                  className={`p-4 rounded-3xl max-w-[85%] sm:max-w-[75%] shadow-2xs leading-relaxed text-xs sm:text-sm ${
                    m.role === "user"
                      ? "bg-[#173B2D] text-white rounded-tr-md"
                      : "bg-white text-[#172C23] border border-[#E5E7DE] rounded-tl-md"
                  }`}
                >
                  {m.imageUrl && (
                    <img src={m.imageUrl} alt="Food" className="rounded-2xl mb-3 max-h-56 w-full object-cover border border-[#E5E7DE]" />
                  )}
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {m.mealEstimate && (
                    <div className="mt-3 pt-3 border-t border-[#E5E7DE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-[#FAF8F0] p-3 rounded-2xl border border-[#DEECDA]">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#172C23]">
                          <Flame className="h-4 w-4 text-[#FF777F]" />
                          <span>Estimated: ~{m.mealEstimate.calories} kcal</span>
                        </div>
                        <p className="text-[11px] text-[#63736A] mt-0.5">
                          {m.mealEstimate.protein ? `P: ${m.mealEstimate.protein}g · ` : ""}
                          {m.mealEstimate.carbs ? `C: ${m.mealEstimate.carbs}g · ` : ""}
                          {m.mealEstimate.fat ? `F: ${m.mealEstimate.fat}g` : ""}
                        </p>
                      </div>
                      <Button
                        onClick={() => openSaveModal(m.mealEstimate!)}
                        size="sm"
                        className="rounded-full bg-[#7EAA82] hover:bg-[#68946C] text-white font-semibold text-xs shrink-0 cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        <span>Save to Log</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E5E7DE] p-3.5 rounded-2xl rounded-tl-md shadow-2xs flex items-center gap-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-[#7EAA82]" />
                  <span className="text-xs font-semibold text-[#63736A]">Analyzing with AI...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-3 bg-white border-t border-[#E5E7DE]">
            {!previewImage && !input && (
              <div className="flex gap-2 overflow-x-auto pb-2.5 no-scrollbar text-xs">
                <button onClick={() => sendMessage("Estimate calories for 2 rotis with paneer bhurji and dal")} className="pill-action-btn whitespace-nowrap text-xs">
                  🍱 Estimate calories
                </button>
                <button onClick={() => sendMessage("Is a bowl of curd with oats and chia seeds healthy for breakfast?")} className="pill-action-btn whitespace-nowrap text-xs">
                  🥗 Meal ideas
                </button>
                <button onClick={() => sendMessage("What are 3 high-protein vegetarian snack ideas under 200 calories?")} className="pill-action-btn whitespace-nowrap text-xs">
                  💪 Protein sources
                </button>
                <button onClick={() => sendMessage("What are some healthy drinks without sugar?")} className="pill-action-btn whitespace-nowrap text-xs">
                  🥤 Healthy drinks
                </button>
              </div>
            )}

            {previewImage && (
              <div className="flex items-center gap-3 p-2 mb-2 bg-[#FAF8F0] rounded-2xl border border-dashed border-[#7EAA82]">
                <div className="relative h-12 w-12 shrink-0">
                  <img src={previewImage} alt="Staged" className="h-full w-full object-cover rounded-xl" />
                  <button onClick={() => { setPreviewImage(null); setBase64Image(null) }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-xs font-semibold text-[#172C23]">Food image ready for analysis</p>
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className="flex items-center gap-2">
              <label className="h-10 w-10 rounded-full border border-[#E5E7DE] flex items-center justify-center hover:bg-[#FAF8F0] cursor-pointer text-[#63736A] shrink-0 transition-colors">
                <Camera className="h-4 w-4" />
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about calories, macros, or food..."
                className="flex-1 h-10 rounded-full border border-[#E5E7DE] bg-[#FAF8F0] px-4 text-xs sm:text-sm text-[#172C23] placeholder-[#63736A] outline-none focus:border-[#7EAA82]"
              />

              <button
                type="submit"
                disabled={loading || (!input.trim() && !base64Image)}
                className="h-10 w-10 rounded-full bg-[#173B2D] hover:bg-[#102F24] disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Save Meal Dialog */}
      <Dialog open={saveModalOpen} onOpenChange={setSaveModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-[#E5E7DE] bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[#172C23] font-serif text-lg">Save Meal to Today&apos;s Log</DialogTitle>
            <DialogDescription className="text-xs text-[#63736A]">
              Add AI-analyzed food item directly to your daily caloric tracker.
            </DialogDescription>
          </DialogHeader>

          {selectedEstimate && (
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">Food Name</label>
                <Input
                  value={selectedEstimate.foodName}
                  onChange={(e) => setSelectedEstimate({ ...selectedEstimate, foodName: e.target.value })}
                  className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">Calories</label>
                  <Input
                    type="number"
                    value={selectedEstimate.calories}
                    onChange={(e) => setSelectedEstimate({ ...selectedEstimate, calories: parseInt(e.target.value) || 0 })}
                    className="mt-1.5 rounded-xl border-[#E5E7DE] bg-[#FAF8F0] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#63736A]">Meal Time</label>
                  <select
                    value={selectedMealType}
                    onChange={(e: any) => setSelectedMealType(e.target.value)}
                    className="mt-1.5 w-full h-9 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] px-3 text-xs text-[#172C23] focus:outline-none focus:border-[#7EAA82]"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSaveModalOpen(false)}
                  className="rounded-xl border-[#E5E7DE] text-[#63736A] hover:bg-[#F5F0E5]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmSave}
                  className="rounded-xl bg-[#173B2D] hover:bg-[#102F24] text-white font-semibold"
                >
                  Save to Log
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}