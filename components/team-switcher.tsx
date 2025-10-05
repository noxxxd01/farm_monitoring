"use client";
import * as React from "react";
import { ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const ICONS: Record<string, React.ElementType> = {
  GalleryVerticalEnd,
  // add more mappings if needed
};

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: string; // now a string key
    plan: string;
  }[];
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams?.[0] ?? null);

  if (!teams || teams.length === 0 || !activeTeam) return null;

  function handleClick() {
    const idx = teams.findIndex((t) => t === activeTeam);
    const next = teams[(idx + 1) % teams.length];
    setActiveTeam(next);
  }

  const Logo = ICONS[activeTeam.logo] ?? (() => null);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={handleClick}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{activeTeam.name}</span>
            <span className="truncate text-xs">{activeTeam.plan}</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
