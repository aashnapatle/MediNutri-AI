"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'

// 1. Import the Map dynamically (SSR disabled)
const DoctorMap = dynamic(() => import('@/components/DoctorMap'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">Loading Jabalpur Map...</div>
});

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
          name: item.properties.name || "Healthcare Center",
          specialty: item.properties.categories[0]?.replace('.', ' ') || "Healthcare",
          location: item.properties.address_line1 || "Jabalpur",
          // Use real coordinates from the API for the map
          coordinates: [item.geometry.coordinates[1], item.geometry.coordinates[0]], 
          rating: 4.5,
          initials: "DR",
          bgColor: "bg-pink-100", // Changed to match your theme
        })) || []

      setDoctors(formatted)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const filteredDoctors = doctors.filter((doc) =>
    doc.location.toLowerCase().includes(search.toLowerCase()) ||
    doc.name.toLowerCase().includes(search.toLowerCase())
  )

  // 2. Function to open external map
  const handleViewOnMap = (name: string, location: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + location)}`;
    window.open(url, '_blank');
  }

  return (
    <DashboardLayout
      title="Find Best Doctors"
      subtitle="Connect with trusted healthcare professionals in Jabalpur"
    >
      <div className="flex flex-col gap-6">
        
        {/* 🔍 SEARCH & FILTERS */}
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search doctors or areas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full max-w-md rounded-xl shadow-sm focus:ring-2 focus:ring-pink-300 outline-none"
          />
        </div>

        {/* 🗺️ INTERACTIVE MAP SECTION */}
        <section className="rounded-2xl overflow-hidden shadow-lg border-4 border-white">
          <DoctorMap doctors={filteredDoctors} />
        </section>

        {/* ⏳ LOADING STATE */}
        {loading && (
          <div className="flex justify-center p-10">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        )}

        {/* 👇 DOCTORS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <Avatar className={`h-16 w-16 ${doctor.bgColor}`}>
                    <AvatarFallback className="text-pink-600 font-bold">{doctor.initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{doctor.specialty}</p>
                      </div>

                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg h-fit">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold">{doctor.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 text-pink-500" />
                      <span>{doctor.location}</span>
                    </div>

                    <Button 
                      className="mt-4 w-full md:w-auto rounded-xl bg-pink-500 hover:bg-pink-600"
                      onClick={() => handleViewOnMap(doctor.name, doctor.location)}
                    >
                      View on Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}