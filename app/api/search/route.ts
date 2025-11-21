import { AiFactory } from "@/app/lib/ai/AiFactory";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic,model,inst } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
      
    }

    var provider = model;
    const ai = AiFactory.create(provider);
    const data = await ai.generatePersona(topic,inst);

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate persona" },
      { status: 500 }
    );
  }
}
