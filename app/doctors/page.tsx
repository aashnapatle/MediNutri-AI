"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/sidebar";
import { Doctor } from "@/components/DoctorMap";

const DoctorMap = dynamic(() => import("@/components/DoctorMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-pink-50/50 rounded-2xl flex items-center justify-center border border-pink-100 text-pink-500 font-medium">
      Loading interactive map...
    </div>
  ),
});

const doctorsList: Doctor[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "Nutritionist",
    location: "Delhi, India",
    rating: 4.8,
    coordinates: [28.6139, 77.209],
  },
  {
    id: 2,
    name: "Dr. Rahul Verma",
    specialty: "General Physician",
    location: "Mumbai, India",
    rating: 4.7,
    coordinates: [19.076, 72.8777],
  },
  {
    id: 3,
    name: "Dr. Anjali Mehta",
    specialty: "Dietician",
    location: "Bangalore, India",
    rating: 4.9,
    coordinates: [12.9716, 77.5946],
  },
  {
    id: 4,
    name: "Dr. Amit Patel",
    specialty: "Fitness Expert",
    location: "Pune, India",
    rating: 4.6,
    coordinates: [18.5204, 73.8567],
  },
  {
    id: 5,
    name: "Dr. Sneha Gupta",
    specialty: "Endocrinologist",
    location: "Hyderabad, India",
    rating: 4.8,
    coordinates: [17.385, 78.4867],
  },
  {
    id: 6,
    name: "Dr. Vikram Singh",
    specialty: "Sports Medicine",
    location: "Chennai, India",
    rating: 4.5,
    coordinates: [13.0827, 80.2707],
  },
];

export default function DoctorsPage() {
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [hasLocationAccess, setHasLocationAccess] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const savedPermission = localStorage.getItem("doctor_location_permission");
    if (savedPermission === "granted") {
      setHasLocationAccess(true);
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserCoords({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => console.warn("GPS lookup failed:", err.message)
        );
      }
    } else {
      setShowLocationPrompt(true);
    }
  }, []);

  const handleAllowLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setHasLocationAccess(true);
          setShowLocationPrompt(false);
          localStorage.setItem("doctor_location_permission", "granted");
        },
        (error) => {
          console.warn("Location error:", error.message);
          setHasLocationAccess(true);
          setShowLocationPrompt(false);
          localStorage.setItem("doctor_location_permission", "granted");
        }
      );
    } else {
      setHasLocationAccess(true);
      setShowLocationPrompt(false);
      localStorage.setItem("doctor_location_permission", "granted");
    }
  };

  const handleDenyLocation = () => {
    setHasLocationAccess(false);
    setShowLocationPrompt(false);
  };

  const handleMapRedirect = (doctor: Doctor) => {
    if (!hasLocationAccess) {
      setShowLocationPrompt(true);
      return;
    }

    const [docLat, docLng] = doctor.coordinates;
    const destination = `${docLat},${docLng}`;

    const mapUrl = userCoords
      ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${destination}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    window.open(mapUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex min-h-screen bg-[#FFF9F9]">
      {/* 1. Permanent Left Sidebar */}
      <Sidebar />

      {/* 2. Main Page Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Permission Modal */}
        {showLocationPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                📍
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Enable Location Services?
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Allow location access to view hospitals nearby on the map and enable direct navigation via Google Maps.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDenyLocation}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Not Now
                </button>
                <button
                  onClick={handleAllowLocation}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition shadow-sm shadow-pink-200"
                >
                  Allow Location
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find Best Doctors</h1>
            <p className="text-sm text-gray-500">
              Connect with trusted healthcare professionals & find nearby medical facilities
            </p>
          </div>

          <div>
            {hasLocationAccess ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Location Active
              </span>
            ) : (
              <button
                onClick={() => setShowLocationPrompt(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200 hover:bg-amber-100 transition"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Location Disabled (Click to Enable)
              </button>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full h-96 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white mb-8">
          <DoctorMap
            doctors={doctorsList}
            userCoords={userCoords}
            hasLocationAccess={hasLocationAccess}
          />
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctorsList.map((doctor) => {
            const initials = doctor.name
              .replace(/^Dr\.\s*/i, "")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition"
              >
                <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {doctor.name}
                    </h3>
                    <span className="text-sm font-semibold text-amber-500 flex items-center gap-1">
                      ★ {doctor.rating}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-0.5">{doctor.specialty}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    📍 {doctor.location}
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <button className="px-4 py-1.5 border border-pink-500 text-pink-500 text-xs font-medium rounded-full hover:bg-pink-50 transition">
                      View Profile
                    </button>

                    <button
                      onClick={() => handleMapRedirect(doctor)}
                      className={`px-4 py-1.5 text-xs font-medium rounded-full transition flex items-center gap-1.5 ${
                        hasLocationAccess
                          ? "bg-pink-500 text-white hover:bg-pink-600 shadow-sm"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200 cursor-pointer"
                      }`}
                    >
                      <span>See on Map</span>
                      <span>{hasLocationAccess ? "📍" : "🔒"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}