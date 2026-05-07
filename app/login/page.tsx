"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      alert("Enter email & password")
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[url('/hero.jpg')] bg-[length:80%] bg-center bg-no-repeat flex items-center justify-center">      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-7xl md:text-9xl font-bold text-foreground/5 text-center animate-pulse tracking-widest">
          MEDINUTRI AI
        </div>
      </div>

      <div className="w-full h-screen flex relative z-10">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 flex items-center justify-start pl-10">          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10" />

          <div className="relative w-full h-full flex items-center justify-center">
            

              <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
                
                
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 flex items-center justify-start p-1 sm:p-1">

          <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl">

              {/* HEADER */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  MediNutri Ai
                </h1>
                <p className="text-muted-foreground text-sm">
                  AI-Powered Healthcare & Nutrition
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* EMAIL */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <label className="text-sm font-medium text-foreground/80">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  <label className="text-sm font-medium text-foreground/80">
                    Password
                  </label>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* REMEMBER */}
                <div className="flex items-center justify-between text-sm animate-fade-in" style={{ animationDelay: "0.6s" }}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-primary" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>

                  <span className="text-primary cursor-pointer">
                    Forgot password?
                  </span>
                </div>

                {/* BUTTON */}
                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl hover:scale-105 transition"
                >
                  Sign In
                </Button>

                {/* SIGNUP LINK */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don’t have an account?{" "}
                  <span
                    onClick={() => router.push("/signup")}
                    className="text-primary cursor-pointer hover:underline"
                  >
                    Sign up
                  </span>
                </p>

              </form>
            </div>

            {/* FOOTER */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              Your health, powered by AI
            </p>
          </div>

        </div>
      </div>

      
  )
}