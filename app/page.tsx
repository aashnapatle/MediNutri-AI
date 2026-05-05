"use client";
import { useState } from "react";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");

  const doctors = [
    { name: "Hind Spine Clinic", city: "Jabalpur" },
    { name: "Umang Speech Clinic", city: "Bhopal" },
    { name: "Sultania Hospital", city: "Bhopal" },
    { name: "CHC Gandhinagar", city: "Jabalpur" },
  ];

  const filteredDoctors = doctors.filter((doc) =>
    doc.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Nearby Doctors 🩺</h1>

      <input
        type="text"
        placeholder="Search by city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "250px",
        }}
      />

      {filteredDoctors.map((doc, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
        >
          <h3>{doc.name}</h3>
          <p>{doc.city}</p>
        </div>
      ))}
    </div>
  );
}