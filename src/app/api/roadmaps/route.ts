import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roadmap } from "@/lib/db/schemas/roadmap";
import { auth } from "@/lib/auth/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRoadmaps = await db
      .select()
      .from(roadmap)
      .where(eq(roadmap.userId, session.user.id));

    return NextResponse.json(userRoadmaps);
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, nodes, edges, metadata, progress } = body;

    if (!title || !nodes || !edges) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRoadmap = await db
      .insert(roadmap)
      .values({
        id: `roadmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        title,
        nodes,
        edges,
        metadata,
        progress: progress || 0,
      })
      .returning();

    return NextResponse.json(newRoadmap[0]);
  } catch (error) {
    console.error("Error saving roadmap:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}