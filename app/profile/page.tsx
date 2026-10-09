"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { useHealth } from "@/context/HealthContext"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"]

export default function ProfilePage() {
  const { t } = useLanguage()
  const { profile, updateProfile, bmi, calories } = useHealth()

  const [form, setForm] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    location: profile.location || "",
    height: profile.height || "",
    weight: profile.weight || "",
    goalWeight: profile.goalWeight || "",
    age: profile.age || "",
    gender: profile.gender || "female",
    bloodType: profile.bloodType || "O+",
    goal: profile.goal || "maintain",
    avatarUrl: profile.avatarUrl || "",
  })

  const [toastMessage, setToastMessage] = useState("")
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      height: profile.height || "",
      weight: profile.weight || "",
      goalWeight: profile.goalWeight || "",
      age: profile.age || "",
      gender: profile.gender || "female",
      bloodType: profile.bloodType || "O+",
      goal: profile.goal || "maintain",
      avatarUrl: profile.avatarUrl || "",
    })
  }, [profile])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string
        setForm((prev) => ({ ...prev, avatarUrl: base64 }))
        await updateProfile({ avatarUrl: base64 })
        setToastMessage("Avatar updated successfully!")
        setTimeout(() => setToastMessage(""), 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateProfile(form)
    setSaving(false)
    setIsEditing(false)
    setToastMessage("Profile saved successfully!")
    setTimeout(() => setToastMessage(""), 3500)
  }

  let genderFallbackEmoji = "🧘"
  if (form.gender === "male") genderFallbackEmoji = "👨"
  else if (form.gender === "female") genderFallbackEmoji = "👩"

  const displayAvatar = form.avatarUrl || ""

  return (
    <DashboardLayout title={t("profileTitle") || "Profile"} subtitle={t("profileSubtitle") || "Manage your health identity"}>
      <div className="space-y-6 max-w-5xl mx-auto">

        {toastMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#E5F0DF] text-[#173B2D] border border-[#7EAA82]/30 shadow-xs animate-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4 text-[#7EAA82] shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Hero Section */}
        <div className="nature-card p-6 md:p-8 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar className="h-28 w-28 ring-4 ring-[#E5F0DF] shadow-sm rounded-full bg-white">
                <AvatarImage src={displayAvatar} alt={form.name || "User"} className="object-cover" />
                <AvatarFallback className="bg-[#FAF8F0] text-3xl">{genderFallbackEmoji}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-[#173B2D] text-white flex items-center justify-center shadow-md hover:scale-105 cursor-pointer transition-transform"
                    title="Change photo"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} id="avatar-upload" className="hidden" />
                </>
              )}
            </div>

            <div className="flex-1 text-center md:text-left mt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#172C23] font-serif">{form.name || "Health Seeker"}</h1>
              <p className="text-xs text-[#63736A] mt-1">{form.email}</p>
              <div className="mt-4">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className={`rounded-full px-5 py-2 text-xs font-semibold shadow-xs btn-hover ${!isEditing ? "bg-[#173B2D] hover:bg-[#102F24] text-white" : "border-[#E5E7DE] text-[#172C23] hover:bg-[#FAF8F0]"}`}
                >
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="nature-card stat-card-bmi p-5 rounded-2xl border border-[#F8DFD9] bg-[#FDF5F3] shadow-xs text-center">
            <span className="text-[10px] font-bold text-[#9E5748] uppercase tracking-wider">BMI</span>
            <p className="text-2xl font-bold text-[#172C23] mt-1">{bmi.value ? `${bmi.value}` : "--"}</p>
            <p className="text-[11px] text-[#2E6B40] font-semibold mt-1">{bmi.category || "--"}</p>
          </div>
          <div className="nature-card stat-card-calories p-5 rounded-2xl border border-[#DEECDA] bg-[#F3F8F1] shadow-xs text-center">
            <span className="text-[10px] font-bold text-[#4E7855] uppercase tracking-wider">Calories</span>
            <p className="text-2xl font-bold text-[#172C23] mt-1">{calories.target ? `${calories.target}` : "--"}</p>
            <p className="text-[11px] text-[#4E7855] font-semibold mt-1">kcal/day</p>
          </div>
          <div className="nature-card stat-card-water p-5 rounded-2xl border border-[#D8EBF7] bg-[#F0F7FC] shadow-xs text-center">
            <span className="text-[10px] font-bold text-[#34739A] uppercase tracking-wider">Hydration</span>
            <p className="text-2xl font-bold text-[#172C23] mt-1">8</p>
            <p className="text-[11px] text-[#2E8BC0] font-semibold mt-1">glasses/day</p>
          </div>
          <div className="nature-card p-5 rounded-2xl border border-[#E5E7DE] bg-white/95 shadow-xs text-center">
            <span className="text-[10px] font-bold text-[#63736A] uppercase tracking-wider">Goal</span>
            <p className="text-xl font-bold text-[#172C23] mt-1 capitalize">{form.goal}</p>
            <p className="text-[11px] text-[#7EAA82] font-semibold mt-1">Active</p>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className={`nature-card rounded-3xl border border-[#E5E7DE] bg-white/95 shadow-xs p-6 md:p-8 transition-opacity duration-300 ${!isEditing ? "opacity-75 pointer-events-none" : "opacity-100"}`}>
          <h3 className="text-base font-bold text-[#172C23] font-serif mb-6 pb-3 border-b border-[#E5E7DE]">
            {isEditing ? "Edit Your Details" : "Your Details"}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] mb-1.5 block">Full Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10 rounded-xl bg-[#FAF8F0] border-[#E5E7DE] text-sm text-[#172C23] focus:border-[#7EAA82]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] mb-1.5 block">Email</label>
                <Input value={form.email} readOnly className="h-10 rounded-xl bg-gray-50 border-[#E5E7DE] text-gray-500 text-sm cursor-not-allowed" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] mb-1.5 block">Phone Number</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-10 rounded-xl bg-[#FAF8F0] border-[#E5E7DE] text-sm text-[#172C23] focus:border-[#7EAA82]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] mb-1.5 block">City / Location</label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="h-10 rounded-xl bg-[#FAF8F0] border-[#E5E7DE] text-sm text-[#172C23] focus:border-[#7EAA82]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] mb-1.5 block">Gender</label>
                <select value={form.gender} onChange={(e: any) => setForm({ ...form, gender: e.target.value })} className="w-full h-10 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] px-3 text-xs text-[#172C23] focus:outline-none focus:border-[#7EAA82]">
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="others">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] mb-1.5 block">Blood Group</label>
                <select value={form.bloodType} onChange={(e) => setForm({ ...form, bloodType: e.target.value })} className="w-full h-10 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] px-3 text-xs text-[#172C23] focus:outline-none focus:border-[#7EAA82]">
                  {bloodGroups.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] mb-1.5 block">Age</label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="h-10 rounded-xl bg-[#FAF8F0] border-[#E5E7DE] text-sm text-[#172C23] focus:border-[#7EAA82]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] mb-1.5 block">Height (cm)</label>
                <Input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className="h-10 rounded-xl bg-[#FAF8F0] border-[#E5E7DE] text-sm text-[#172C23] focus:border-[#7EAA82]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] mb-1.5 block">Weight (kg)</label>
                <Input type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="h-10 rounded-xl bg-[#FAF8F0] border-[#E5E7DE] text-sm text-[#172C23] focus:border-[#7EAA82]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#63736A] mb-1.5 block">Primary Goal</label>
                <select value={form.goal} onChange={(e: any) => setForm({ ...form, goal: e.target.value })} className="w-full h-10 rounded-xl border border-[#E5E7DE] bg-[#FAF8F0] px-3 text-xs text-[#172C23] focus:outline-none focus:border-[#7EAA82]">
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Weight</option>
                </select>
              </div>
            </div>

            {isEditing && (
              <div className="pt-3 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl h-10 px-5 border-[#E5E7DE] text-[#63736A] hover:bg-[#FAF8F0] text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="rounded-xl h-10 px-6 bg-[#173B2D] hover:bg-[#102F24] text-white font-semibold text-xs shadow-xs">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </div>

      </div>
    </DashboardLayout>
  )
}