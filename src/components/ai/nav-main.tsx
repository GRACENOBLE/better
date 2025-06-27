"use client";

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    id: string;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton tooltip="Quick Create">
              <Link href={"/chat/new"} className="flex items-center gap-2">
                <PlusCircleIcon size={16}/>
                <span>New Chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroupLabel className="text-md font-semibold">
          Recent
        </SidebarGroupLabel>
        <SidebarSeparator />
        <SidebarMenu>
          {items && items.map(({ title, id }) => (
            <SidebarMenuItem key={title}>
              <Link href={"/chat/" + id}>
                <SidebarMenuButton
                  tooltip={title}
                  className="hover:cursor-pointer"
                >
                  <span>{title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
