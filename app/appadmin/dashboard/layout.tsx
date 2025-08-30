"use client";

import {
  SidebarLayout,
  SidebarItem,
  SidebarTopContent,
} from "@/components/sidebar-layout";
import { Currency, Globe, CheckCircle2, Users, DollarSign } from "lucide-react";

const navigationItems: SidebarItem[] = [
  { name: "Overview", href: "/", icon: Globe, type: "item" },
  { type: "label", name: "Role" },
  { name: "Basic roles", href: "/role", icon: Users, type: "item" },
  { type: "label", name: "Subscription Plan" },
  {
    name: "Subscription Plan",
    href: "/subscriptionplan",
    icon: Currency,
    type: "item",
  },
  { type: "label", name: "Subsciptions" },
  {
    name: "Subscriptions",
    href: "/subscription",
    icon: DollarSign,
    type: "item",
  },
  {
    name: "Subscription Approval",
    href: "/subscriptionapproval",
    icon: CheckCircle2,
    type: "item",
  },
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
