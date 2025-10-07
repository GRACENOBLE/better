import { AIHeader } from "@/components/ai/ai-header";
import { AISidebar } from "@/components/ai/ai-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/sign-in");
  }
  return (
    <SidebarProvider defaultOpen={false}>
      <AISidebar variant="inset" user={session?.user} />
      <SidebarInset className="max-h-[97.5vh]">
        <AIHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
