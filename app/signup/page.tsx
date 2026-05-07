"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      alert("Enter email & password")
      return
    }

    alert("Account created 🎉")
    router.push("/login")
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      
      {/* 🔥 BIG BACKGROUND TEXT */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-7xl md:text-9xl font-bold text-foreground/5 text-center animate-pulse tracking-widest">
          MEDINUTRI AI
        </div>
      </div>

      <div className="w-full h-screen flex relative z-10">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10" />

          <div className="relative w-full h-full flex items-center justify-center">
            <div className="animate-fade-in-up">

              <img
                src="/nutrition-foods.jpg"
                alt="Healthy nutrition"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />

              <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Healthy Start
                </h2>
                <p className="text-muted-foreground text-lg">
                  Join MediNutri & transform your health 🚀
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">

          <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl">

              {/* HEADER */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  Create Account
                </h1>
                <p className="text-muted-foreground text-sm">
                  Start your AI health journey
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSignup} className="space-y-5">

                {/* EMAIL */}
                <div className="space-y-2">
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
                <div className="space-y-2">
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

                {/* BUTTON */}
                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl hover:scale-105 transition"
                >
                  Sign Up
                </Button>

                {/* LOGIN LINK */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{" "}
                  <span
                    onClick={() => router.push("/login")}
                    className="text-primary cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </p>

              </form>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Your health, powered by AI
            </p>
          </div>

        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}