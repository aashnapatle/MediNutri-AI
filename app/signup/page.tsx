"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    alert("Account created 🎉");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[url('/sign-up.png')] bg-cover bg-center flex items-center justify-center">

      {/* same login style card */}
      <div className="backdrop-blur-2xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-white/40 bg-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-white/40 bg-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Sign Up
          </button>

        </form>

        {/* extra like login */}
        <p className="text-center text-sm mt-4 text-gray-700">
          Already have an account?{" "}
          <span
            className="text-purple-600 cursor-pointer font-medium"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}