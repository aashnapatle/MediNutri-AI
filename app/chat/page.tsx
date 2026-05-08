"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"

export default function ChatPage() {
  const [messages, setMessages] = useState([{ role: "ai", content: "MediNutri AI+ Reset Complete. Ask me anything!" }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "ai", content: data.output || "Error: " + data.error }])
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", content: "Check Terminal for Error" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="AI Health Assistant" subtitle="System Restarted">
      <div className="flex flex-col h-[70vh] bg-white rounded-xl shadow p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-lg max-w-[80%] ${m.role === "user" ? "ml-auto bg-blue-500 text-white" : "bg-gray-100"}`}>
              {m.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Type here..." onKeyDown={e => e.key === 'Enter' && sendMessage()} />
          <Button onClick={sendMessage} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}