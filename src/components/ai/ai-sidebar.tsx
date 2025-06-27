"use client";

import {
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  HelpCircleIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "../logo";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";

const data = {
  user: {
    name: "Noble",
    email: "gracenoble72@gmail.com.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};

export function AISidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const user = session?.user;
  console.log("user: ", user);
  const userId = user?.id;
  const [conversations, setConversations] = useState<
    { title: string; id: string }[] | null
  >(null);

  async function fetchConversations() {
    console.log("fetching...");
    const res = await fetch(`/api/chat/list?userId=${userId}`);

    const { conversations } = await res.json();
    // console.log("Res: ", conversations);
    setConversations(conversations);
  }

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    console.log("conversations: ", conversations);
  }, [conversations]);

  const chats = Array.isArray(conversations)
    ? conversations?.map((c: { title: string; id: string }) => ({
        title: c.title,
        id: c.id,
      }))
    : [];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Logo variant="logomark" size="sm" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={chats} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
