"use client";

import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import {
  Globe,
  Settings2,
  Users,
  Mic,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const sidebarTopContent = (
    <div className="flex-grow justify-start text-sm font-medium text-zinc-500 dark:text-zinc-400 px-2 py-1">
      No Event Selected
    </div>
  );

  return (
    <SidebarLayout
      items={navigationItems}
      sidebarTop={sidebarTopContent}
      basePath={`/user/dashboard`}
    >
      {props.children}
    </SidebarLayout>
  );
}
