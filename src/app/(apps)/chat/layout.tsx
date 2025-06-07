import { AIHeader } from "@/components/ai/ai-header";
import { AISidebar } from "@/components/ai/ai-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AISidebar variant="inset" />

      <SidebarInset className="overflow-auto">
        <AIHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
