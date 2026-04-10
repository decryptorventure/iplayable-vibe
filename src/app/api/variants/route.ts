import { NextResponse } from "next/server";
import { createVariant, listVariantsByProject } from "@/lib/mock-db";
import { mockGeneratedConfig } from "@/lib/openai";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  const variants = listVariantsByProject(projectId);
  if (variants.length > 0) {
    return NextResponse.json(variants);
  }

  return NextResponse.json([
    {
      id: "mock-var-1",
      projectId,
      name: "Neon Christmas v1",
      config: mockGeneratedConfig("neon"),
      status: "Draft"
    }
  ]);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    projectId: string;
    name: string;
    config: ReturnType<typeof mockGeneratedConfig>;
    status?: string;
  };

  const variant = createVariant({
    projectId: payload.projectId,
    name: payload.name,
    config: payload.config,
    status: payload.status as "Draft" | "Ready" | "Deployed" | undefined
  });
  return NextResponse.json(variant, { status: 201 });
}
