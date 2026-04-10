import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json(listProjects());
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    name: string;
    slug: string;
    status?: string;
  };

  const project = createProject({
    name: payload.name,
    slug: payload.slug,
    status: payload.status as "Active" | "AI Syncing" | "Paused" | undefined
  });
  return NextResponse.json(project, { status: 201 });
}
