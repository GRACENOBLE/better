"use client";

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

export function AISidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: any }) {
  const currentUser = user;
  console.log("user: ", currentUser);
  const userId = currentUser?.id;
  const [conversations, setConversations] = useState<
    { title: string; id: string }[] | null
  >(null);

  async function fetchConversations() {
    console.log("fetching...");
    const res = await fetch(`/api/chat/list?userId=${userId}`);
    if (!res.ok) {
      console.error("Failed to fetch conversations");
      setConversations([]);
      return;
    }
    const text = await res.text();
    if (!text) {
      setConversations([]);
      return;
    }
    const { conversations } = JSON.parse(text);
    setConversations(conversations);
  }

  useEffect(() => {
    fetchConversations();
    // Only fetch when userId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
