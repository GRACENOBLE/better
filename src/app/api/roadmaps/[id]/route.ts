import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roadmap } from "@/lib/db/schemas/roadmap";
import { auth } from "@/lib/auth/auth";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roadmapId } = await params;
    const userRoadmap = await db
      .select()
      .from(roadmap)
      .where(eq(roadmap.id, roadmapId))
      .limit(1);

    if (userRoadmap.length === 0 || userRoadmap[0].userId !== session.user.id) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    return NextResponse.json(userRoadmap[0]);
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roadmapId } = await params;
    const body = await request.json();
    const { nodeId, completed } = body;

    if (typeof completed !== 'boolean') {
      return NextResponse.json({ error: "Invalid completed value" }, { status: 400 });
    }

    // Get current roadmap
    const currentRoadmap = await db
      .select()
      .from(roadmap)
      .where(eq(roadmap.id, roadmapId))
      .limit(1);

    if (currentRoadmap.length === 0 || currentRoadmap[0].userId !== session.user.id) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    const roadmapData = currentRoadmap[0];
    const nodes = roadmapData.nodes as any[];

    // Update completion status for the specific node (toggle it)
    const updatedNodes = nodes.map(node =>
      node.id === nodeId ? { ...node, completed: !node.completed } : node
    );

    // Calculate overall progress as percentage of completed nodes
    const completedCount = updatedNodes.filter(node => node.completed).length;
    const overallProgress = Math.round((completedCount / nodes.length) * 100);

    // Update the roadmap with new nodes and overall progress
    await db
      .update(roadmap)
      .set({
        nodes: updatedNodes,
        progress: overallProgress,
        updatedAt: new Date(),
      })
      .where(eq(roadmap.id, roadmapId));

    return NextResponse.json({ success: true, overallProgress });
  } catch (error) {
    console.error("Error updating roadmap progress:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
