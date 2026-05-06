"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

export default function DoctorsPage() {
  const [search, setSearch] = useState("")
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const res = await fetch(
        "https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:79.9864,23.1815,10000&limit=10&apiKey=a5f4f9a9178b47f1b91f41b6573b53ad"
      )

      const data = await res.json()

      const formatted =
        data.features?.map((item: any, i: number) => ({
          id: i,
          name: item.properties.name || "Doctor",
          specialty: "Healthcare",
          location: item.properties.address_line1 || "No address",
          rating: 4.5,
          initials: "DR",
          bgColor: "bg-blue-100",
        })) || []

      setDoctors(formatted)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const filteredDoctors = doctors.filter((doc) =>
    doc.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout
      title="Find Best Doctors"
      subtitle="Connect with trusted healthcare professionals"
    >
      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-60 rounded-lg"
      />

      {/* ⏳ LOADING */}
      {loading && <p>Loading...</p>}

      {/* 👇 DOCTORS UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="rounded-2xl shadow-md">
            <CardContent className="p-5">
              <div className="flex gap-4">

                <Avatar className={`h-16 w-16 ${doctor.bgColor}`}>
                  <AvatarFallback>{doctor.initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{doctor.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.location}</span>
                  </div>

                  <Button className="mt-3 rounded-xl">
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