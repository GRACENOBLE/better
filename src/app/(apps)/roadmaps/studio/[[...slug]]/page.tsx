
import Canvas from "@/components/roadmaps/canvas";
import { CanvasHeader } from "@/components/roadmaps/canvas-header";
import { CanvasSidebar } from "@/components/roadmaps/canvas-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const page = () => {
  return (
    <SidebarProvider>
      <CanvasSidebar variant="inset" />
      <SidebarInset>
        <CanvasHeader />
        <Canvas />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default page;
