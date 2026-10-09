"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"
import { Menu, X, ChevronDown, User, Bell, Sparkles, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/context/LanguageContext"
import { useHealth } from "@/context/HealthContext"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const { profile } = useHealth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const displayName = profile.name || auth.currentUser?.displayName || auth.currentUser?.email?.split("@")[0] || "aashu"
  const firstName = displayName.split(" ")[0]
  const userInitials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "A"

  const defaultAvatarSrc = profile.avatarUrl || "/placeholder-user.jpg"

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/chat?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen botanical-bg bg-[#FAF8F0] text-[#172C23]">
      {/* ── DESKTOP SIDEBAR ── */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[276px] shadow-2xl z-50">
            <Sidebar className="w-full h-full static" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT WRAPPER ── */}
      <div className="lg:ml-[276px] flex flex-col min-h-screen">

        {/* ── GLOBAL HEADER ── */}
        <header
          className="sticky top-0 z-30 flex h-[68px] items-center justify-between px-4 sm:px-8 border-b border-[#E5E7DE]"
          style={{
            background: "rgba(250, 248, 240, 0.88)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          {/* Left: Mobile hamburger + Search Field */}
          <div className="flex items-center gap-3.5 flex-1 max-w-xl">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#E5E7DE] bg-white text-[#172C23] hover:bg-[#F5F0E5] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Pill Search Field */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden sm:block">
              <div className="flex items-center gap-2 rounded-full border border-[#E5E7DE] bg-white/95 px-4 py-2 shadow-2xs hover:border-[#7EAA82] focus-within:border-[#7EAA82] transition-colors">
                <Search className="h-4 w-4 text-[#63736A] shrink-0" />
                <input
                  type="text"
                  placeholder="Search for meals, insights, or anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[13px] text-[#172C23] placeholder-[#63736A] outline-none"
                />
                <span className="hidden md:inline-flex items-center text-[10px] font-semibold text-[#63736A] bg-[#F5F0E5] px-2 py-0.5 rounded-full tracking-wider">
                  Ctrl K
                </span>
              </div>
            </form>
          </div>

          {/* Right: "Ask AI Nutritionist" + Notification Bell + User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Coral/Pink "Ask AI Nutritionist" Button */}
            <Link
              href="/chat"
              className="btn-coral-ai px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-sm btn-hover cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>Ask AI Nutritionist</span>
            </Link>

            {/* Notification Bell in circular outlined container */}
            <div className="relative">
              <button
                className="h-9 w-9 rounded-full border border-[#E5E7DE] bg-white/90 flex items-center justify-center text-[#172C23] hover:bg-white hover:border-[#7EAA82] transition-colors shadow-2xs"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 text-[#172C23]" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#FF777F]" />
              </button>
            </div>

            {/* User Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full pl-1 pr-3 py-1 bg-white/80 border border-[#E5E7DE] hover:bg-white hover:border-[#7EAA82] transition-colors outline-none cursor-pointer shadow-2xs">
                <Avatar className="h-8 w-8 ring-1 ring-[#7EAA82]/40">
                  <AvatarImage src={defaultAvatarSrc} alt={displayName} />
                  <AvatarFallback className="bg-[#E5F0DF] text-[#173B2D] text-xs font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[13px] font-semibold text-[#172C23] max-w-[100px] truncate hidden md:inline">
                  {firstName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#63736A]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-2xl p-1.5 shadow-xl border-[#E5E7DE] bg-white text-[#172C23]"
              >
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer hover:bg-[#FAF8F0]">
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#63736A]" />
                    <span>{t("profile2")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer hover:bg-[#FAF8F0]">
                  <Link href="/settings" className="flex items-center gap-2">
                    <span>⚙️</span>
                    <span>{t("settings2")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-xl text-[#E05A5A] hover:bg-[#FCE8E5] cursor-pointer font-medium"
                >
                  <span className="mr-2">🚪</span>
                  {t("logout2")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* ── CONTENT BODY ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full animate-in fade-in-50 duration-200">
          {children}
        </main>
      </div>
    </div>
  )
}