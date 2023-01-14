"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Logo from "../logo";
import { authClient } from "@/lib/auth/auth-client";
import { useEffect, useState } from "react";

interface Roadmap {
  id: string;
  title: string;
  progress: number;
  createdAt: string;
}

export function CanvasSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      if (!session?.user?.id) {
        console.log("No session or user ID, skipping fetch");
        setLoading(false);
        return;
      }

      console.log("Fetching roadmaps for user:", session.user.id);
      try {
        const response = await fetch("/api/roadmaps", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("API response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched roadmaps:", data);
          setRoadmaps(data);
        } else {
          console.error(
            "API response not ok:",
            response.status,
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session !== undefined) {
      // Changed from if (session) to handle when session is null
      fetchRoadmaps();
    } else {
      // If session is still undefined, wait a bit and try again
      const timeout = setTimeout(() => {
        if (!session) {
          console.log(
            "Session still not available after timeout, setting loading to false"
          );
          setLoading(false);
        }
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeout);
    }
  }, [session]);

  const navMainItems = roadmaps.map((roadmap) => ({
    title: roadmap.title,
    url: `/roadmaps/${roadmap.id}`,
    progress: roadmap.progress,
  }));

  console.log("navMainItems:", navMainItems);

  const data = {
    user: session?.user
      ? {
          name: session.user.name || "User",
          email: session.user.email || "",
          avatar: session.user.image || "/avatars/default.jpg",
        }
      : {
          name: "Guest",
          email: "",
          avatar: "/avatars/default.jpg",
        },
    navMain: navMainItems,
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/roadmaps">
              <SidebarMenuButton>
                <Logo variant="logo" size="sm" />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">
            Loading roadmaps...
          </div>
        ) : (
          <NavMain items={data.navMain} />
        )}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
