import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=AIzaSyCIiyIoMX1jqaJY1aWZxiILiqzr-GbeOe0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message || "Hello",
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("DATA:", data);

    if (data.error) {
      return NextResponse.json({
        output: "❌ " + data.error.message,
      });
    }

    return NextResponse.json({
      output:
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "❌ No response",
    });

  } catch (error) {
    return NextResponse.json(
      { output: "❌ Server error" },
      { status: 500 }
    );
  }
}