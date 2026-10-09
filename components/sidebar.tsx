"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext"
import { useHealth } from "@/context/HealthContext"
import {
  LayoutDashboard,
  UtensilsCrossed,
  Scale,
  TrendingUp,
  CalendarHeart,
  Sparkles,
  BookOpen,
  Stethoscope,
  User,
  Settings,
  LogOut,
  ArrowRight,
} from "lucide-react"

interface NavItem {
  href: string
  labelKey: "dashboard" | "calories" | "bmiCalculator" | "journey" | "cycle" | "aiChat" | "wellness" | "doctors" | "profile" | "settings"
  icon: any
  femaleBadge?: boolean
  coralHighlight?: boolean
}

const navItems: NavItem[] = [
  { href: "/dashboard",  labelKey: "dashboard",     icon: LayoutDashboard },
  { href: "/calories",   labelKey: "calories",      icon: UtensilsCrossed },
  { href: "/bmi",        labelKey: "bmiCalculator", icon: Scale },
  { href: "/journey",    labelKey: "journey",       icon: TrendingUp },
  { href: "/cycle",      labelKey: "cycle",         icon: CalendarHeart, femaleBadge: true },
  { href: "/chat",       labelKey: "aiChat",        icon: Sparkles, coralHighlight: true },
  { href: "/wellness",   labelKey: "wellness",      icon: BookOpen },
  { href: "/doctors",    labelKey: "doctors",       icon: Stethoscope },
  { href: "/profile",    labelKey: "profile",       icon: User },
  { href: "/settings",   labelKey: "settings",      icon: Settings },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const { profile } = useHealth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const displayName = profile.name || auth.currentUser?.displayName || auth.currentUser?.email?.split("@")[0] || "User"
  const userInitial = displayName.charAt(0).toUpperCase() || "N"

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-[276px] flex flex-col justify-between transition-all",
        "bg-gradient-to-b from-[#102F24] via-[#14362A] to-[#0D261D] border-r border-[#1C4535]",
        "text-white shadow-2xl overflow-hidden",
        className
      )}
    >
      {/* ── TOP DECORATIVE BOTANICAL VINE (Subtle) ── */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-15 overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#7EAA82]">
          <path d="M10,0 C30,40 70,60 100,50 C90,20 60,10 10,0 Z" />
          <path d="M40,20 C60,40 90,40 100,10 C80,0 50,10 40,20 Z" />
        </svg>
      </div>

      {/* ── HEADER & NAVIGATION ── */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Section */}
        <div className="flex items-center gap-3.5 px-6 pt-6 pb-5 border-b border-[#1C4535]/80">
          {/* Pale green rounded-square logo container */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5F0DF] text-[#102F24] shadow-sm shadow-black/20 shrink-0">
            {/* Elegant botanical leaf SVG */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#102F24]" stroke="none">
              <path d="M17.5 2C15 2 11.5 3.5 9 6.5C6 10.1 5.5 15.5 5.5 19.5C9.5 19.5 14.9 19 18.5 16C21.5 13.5 23 10 23 7.5C23 4.5 20.5 2 17.5 2ZM16.5 15C13.5 17.5 9.5 17.8 7.2 17.8C7.2 15.5 7.5 11.5 10 8.5C12.1 6 15 4.5 17.2 4.2C17.5 6.5 17 9.5 16.5 15Z" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[17px] font-bold text-white tracking-tight">
              MediNutri <span className="text-[#7EAA82]">AI+</span>
            </span>
            <span className="text-[10px] font-semibold text-[#8EB89A] uppercase tracking-[0.14em] mt-0.5">
              Health Companion
            </span>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 scrollbar-thin">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const isCycle = item.femaleBadge && profile.gender === "female"

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#2B5E4A] to-[#1E4837] text-white font-semibold border border-[#529A7B]/50 shadow-sm shadow-emerald-950/40"
                    : "text-[#B2C7BA] hover:text-white hover:bg-[#184232]/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110 shrink-0",
                      isActive
                        ? "text-white"
                        : item.coralHighlight
                        ? "text-[#FF8A91]"
                        : "text-[#8EB89A]"
                    )}
                  />
                  <span className="truncate">{t(item.labelKey)}</span>
                </div>

                {isCycle && (
                  <span
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                      isActive ? "bg-white/20 text-white" : "bg-[#FF777F]/20 text-[#FF8A91]"
                    )}
                  >
                    Women
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* ── SIDEBAR FOOTER ── */}
      <div className="px-4 pb-5 pt-2 space-y-3 shrink-0 relative">
        {/* Subtle decorative leaf branch in background */}
        <div className="absolute bottom-16 right-2 w-24 h-28 pointer-events-none opacity-20">
          <svg viewBox="0 0 100 120" className="w-full h-full fill-[#7EAA82]">
            <path d="M10,120 Q50,70 90,20 Q60,60 10,120 Z" />
            <ellipse cx="60" cy="50" rx="14" ry="7" transform="rotate(-30 60 50)" />
            <ellipse cx="75" cy="30" rx="12" ry="6" transform="rotate(-45 75 30)" />
            <ellipse cx="40" cy="70" rx="14" ry="7" transform="rotate(-20 40 70)" />
          </svg>
        </div>

        {/* Promotional card: "Better Food, Brighter You" */}
        <div className="rounded-2xl border border-[#2B5845]/60 bg-[#163B2D]/75 p-3.5 relative overflow-hidden backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-serif italic text-white text-[14px] leading-snug tracking-wide">
                Better Food
              </p>
              <p className="font-serif italic text-[#8EB89A] text-[14px] leading-snug tracking-wide">
                Brighter You
              </p>
            </div>
            <Link
              href="/wellness"
              className="h-7 w-7 rounded-full bg-[#398860] hover:bg-[#439F70] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
              aria-label="Better Food, Brighter You"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom User / Logout Section */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1C4535]/80">
          <Link href="/profile" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-full border border-[#2E5B48] bg-[#173B2D] text-white flex items-center justify-center text-xs font-bold group-hover:border-[#7EAA82] transition-colors">
              {userInitial}
            </div>
            <span className="text-[13px] font-medium text-[#B2C7BA] group-hover:text-white transition-colors truncate max-w-[110px]">
              {displayName}
            </span>
          </Link>

          <button
            type="button"
            suppressHydrationWarning
            data-no-autofill="true"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[12px] font-medium text-[#FF8A91] hover:text-white hover:bg-[#FF777F]/15 transition-all cursor-pointer"
            title={t("logout")}
          >
            <span>{t("logout")}</span>
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
