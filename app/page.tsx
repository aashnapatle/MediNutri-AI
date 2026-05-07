"use client";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-6">

      {/* 🔥 BACKGROUND TEXT */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-7xl md:text-9xl font-bold text-gray-300 opacity-20 animate-pulse tracking-widest">
          MEDINUTRI AI
        </div>
      </div>

      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 animate-bounce">
            🚀 Dashboard
          </h1>

          <button
            onClick={() => router.push("/login")}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:scale-110 transition"
          >
            🔓 Logout
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* USER CARD */}
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-xl hover:scale-105 transition animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-3">👤 User Info</h2>
            <p>✨ Name: User</p>
            <p>🎯 Goal: Weight Loss</p>
          </div>

          {/* DIET CARD */}
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-xl hover:scale-105 transition animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-3">🥗 Diet Plan</h2>
            <p>🍓 Breakfast: Oats + Fruits</p>
            <p>🍛 Lunch: Roti + Sabzi</p>
            <p>🥗 Dinner: Salad</p>
          </div>

          {/* CALORIES CARD */}
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-xl hover:scale-105 transition animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-3">📊 Calories</h2>
            <p>🔥 Target: 1800 kcal</p>
            <p>⚡ Consumed: 1200 kcal</p>
          </div>

        </div>
      </div>

      {/* ✨ ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}