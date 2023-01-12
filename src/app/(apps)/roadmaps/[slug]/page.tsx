import Container from "@/components/common/container";
import Header from "@/components/layout/header";
import RoadmapRenderer from "@/components/roadmap-renderer";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { roadmap } from "@/lib/db/schemas/roadmap";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { ReactFlowProvider } from "@xyflow/react";

interface Roadmap {
  id: string;
  title: string;
  nodes: any[];
  edges: any[];
  metadata?: any;
  progress: number;
  createdAt: Date;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
      .where(eq(roadmap.id, slug))
      .limit(1);

    if (userRoadmap.length === 0 || userRoadmap[0].userId !== session.user.id) {
      notFound();
    }

    const roadmapData: Roadmap = {
      ...userRoadmap[0],
      nodes: userRoadmap[0].nodes as any[],
      edges: userRoadmap[0].edges as any[],
      metadata: userRoadmap[0].metadata as any,
      progress: userRoadmap[0].progress || 0,
    };

    console.log("Loaded roadmap data:", roadmapData);

    console.log("Rendering roadmap viewer for:", roadmapData.title);

    return (
      <>
        <Header user={session.user} />
        <section className="pt-32 pb-8">
          <Container>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Link href="/roadmaps">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Roadmaps
                  </Button>
                </Link>
                <Link href={`/roadmaps/studio/${slug}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Roadmap
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold mb-2">{roadmapData.title}</h1>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Progress: {roadmapData.progress}%</span>
                <span>
                  Created: {roadmapData.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="h-[600px] border rounded-lg">
              <ReactFlowProvider>
                <RoadmapRenderer roadmapData={roadmapData} />
              </ReactFlowProvider>
            </div>
          </Container>
        </section>
      </>
    );
  } catch (error) {
    console.error("Error loading roadmap:", error);
    notFound();
  }
}
