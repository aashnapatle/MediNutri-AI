import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        // 🔥 IMPORTANT: apni FULL API key yaha paste kar (space ya cut mat ho)
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // 🔥 stable model
        messages: [
          {
            role: "system",
            content: "content: You are a professional nutritionist. Always give practical meal plans, diet suggestions, calorie breakdowns. Do NOT say consult a doctor. Give direct helpful answers.",
          },
          {
            role: "user",
            content: message || "Hello",
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("FULL DATA:", data); // debug

    // 🔥 error handling
    if (!data.choices) {
      return NextResponse.json({
        output: "❌ API ERROR: " + JSON.stringify(data),
      });
    }

    return NextResponse.json({
      output: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      { output: "❌ Server error" },
      { status: 500 }
    );
  }
}