"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Camera, X, Activity, Utensils, Info } from "lucide-react"

type Message = {
  role: "ai" | "user";
  content: string;
  imageUrl?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "🥗 MediNutri AI+ is ready!\n\nI can analyze your meals and track calories. Try uploading a photo of your food!" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [base64Image, setBase64Image] = useState<string | null>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
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

  const sendMessage = async (overrideMsg?: string) => {
    const activeMsg = overrideMsg || input;
    if ((!activeMsg.trim() && !base64Image) || loading) return
    
    const userMsg = activeMsg || "Analyze this meal"
    setMessages(prev => [...prev, { role: "user", content: userMsg, imageUrl: previewImage || undefined }])
    
    setInput("")
    setPreviewImage(null)
    setBase64Image(null) 
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, image: base64Image }),
      })
      const data = await res.json()
      // Matches 'output' from your route.ts
      setMessages(prev => [...prev, { role: "ai", content: data.output || "I couldn't process that. Try again!" }])
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", content: "❌ Connection error. Please check your internet." }])
    } finally {
      setLoading(false)
      inputRef.current?.focus() 
    }
  }

  return (
    <DashboardLayout title="AI Health Assistant" subtitle="Intelligent Nutrition Tracking">
      <div className="flex flex-col h-[80vh] bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden max-w-4xl mx-auto">
        
        {/* Chat Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-pink-50/20">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start animate-in slide-in-from-left-2"}`}>
              <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${
                m.role === "user" 
                  ? "bg-pink-500 text-white rounded-tr-none" 
                  : "bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium"
              }`}>
                {m.imageUrl && (
                  <img src={m.imageUrl} alt="Food" className="rounded-xl mb-3 border-2 border-white/20 shadow-inner max-h-60 w-full object-cover" />
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white border border-pink-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
                <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Scanning Meal...</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Tray & Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 space-y-4">
          
          {!previewImage && !input && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button onClick={() => sendMessage("Is this meal healthy?")} className="text-xs font-semibold px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full border border-pink-100 hover:bg-pink-100 transition-colors flex items-center gap-1 shrink-0">
                <Utensils size={12} /> Is this healthy?
              </button>
              <button onClick={() => sendMessage("Estimate calories")} className="text-xs font-semibold px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full border border-pink-100 hover:bg-pink-100 transition-colors flex items-center gap-1 shrink-0">
                <Activity size={12} /> Estimate calories
              </button>
              <button onClick={() => sendMessage("Show pro tips")} className="text-xs font-semibold px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full border border-pink-100 hover:bg-pink-100 transition-colors flex items-center gap-1 shrink-0">
                <Info size={12} /> Nutrition tips
              </button>
            </div>
          )}

          {previewImage && (
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <div className="relative h-16 w-16 group">
                <img src={previewImage} className="h-full w-full object-cover rounded-lg shadow-md border-2 border-white" />
                <button onClick={() => {setPreviewImage(null); setBase64Image(null)}} className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 shadow-lg hover:bg-red-500 transition-all">
                  <X size={12} />
                </button>
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-700">Image Loaded</p>
                <p className="text-slate-400">Ready for analysis...</p>
              </div>
            </div>
          )}

          <div className="flex gap-2 items-center bg-slate-100/80 p-2 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-100 transition-all">
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" id="cam-input" />
            <label htmlFor="cam-input" className="p-3 cursor-pointer hover:bg-white hover:shadow-md rounded-xl text-slate-500 hover:text-pink-500 transition-all">
              <Camera size={20} />
            </label>
            
            <Input 
              ref={inputRef}
              className="border-none bg-transparent focus-visible:ring-0 text-slate-700 font-medium placeholder:text-slate-400" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Type a message or upload food..." 
              onKeyDown={e => e.key === 'Enter' && sendMessage()} 
            />
            
            <Button 
              onClick={() => sendMessage()} 
              disabled={loading || (!input.trim() && !previewImage)} 
              className="rounded-xl bg-pink-500 hover:bg-pink-600 shadow-md h-11 w-11 p-0 shrink-0"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send size={20} />}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}