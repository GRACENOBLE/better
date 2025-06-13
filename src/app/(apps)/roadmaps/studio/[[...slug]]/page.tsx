import Canvas from "@/components/projections/canvas";
import { CanvasHeader } from "@/components/projections/canvas-header";
import { CanvasSidebar } from "@/components/projections/canvas-sidebar";
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
