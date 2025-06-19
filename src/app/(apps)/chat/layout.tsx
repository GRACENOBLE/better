import { AIHeader } from "@/components/ai/ai-header";
import { AISidebar } from "@/components/ai/ai-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <AISidebar variant="inset" />
      <SidebarInset className="max-h-[97.5vh]">
        <AIHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
