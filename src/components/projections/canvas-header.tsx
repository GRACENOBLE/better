"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useStore } from "@/hooks/zustand";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useRoadmapStore } from "@/lib/stores/roadmap-store";
import { useRouter } from "next/navigation";

export function CanvasHeader() {
  const roadmapData = useStore((state: any) => state.roadmapData);
  const { currentRoadmap } = useRoadmapStore();
  const router = useRouter();

  const handleSave = async () => {
    if (!currentRoadmap) return;

    try {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: roadmapData?.metadata.topic || "My custom roadmap",
          nodes: currentRoadmap.nodes,
          edges: currentRoadmap.edges,
          metadata: currentRoadmap.metadata,
          progress: 0, // Manual roadmaps start at 0
        }),
      });
      if (res.ok) {
        router.push("/roadmaps");
      } else {
        console.error("Failed to save roadmap");
      }
    } catch (error) {
      console.error("Error saving roadmap:", error);
    }
  };

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {roadmapData?.metadata.topic || "My custom roadmap"}
        </h1>
        <div className="ml-auto">
          <Button onClick={handleSave} size="sm" variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Roadmap
          </Button>
        </div>
      </div>
    </header>
  );
}
