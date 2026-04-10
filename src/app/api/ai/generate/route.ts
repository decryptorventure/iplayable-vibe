import { NextResponse } from "next/server";
import { generateVariantConfig } from "@/lib/openai";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    prompt: string;
    context?: Record<string, unknown>;
  };

  if (!payload.prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  try {
    const config = await generateVariantConfig(payload.prompt, payload.context ?? {});
    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json(
      { error: "AI generation failed", detail: String(error) },
      { status: 500 }
    );
  }
}
