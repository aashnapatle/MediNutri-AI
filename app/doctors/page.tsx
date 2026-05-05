"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin } from "lucide-react"

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const res = await fetch(
        `https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:79.9864,23.1815,10000&limit=10&apiKey=a5f4f9a9178b47f1b91f41b6573b53ad`
      )

      const data = await res.json()
      console.log("API:", data)

      const formatted =
        data.features?.map((item: any, i: number) => ({
          id: i,
          name: item.properties.name || "Doctor",
          location: item.properties.address_line1 || "No address",
          rating: 4.5,
        })) || []

      setDoctors(formatted)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Jabalpur Doctors</h1>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doc) => (
          <Card key={doc.id} className="rounded-2xl shadow-md">
            <CardContent className="p-5">
              <div className="flex gap-4">

                <Avatar className="h-16 w-16 bg-blue-100">
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{doc.name}</h3>
                      <p className="text-sm text-gray-500">Healthcare</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{doc.location}</span>
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
    </div>
  )
}