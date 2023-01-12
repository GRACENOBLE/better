import Canvas from "@/components/projections/canvas";
import { CanvasHeader } from "@/components/projections/canvas-header";
import { CanvasSidebar } from "@/components/projections/canvas-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactFlowProvider } from "@xyflow/react";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { roadmap } from "@/lib/db/schemas/roadmap";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: Promise<{ slug?: string[] }> }) => {
  const { slug } = await params;
  const roadmapId = slug?.[0];

  let initialRoadmap = null;

  if (roadmapId) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      notFound();
    }

    try {
      const userRoadmap = await db
        .select()
        .from(roadmap)
        .where(eq(roadmap.id, roadmapId))
        .limit(1);

      if (
        userRoadmap.length === 0 ||
        userRoadmap[0].userId !== session.user.id
      ) {
        notFound();
      }

      initialRoadmap = {
        ...userRoadmap[0],
        nodes: userRoadmap[0].nodes as any[],
        edges: userRoadmap[0].edges as any[],
        metadata: userRoadmap[0].metadata as any,
        progress: userRoadmap[0].progress || 0,
      };
    } catch (error) {
      console.error("Error loading roadmap for editing:", error);
      notFound();
    }
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <CanvasSidebar variant="inset" />
      <SidebarInset>
        <CanvasHeader />
        <ReactFlowProvider>
          <Canvas initialRoadmap={initialRoadmap} />
        </ReactFlowProvider>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default page;
