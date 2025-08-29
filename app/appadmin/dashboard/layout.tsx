"use client";

import {
  SidebarLayout,
  SidebarItem,
  SidebarTopContent,
} from "@/components/sidebar-layout";
import { Globe, Users } from "lucide-react";

const navigationItems: SidebarItem[] = [
  { name: "Overview", href: "/", icon: Globe, type: "item" },
  { type: "label", name: "Role" },
  { name: "Basic roles", href: "/role", icon: Users, type: "item" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      items={navigationItems}
      sidebarTop={<SidebarTopContent />}
      basePath={`/appadmin/dashboard`}
    >
      {children}
    </SidebarLayout>
  );
}
