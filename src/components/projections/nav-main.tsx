"use client";

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";

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
import { Progress } from "@/components/ui/progress";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    progress?: number;
  }[];
}) {
  console.log("NavMain received items:", items);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Link href="/roadmaps/studio">
              <SidebarMenuButton tooltip="Quick Create">
                <PlusCircleIcon />
                <span>Create a roadmap</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarGroupLabel className="text-md font-semibold">
          Recent Roadmaps
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="flex flex-col items-start gap-1 h-auto py-2"
                >
                  <span className="text-sm font-medium truncate w-full">
                    {item.title}
                  </span>
                  {item.progress !== undefined && (
                    <div className="flex items-center gap-2 w-full">
                      <Progress value={item.progress} className="flex-1 h-1" />
                      <span className="text-xs text-muted-foreground">
                        {item.progress}%
                      </span>
                    </div>
                  )}
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
