"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin } from "lucide-react"

const doctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "Nutritionist",
    location: "Delhi, India",
    rating: 4.8,
    image: "/placeholder-doctor-1.jpg",
    initials: "PS",
    bgColor: "bg-pink-100",
  },
  {
    id: 2,
    name: "Dr. Rahul Verma",
    specialty: "General Physician",
    location: "Mumbai, India",
    rating: 4.7,
    image: "/placeholder-doctor-2.jpg",
    initials: "RV",
    bgColor: "bg-blue-100",
  },
  {
    id: 3,
    name: "Dr. Anjali Mehta",
    specialty: "Dietician",
    location: "Bangalore, India",
    rating: 4.9,
    image: "/placeholder-doctor-3.jpg",
    initials: "AM",
    bgColor: "bg-green-100",
  },
  {
    id: 4,
    name: "Dr. Amit Patel",
    specialty: "Fitness Expert",
    location: "Pune, India",
    rating: 4.6,
    image: "/placeholder-doctor-4.jpg",
    initials: "AP",
    bgColor: "bg-purple-100",
  },
  {
    id: 5,
    name: "Dr. Sneha Gupta",
    specialty: "Endocrinologist",
    location: "Hyderabad, India",
    rating: 4.8,
    image: "/placeholder-doctor-5.jpg",
    initials: "SG",
    bgColor: "bg-orange-100",
  },
  {
    id: 6,
    name: "Dr. Vikram Singh",
    specialty: "Sports Medicine",
    location: "Chennai, India",
    rating: 4.5,
    image: "/placeholder-doctor-6.jpg",
    initials: "VS",
    bgColor: "bg-teal-100",
  },
]

export default function DoctorsPage() {
  return (
    <DashboardLayout
      title="Find Best Doctors"
      subtitle="Connect with trusted healthcare professionals"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="rounded-2xl border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className={`h-16 w-16 ${doctor.bgColor}`}>
                  <AvatarImage src={doctor.image} alt={doctor.name} />
                  <AvatarFallback className={`${doctor.bgColor} text-foreground font-semibold text-lg`}>
                    {doctor.initials}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground truncate">{doctor.name}</h3>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-foreground">{doctor.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.location}</span>
                  </div>

                  <Button
                    variant="outline"
                    className="mt-3 rounded-xl border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
