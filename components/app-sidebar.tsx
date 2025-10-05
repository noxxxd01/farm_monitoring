/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Code } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

// This is sample data.
const data = {
  teams: [
    {
      name: "Farm Care",
      logo: "GalleryVerticalEnd",
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: "Gauge",
    },
    {
      title: "Data Tables",
      url: "#",
      icon: "Table",
      isActive: true,
      items: [
        { title: "Temperature", url: "#" },
        { title: "Humidity", url: "#" },
        { title: "Air Quality", url: "#" },
      ],
    },
    { title: "Sensors", url: "#", icon: "Code" },
    {
      title: "Settings",
      url: "#",
      icon: "Settings2",
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
};

async function getCurrentUser() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token || !process.env.JWT_SECRET) return null;
    const payload: any = jwt.verify(token, process.env.JWT_SECRET);
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    const [rows] = await conn.execute(
      "SELECT id, name, email FROM users WHERE id = ? LIMIT 1",
      [payload.id]
    );
    await conn.end();
    return (
      (rows as any[])[0] ?? {
        id: payload.id,
        name: payload.name,
        email: payload.email,
      }
    );
  } catch {
    return null;
  }
}

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await getCurrentUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        {user ? (
          // NavUser is a client component and receives the user object
          <NavUser user={user} />
        ) : (
          <div className="ml-auto">
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
