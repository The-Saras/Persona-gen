import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const url =
      "https://terracez-sales-ai.cognitiveservices.azure.com/openai/deployments/gpt-5-mini/chat/completions?api-version=2025-01-01-preview";

    const response = await axios.post(
      url,
      {
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_completion_tokens: 16384,
        model: "gpt-5-mini",
      },
      {
        headers: {
          "api-key": process.env.OPENAI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data?.choices?.[0]?.message?.content || "";

    // ✅ FIXED: must return a NextResponse
    return NextResponse.json({ data: text });

  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate persona" },
      { status: 500 }
    );
  }
}
