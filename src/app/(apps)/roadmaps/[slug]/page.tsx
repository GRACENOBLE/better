"use client";

import Container from "@/components/common/container";
import Header from "@/components/layout/header";
import RoadmapRenderer from "@/components/roadmap-renderer";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect, useState, useCallback } from "react";

interface Roadmap {
  id: string;
  title: string;
  nodes: any[];
  edges: any[];
  metadata?: any;
  progress: number;
  createdAt: Date;
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [roadmapData, setRoadmapData] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [roadmapId, setRoadmapId] = useState<string | null>(null);

  // Resolve params once
  useEffect(() => {
    params.then((p) => setRoadmapId(p.slug));
  }, [params]);

  useEffect(() => {
    const loadRoadmap = async () => {
      if (!roadmapId || !session?.user?.id) return;

      try {
        const response = await fetch(`/api/roadmaps/${roadmapId}`);

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Loaded roadmap data:", {
          id: data.id,
          nodes: data.nodes.map((n: any) => ({ id: n.id, label: n.label, completed: n.completed }))
        });
        // Convert createdAt string to Date object
        setRoadmapData({
          ...data,
          createdAt: new Date(data.createdAt),
        });
      } catch (error) {
        console.error("Error loading roadmap:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [roadmapId, session]);

  const handleToggleComplete = useCallback(async (nodeId: string) => {
    console.log(`handleToggleComplete called for node ${nodeId}`);
    if (!roadmapData || !roadmapId) {
      console.log("Missing roadmapData or roadmapId");
      return;
    }

    try {
      console.log(`Making API call to update ${nodeId}`);
      const response = await fetch(`/api/roadmaps/${roadmapId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodeId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("API response:", result);
        // Update local state with new completion status
        setRoadmapData((prev) => {
          const newData = prev
            ? {
                ...prev,
                progress: result.overallProgress,
                nodes: prev.nodes.map((node) =>
                  node.id === nodeId
                    ? { ...node, completed: !node.completed }
                    : node
                ),
              }
            : null;
          console.log("Updated roadmapData:", newData);
          return newData;
        });
      } else {
        console.error("API call failed:", response.status);
      }
    } catch (error) {
      console.error("Error updating completion:", error);
    }
  }, [roadmapData, roadmapId]);

  if (loading) {
    return (
      <>
        <Header user={session?.user} />
        <section className="pt-32 pb-8">
          <Container>
            <div className="flex justify-center items-center h-64">
              <div>Loading roadmap...</div>
            </div>
          </Container>
        </section>
      </>
    );
  }

  if (!session?.user?.id || !roadmapData) {
    notFound();
    return null;
  }

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
              <Link href={`/roadmaps/studio/${roadmapId}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Roadmap
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">{roadmapData.title}</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Progress: {roadmapData.progress}%</span>
              <span>Created: {roadmapData.createdAt.toLocaleDateString()}</span>
              <span className="text-blue-600">
                Right-click items to mark as complete
              </span>
            </div>
          </div>
          <div className="h-[600px] border rounded-lg">
            <ReactFlowProvider>
              <RoadmapRenderer
                roadmapData={roadmapData}
                onToggleComplete={handleToggleComplete}
                readOnly={false}
              />
            </ReactFlowProvider>
          </div>
        </Container>
      </section>
    </>
  );
}
