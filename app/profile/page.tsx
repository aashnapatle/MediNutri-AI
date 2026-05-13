"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, Calendar, Edit2 } from "lucide-react"

import { auth } from "@/lib/auth"
import { db } from "@/lib/firestore"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth" // ⭐ added

export default function ProfilePage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    height: "",
    weight: "",
    age: "",
    bloodType: "",
  })

  // 🔥 LOAD DATA (FIXED)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return

      const snap = await getDoc(doc(db, "users", user.uid))

      if (snap.exists()) {
        setForm({
          name: snap.data().name || "",
          email: snap.data().email || user.email || "",
          phone: snap.data().phone || "",
          location: snap.data().location || "",
          height: snap.data().height || "",
          weight: snap.data().weight || "",
          age: snap.data().age || "",
          bloodType: snap.data().bloodType || "",
        })
      } else {
        setForm((prev) => ({
          ...prev,
          email: user.email || "",
        }))
      }
    })

    return () => unsubscribe()
  }, [])

  // 🔥 SAVE DATA (FIXED)
  const handleSave = async () => {
    const user = auth.currentUser
    if (!user) return alert("Login first")

    await setDoc(
      doc(db, "users", user.uid),
      {
        ...form,
        email: auth.currentUser?.email, // ⭐ protect email
      },
      { merge: true } // ⭐ prevent overwrite
    )

    alert("Saved ✅")
  }

  return (
    <DashboardLayout title="Profile" subtitle="Manage your personal information">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <Card className="rounded-2xl border-0 shadow-md lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {form.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Edit2 className="h-4 w-4" />
              </button>
            </div>

            <h2 className="text-xl font-semibold text-foreground mt-4">{form.name}</h2>

            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{form.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{form.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{form.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">User Data</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="rounded-2xl border-0 shadow-md lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Edit Profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
                className="h-12 rounded-xl"
              />

              <Input
                value={form.email}
                placeholder="Your email"
                readOnly
                className="h-12 rounded-xl"
              />

              <Input
                value={form.phone}
                placeholder="Enter phone number"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  if (value.length <= 10) {
                    setForm({ ...form, phone: value })
                  }
                }}
                className="h-12 rounded-xl"
              />

              <Input
                value={form.location}
                placeholder="Enter your location"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="h-12 rounded-xl"
              />

              <Input
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                placeholder="Height (cm)"
              />

              <Input
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="Weight (kg)"
              />

              <Input
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="Age"
              />

              <Input
                value={form.bloodType}
                onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
                placeholder="Blood Type (O+, A+)"
              />

            </div>

            <Button onClick={handleSave} className="mt-6 rounded-xl">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Health Stats */}
        <Card className="rounded-2xl border-0 shadow-md lg:col-span-3">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Health Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-secondary/30">
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-xl font-semibold">{form.height || "--"}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/30">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-xl font-semibold">{form.weight || "--"}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/30">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-xl font-semibold">{form.age || "--"}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/30">
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="text-xl font-semibold">{form.bloodType || "--"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}