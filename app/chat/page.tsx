"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "user",
    content: "What should I eat to lose weight?",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    role: "assistant",
    content: "To lose weight, you should focus on a balanced diet with fewer calories and more nutrients. Here are some tips:",
    timestamp: "10:30 AM",
  },
]

const dietTips = [
  "Eat more vegetables and fruits",
  "Choose whole grains",
  "Avoid sugar and processed foods",
  "Drink plenty of water",
  "Do regular exercise",
]

const aiResponses: Record<string, string> = {
  default: "I can help you with diet and nutrition advice! Feel free to ask about meal plans, calorie intake, or healthy eating habits.",
  weight: "For weight management, focus on a calorie deficit while maintaining proper nutrition. Aim for 500 calories below your maintenance level for healthy weight loss.",
  protein: "Great sources of protein include lean meats, fish, eggs, legumes, and dairy. Aim for 0.8-1g of protein per pound of body weight if you're active.",
  breakfast: "A healthy breakfast could include oatmeal with fruits, Greek yogurt with nuts, or eggs with whole grain toast. Avoid sugary cereals.",
  water: "You should aim for 8-10 glasses of water daily. More if you're active or in hot weather. Staying hydrated helps metabolism and reduces hunger.",
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    // Simple AI response logic
    let response = aiResponses.default
    const lowerInput = input.toLowerCase()
    if (lowerInput.includes("weight") || lowerInput.includes("lose")) {
      response = aiResponses.weight
    } else if (lowerInput.includes("protein")) {
      response = aiResponses.protein
    } else if (lowerInput.includes("breakfast")) {
      response = aiResponses.breakfast
    } else if (lowerInput.includes("water")) {
      response = aiResponses.water
    }

    const aiMessage: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: response,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, userMessage, aiMessage])
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <DashboardLayout
      title="AI Health Assistant"
      subtitle="Ask anything about health, diet, and fitness"
    >
      <Card className="rounded-2xl border-0 shadow-md h-[calc(100vh-180px)] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-10 w-10 shrink-0 bg-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-[70%] ${message.role === "user" ? "order-1" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>

                    {/* Show diet tips after initial AI response */}
                    {message.id === 2 && (
                      <ul className="mt-3 space-y-2">
                        {dietTips.map((tip, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${message.role === "user" ? "text-right" : ""}`}>
                    {message.timestamp}
                  </p>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-10 w-10 shrink-0 bg-primary/10 order-2">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-3">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 h-12 rounded-xl border-border bg-secondary/50"
              />
              <Button
                onClick={handleSend}
                className="h-12 w-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 p-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decorative */}
      <div className="fixed bottom-4 right-4 pointer-events-none opacity-20 hidden xl:block">
        <div className="text-[120px]">🤖</div>
      </div>
    </DashboardLayout>
  )
}
