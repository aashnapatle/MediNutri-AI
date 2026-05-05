"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, Calendar, Edit2 } from "lucide-react"

const userInfo = {
  name: "Aayush Kumar",
  email: "aayush@example.com",
  phone: "+91 98765 43210",
  location: "New Delhi, India",
  joinDate: "January 2024",
  avatar: "/placeholder-user.jpg",
  initials: "AK",
}

const healthStats = [
  { label: "Height", value: "175 cm" },
  { label: "Weight", value: "70 kg" },
  { label: "Age", value: "25 years" },
  { label: "Blood Type", value: "O+" },
]

export default function ProfilePage() {
  return (
    <DashboardLayout title="Profile" subtitle="Manage your personal information">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="rounded-2xl border-0 shadow-md lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {userInfo.initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Edit2 className="h-4 w-4" />
              </button>
            </div>

            <h2 className="text-xl font-semibold text-foreground mt-4">{userInfo.name}</h2>
            <p className="text-sm text-muted-foreground">Premium Member</p>

            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{userInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{userInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{userInfo.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined {userInfo.joinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="rounded-2xl border-0 shadow-md lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Edit Profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Full Name
                </label>
                <Input
                  defaultValue={userInfo.name}
                  className="h-12 rounded-xl border-border bg-secondary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  defaultValue={userInfo.email}
                  className="h-12 rounded-xl border-border bg-secondary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Phone
                </label>
                <Input
                  defaultValue={userInfo.phone}
                  className="h-12 rounded-xl border-border bg-secondary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Location
                </label>
                <Input
                  defaultValue={userInfo.location}
                  className="h-12 rounded-xl border-border bg-secondary/50"
                />
              </div>
            </div>

            <Button className="mt-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Health Stats */}
        <Card className="rounded-2xl border-0 shadow-md lg:col-span-3">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Health Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {healthStats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-semibold text-foreground mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
