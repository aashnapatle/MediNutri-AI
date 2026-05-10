"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, getFirestore, setDoc } from "firebase/firestore"
import { auth } from "@/lib/auth"

const db = getFirestore()

export default function SignupPage() {
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
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCred.user

      // 🔥 AUTO SAVE USER DATA
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date()
      })

      alert("Signup success ✅")
      router.push("/profile")

    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/10 backdrop-blur">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" className="w-full">
            Sign Up
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-500 cursor-pointer"
            >
              Login
            </span>
          </p>

        </form>
      </div>
    </div>
  )
}