import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = "AIzaSyBcFqONYpKbfQxPvSgqFfq8A3UWetoK8W4"; 

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 1. Give the AI its personality here
          system_instruction: {
            parts: [{ text: "You are MediNutri AI+, a helpful health assistant. Keep answers short and friendly." }]
          },
          // 2. Pass the user's message here
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API Error:", data);
      return NextResponse.json({ error: data.error?.message || "API Error" }, { status: response.status });
    }

    const aiText = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ output: aiText });

  } catch (error: any) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ error: "Connection Failed" }, { status: 500 });
  }
}