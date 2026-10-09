"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowRight, Loader2, User, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useLanguage } from "@/context/LanguageContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  const router = useRouter()
  const { t } = useLanguage()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms & Conditions to proceed.")
      return
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (fullName) {
        await updateProfile(user, { displayName: fullName })
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: fullName || "Health Seeker",
          email: user.email,
          createdAt: new Date().toISOString(),
          gender: "female",
          goal: "maintain",
        },
        { merge: true }
      )

      router.push("/dashboard")
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setErrorMessage("An account with this email already exists.")
      } else {
        setErrorMessage(err.message || "Failed to create account.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setErrorMessage("")
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const res = await signInWithPopup(auth, provider)
      const user = res.user

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "Health Seeker",
          email: user.email,
          avatarUrl: user.photoURL || "",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      )

      router.push("/dashboard")
    } catch (err: any) {
      setErrorMessage(err.message || "Google sign-up was cancelled or failed.")
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    let score = 0
    if (password.length > 5) score++
    if (password.length > 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    return score
  }
  const passScore = getPasswordStrength()
  const strengthColor = passScore === 0 ? "bg-transparent" : passScore === 1 ? "bg-red-400" : passScore === 2 ? "bg-amber-400" : passScore === 3 ? "bg-[#7EAA82]" : "bg-emerald-600"

  return (
    <div className="min-h-screen botanical-bg bg-[#FAF8F0] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#E5F0DF]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#7EAA82]/15 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/95 rounded-3xl border border-[#E5E7DE] p-7 sm:p-9 shadow-lg nature-card">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#102F24] shadow-xs">
              <span className="text-2xl">🌿</span>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-[#172C23]">
                MediNutri <span className="text-[#7EAA82]">AI+</span>
              </h1>
              <p className="text-[10px] text-[#63736A] font-semibold tracking-wider uppercase mt-0.5">Health Companion</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#172C23] font-serif">Create Account</h2>
            <p className="text-xs text-[#63736A] mt-1">Start your personalized health journey today</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-[#FCE8E5] border border-[#F8DFD9] text-[#E05A5A] text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full h-11 rounded-full bg-white border border-[#E5E7DE] hover:bg-[#FAF8F0] text-[#172C23] text-xs font-semibold cursor-pointer btn-hover flex items-center justify-center gap-2.5 shadow-2xs"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z" />
            </svg>
            <span>Sign up with Google</span>
          </Button>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7DE]" />
            </div>
            <span className="relative bg-white px-3 text-[10px] text-[#63736A] uppercase tracking-wider font-semibold">
              or sign up with email
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#63736A]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] text-xs text-[#172C23] placeholder:text-[#63736A] focus:outline-none focus:border-[#7EAA82] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#63736A]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] text-xs text-[#172C23] placeholder:text-[#63736A] focus:outline-none focus:border-[#7EAA82] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#63736A]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min. 6 characters)"
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] text-xs text-[#172C23] placeholder:text-[#63736A] focus:outline-none focus:border-[#7EAA82] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#63736A] hover:text-[#172C23] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 px-1">
                  <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strengthColor}`} style={{ width: `${(passScore / 4) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-[#63736A] font-medium">
                    {passScore <= 1 ? "Weak" : passScore <= 2 ? "Fair" : passScore <= 3 ? "Good" : "Strong"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#63736A]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] text-xs text-[#172C23] placeholder:text-[#63736A] focus:outline-none focus:border-[#7EAA82] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                id="terms"
                className="rounded border-[#E5E7DE] text-[#173B2D] focus:ring-[#7EAA82]"
              />
              <label htmlFor="terms" className="text-[#63736A] cursor-pointer">
                I agree to the Terms of Service & Privacy Policy
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full bg-[#173B2D] hover:bg-[#102F24] text-white font-semibold cursor-pointer btn-hover shadow-xs transition-all text-xs"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-[#63736A]">
            <span>Already have an account? </span>
            <Link href="/login" className="text-[#38664F] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}