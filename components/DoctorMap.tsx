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

// 1. This "FlyTo" component handles the movement logic
function MapUpdater({ doctors }: { doctors: any[] }) {
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

export default function DoctorMap({ doctors }: { doctors: any[] }) {
  const jabalpurCenter: [number, number] = [23.1815, 79.9864];

  return (
    <div className="h-[400px] w-full">
      <MapContainer center={jabalpurCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* 2. Add the updater inside the MapContainer */}
        <MapUpdater doctors={doctors} />

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
      </MapContainer>
    </div>
  );
}