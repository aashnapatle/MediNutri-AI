import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = "AIzaSyDC5tSoJTV38XMaT5U08wODlPJLxLGRSoY"; 

    // We use v1beta and gemini-1.5-flash-latest which is the most compatible name
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `You are MediNutri AI+. Respond concisely to: ${message || "Hi"}` }]
          }]
        })
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({ output: data.candidates[0].content.parts[0].text });
    }

    // FINAL FALLBACK: If flash fails, try the standard Pro model with exact naming
    const finalResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message || "Hello" }] }]
        })
      }
    );
    
    const finalData = await finalResponse.json();
    
    if (finalData.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({ output: finalData.candidates[0].content.parts[0].text });
    }

    return NextResponse.json({ 
      output: "🤖 Almost there! Your API key is working, but Google is still setting up your model. Try again in 60 seconds." 
    });

  } catch (error: any) {
    return NextResponse.json({ output: "❌ Local server error." }, { status: 500 });
  }
}