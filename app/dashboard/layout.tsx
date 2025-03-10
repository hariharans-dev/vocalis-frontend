"use client";

import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import {
  BadgePercent,
  BarChart4,
  Columns3,
  Globe,
  Locate,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Users,
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
    name: "Management",
  },
  {
    name: "Products",
    href: "/products",
    icon: ShoppingBag,
    type: "item",
  },
  {
    name: "People",
    href: "/people",
    icon: Users,
    type: "item",
  },
  {
    name: "Segments",
    href: "/segments",
    icon: Columns3,
    type: "item",
  },
  {
    name: "Regions",
    href: "/regions",
    icon: Locate,
    type: "item",
  },
  {
    type: "label",
    name: "Monetization",
  },
  {
    name: "Revenue",
    href: "/revenue",
    icon: BarChart4,
    type: "item",
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    type: "item",
  },
  {
    name: "Discounts",
    href: "/discounts",
    icon: BadgePercent,
    type: "item",
  },
  {
    type: "label",
    name: "Settings",
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

  return (
    <SidebarLayout items={navigationItems} basePath={`/dashboard`}>
      {props.children}
    </SidebarLayout>
  );
}
