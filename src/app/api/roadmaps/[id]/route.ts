import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roadmap } from "@/lib/db/schemas/roadmap";
import { auth } from "@/lib/auth/auth";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roadmapId = params.id;
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
