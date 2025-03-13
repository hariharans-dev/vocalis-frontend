"use client";

import {
  SidebarLayout,
  SidebarItem,
  SidebarTopContent,
} from "@/components/sidebar-layout";
import { Globe, Settings2, Users, Mic, Calendar } from "lucide-react";


const navigationItems: SidebarItem[] = [
  {
    name: "Overview",
    href: "/",
    icon: Globe,
    type: "item",
  },
  {
    type: "label",
    name: "Event",
  },
  {
    name: "Event",
    href: "/event",
    icon: Calendar,
    type: "item",
  },
  {
    type: "label",
    name: "Live Event",
  },
  {
    name: "Voice Feedback",
    href: "/voicefeedback",
    icon: Mic,
    type: "item",
  },
  {
    name: "Audience Feedback",
    href: "/audiencefeedback",
    icon: Users,
    type: "item",
  },
  {
    type: "label",
    name: "Feedback Report",
  },
  {
    name: "Voice Report",
    href: "/voicereport",
    icon: Mic,
    type: "item",
  },
  {
    name: "Audience Report",
    href: "/audiencereport",
    icon: Users,
    type: "item",
  },
  {
    type: "label",
    name: "Account",
  },
  {
    name: "Account",
    href: "/account",
    icon: Settings2,
    type: "item",
  },
];

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      items={navigationItems}
      sidebarTop={<SidebarTopContent />}
      basePath={`/user/dashboard`}
    >
      {props.children}
    </SidebarLayout>
  );
}
