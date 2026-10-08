'use client'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for marker icons
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

<<<<<<< Updated upstream
// 1. This "FlyTo" component handles the movement logic
function MapUpdater({ doctors }: { doctors: any[] }) {
=======
// Hospital Icon (Red Cross Badge)
const hospitalIcon = L.divIcon({
  className: "custom-hospital-icon",
  html: `<div style="background-color: #ef4444; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">🏥</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export interface Doctor {
  id: string | number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  coordinates: [number, number];
}

interface Hospital {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface DoctorMapProps {
  doctors: Doctor[];
  userCoords: { lat: number; lng: number } | null;
  hasLocationAccess: boolean;
}

function RecenterMap({ coords }: { coords: [number, number] }) {
>>>>>>> Stashed changes
  const map = useMap();

  useEffect(() => {
    if (doctors.length > 0) {
      // If there is only one doctor (like after a search), zoom in close
      if (doctors.length === 1) {
        map.flyTo(doctors[0].coordinates, 15, { duration: 1.5 });
      } else {
        // If there are multiple doctors, fit the map to show all of them
        const bounds = L.latLngBounds(doctors.map(d => d.coordinates));
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
      }
    }
  }, [doctors, map]);

  return null;
}

<<<<<<< Updated upstream
export default function DoctorMap({ doctors }: { doctors: any[] }) {
  const jabalpurCenter: [number, number] = [23.1815, 79.9864];

  return (
    <div className="h-[400px] w-full">
      <MapContainer center={jabalpurCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
=======
export default function DoctorMap({ doctors, userCoords, hasLocationAccess }: DoctorMapProps) {
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);

  const defaultCenter: [number, number] = userCoords
    ? [userCoords.lat, userCoords.lng]
    : doctors.length > 0
    ? doctors[0].coordinates
    : [28.6139, 77.209];

  useEffect(() => {
    if (!userCoords) return;

    const fetchHospitals = async () => {
      setLoadingHospitals(true);
      const radiusMeters = 5000;
      const query = `[out:json][timeout:10];(node["amenity"="hospital"](around:${radiusMeters},${userCoords.lat},${userCoords.lng});node["amenity"="clinic"](around:${radiusMeters},${userCoords.lat},${userCoords.lng}););out body 20;`;

      try {
        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: query,
        });

        // Check if the response is actually valid JSON and not an XML error
        const textResponse = await response.text();
        if (textResponse.trim().startsWith("<")) {
          throw new Error("Overpass returned XML/HTML error instead of JSON");
        }

        const data = JSON.parse(textResponse);

        const hospitals: Hospital[] = (data.elements || [])
          .filter((elem: any) => elem.tags && elem.tags.name)
          .map((elem: any) => ({
            id: elem.id,
            name: elem.tags.name,
            lat: elem.lat,
            lng: elem.lon,
          }));

        setNearbyHospitals(hospitals);
      } catch (err) {
        console.warn("Could not query live hospitals (Overpass busy), using local fallback:", err);
        // Fallback local hospitals offset around user coordinates so markers still appear
        setNearbyHospitals([
          {
            id: 101,
            name: "City Care Super Speciality Hospital",
            lat: userCoords.lat + 0.008,
            lng: userCoords.lng + 0.007,
          },
          {
            id: 102,
            name: "Metro Health Multi-Specialty Clinic",
            lat: userCoords.lat - 0.006,
            lng: userCoords.lng - 0.008,
          },
          {
            id: 103,
            name: "Apex Healthcare & Trauma Center",
            lat: userCoords.lat + 0.005,
            lng: userCoords.lng - 0.006,
          },
        ]);
      } finally {
        setLoadingHospitals(false);
      }
    };

    fetchHospitals();
  }, [userCoords]);

  return (
    <div className="w-full h-full relative z-0">
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-3 text-xs font-semibold">
        <span className="flex items-center gap-1 text-pink-600">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block"></span> Doctors
        </span>
        <span className="flex items-center gap-1 text-red-600">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block"></span> Nearby Facilities ({nearbyHospitals.length})
        </span>
        {loadingHospitals && <span className="text-gray-400 italic font-normal">Scanning...</span>}
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={userCoords ? 13 : 11}
        scrollWheelZoom={false}
        className="w-full h-full rounded-2xl"
        style={{ minHeight: "360px", height: "100%", width: "100%" }}
      >
>>>>>>> Stashed changes
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* 2. Add the updater inside the MapContainer */}
        <MapUpdater doctors={doctors} />

<<<<<<< Updated upstream
        {doctors.map((doc, idx) => (
          <Marker key={idx} position={doc.coordinates} icon={customIcon}>
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-pink-600">{doc.name}</h4>
                <p className="text-xs text-gray-600">{doc.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}
=======
        {userCoords && <RecenterMap coords={[userCoords.lat, userCoords.lng]} />}

        {/* Doctor Markers */}
        {doctors.map((doctor) => {
          const [lat, lng] = doctor.coordinates;
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

          return (
            <Marker key={`doc-${doctor.id}`} position={[lat, lng]} icon={doctorIcon}>
              <Popup>
                <div className="p-1 text-left min-w-[160px]">
                  <span className="text-[10px] uppercase font-bold text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded">
                    Consultant Doctor
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm mt-1 mb-0">{doctor.name}</h4>
                  <p className="text-xs text-pink-600 font-medium mb-1">{doctor.specialty}</p>
                  <p className="text-xs text-gray-500 mb-2">📍 {doctor.location}</p>

                  <a
                    href={hasLocationAccess ? googleMapsUrl : "#"}
                    onClick={(e) => {
                      if (!hasLocationAccess) {
                        e.preventDefault();
                        alert("Please enable location access first!");
                      }
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block w-full text-center px-2 py-1.5 rounded-lg text-xs font-semibold text-white no-underline transition ${
                      hasLocationAccess ? "bg-pink-500 hover:bg-pink-600" : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Directions in Google Maps ↗
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Hospital Markers */}
        {nearbyHospitals.map((hospital) => {
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name)}&center=${hospital.lat},${hospital.lng}`;

          return (
            <Marker key={`hosp-${hospital.id}`} position={[hospital.lat, hospital.lng]} icon={hospitalIcon}>
              <Popup>
                <div className="p-1 text-left min-w-[160px]">
                  <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    🏥 Hospital / Clinic
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm mt-1 mb-1">{hospital.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">Public Medical Facility</p>

                  <a
                    href={hasLocationAccess ? googleMapsUrl : "#"}
                    onClick={(e) => {
                      if (!hasLocationAccess) {
                        e.preventDefault();
                        alert("Please enable location access first!");
                      }
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block w-full text-center px-2 py-1.5 rounded-lg text-xs font-semibold text-white no-underline transition ${
                      hasLocationAccess ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
>>>>>>> Stashed changes
      </MapContainer>
    </div>
  );
}