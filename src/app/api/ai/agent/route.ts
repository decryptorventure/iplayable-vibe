import { NextResponse } from "next/server";
import { processAgentQuery } from "@/lib/ai/agent-orchestrator";

export async function POST(request: Request) {
  const { message } = (await request.json()) as { message: string };

  if (!message?.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  try {
    // Simulate slight delay for realism
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 800));
    const result = processAgentQuery(message);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { content: "⚠️ Có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại.", citations: [], followUps: [] },
      { status: 500 }
    );
  }
}
