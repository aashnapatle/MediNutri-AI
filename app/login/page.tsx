"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      alert("Enter email & password")
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      alert("Login success ✅")
      router.push("/profile")
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-[url('/hero.jpg')] bg-[length:80%] bg-center bg-no-repeat flex items-center justify-center">

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-7xl md:text-9xl font-bold text-foreground/5 text-center animate-pulse tracking-widest">
          MEDINUTRI AI
        </div>
      </div>

      <div className="w-full h-screen flex relative z-10">

        {/* LEFT */}
        <div className="w-full lg:w-1/2 flex items-center justify-start pl-10">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10" />
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 flex items-center justify-start p-1">
          <div className="w-full max-w-md">

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">

              {/* HEADER */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MediNutri Ai
                </h1>
                <p className="text-muted-foreground text-sm">
                  AI-Powered Healthcare & Nutrition
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* EMAIL */}
                <div>
                  <label className="text-sm">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm">Password</label>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* BUTTON */}
                <Button type="submit" className="w-full mt-6">
                  Sign In
                </Button>

                {/* SIGNUP */}
                <p className="text-center text-sm mt-4">
                  Don’t have an account?{" "}
                  <span
                    onClick={() => router.push("/signup")}
                    className="text-primary cursor-pointer"
                  >
                    Sign up
                  </span>
                </p>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}