import Canvas from "@/components/projections/canvas";
import { CanvasHeader } from "@/components/projections/canvas-header";
import { CanvasSidebar } from "@/components/projections/canvas-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactFlowProvider } from "@xyflow/react";

const page = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <CanvasSidebar variant="inset" />
      <SidebarInset>
        <CanvasHeader />
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default page;
