"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calculator,
  Flame,
  Stethoscope,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Heart,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bmi", label: "BMI Calculator", icon: Calculator },
  { href: "/calories", label: "Calories", icon: Flame },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/chat", label: "AI Chat", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-5 w-5 text-primary" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-foreground">
            MediNutri <span className="text-primary">AI+</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-primary hover:bg-secondary transition-colors">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
