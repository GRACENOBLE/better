import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roadmap } from "@/lib/db/schemas/roadmap";
import { auth } from "@/lib/auth/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    console.log("Session in roadmaps API:", session);
    if (!session?.user?.id) {
      console.log("No session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching roadmaps for user:", session.user.id);
    const userRoadmaps = await db
      .select()
      .from(roadmap)
      .where(eq(roadmap.userId, session.user.id));

    console.log("Found roadmaps:", userRoadmaps);
    return NextResponse.json(userRoadmaps);
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, nodes, edges, metadata, progress } = body;

    if (!id || !title || !nodes || !edges) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if roadmap exists and belongs to user
    const existing = await db
      .select()
      .from(roadmap)
      .where(eq(roadmap.id, id))
      .limit(1);

    if (existing.length === 0 || existing[0].userId !== session.user.id) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    const updatedRoadmap = await db
      .update(roadmap)
      .set({
        title,
        nodes,
        edges,
        metadata,
        progress: progress || 0,
        updatedAt: new Date(),
      })
      .where(eq(roadmap.id, id))
      .returning();

    return NextResponse.json(updatedRoadmap[0]);
  } catch (error) {
    console.error("Error updating roadmap:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
