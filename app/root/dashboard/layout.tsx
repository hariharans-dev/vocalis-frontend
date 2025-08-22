"use client";

import {
  SidebarLayout,
  SidebarItem,
  SidebarTopContent,
} from "@/components/sidebar-layout";
import { Globe, Settings2, Calendar, Users, Mic } from "lucide-react";
import { useEffect, useState } from "react";

const navigationItems: SidebarItem[] = [
  { name: "Overview", href: "/", icon: Globe, type: "item" },
  { type: "label", name: "Event" },
  { name: "Event", href: "/event", icon: Calendar, type: "item" },
  { name: "Roles", href: "/role", icon: Users, type: "item" },
  { type: "label", name: "Live Event" },
  { name: "Voice Feedback", href: "/voicefeedback", icon: Mic, type: "item" },
  {
    name: "Audience Feedback",
    href: "/audiencefeedback",
    icon: Users,
    type: "item",
  },
  { type: "label", name: "Feedback Report" },
  { name: "Voice Report", href: "/voicereport", icon: Mic, type: "item" },
  {
    name: "Audience Report",
    href: "/audiencereport",
    icon: Users,
    type: "item",
  },
  { type: "label", name: "Account" },
  { name: "Account", href: "/account", icon: Settings2, type: "item" },
];

const navigationItemsGuest: SidebarItem[] = [
  { type: "label", name: "Event" },
  { name: "Event", href: "/event", icon: Calendar, type: "item" },
  { type: "label", name: "Account" },
  { name: "Account", href: "/account", icon: Settings2, type: "item" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchCookie = async () => {
      const raw = document.cookie
        .split("; ")
        .find((r) => r.startsWith("eventToken="))
        ?.split("=")[1];
      const cookie = raw ? JSON.parse(atob(raw)) : null;
      setRole(cookie?.role ?? null);
    };
    fetchCookie();
  }, []);

  return (
    <SidebarLayout
      items={role === "root" ? navigationItems : navigationItemsGuest}
      sidebarTop={<SidebarTopContent />}
      basePath={`/root/dashboard`}
    >
      {children}
    </SidebarLayout>
  );
}
