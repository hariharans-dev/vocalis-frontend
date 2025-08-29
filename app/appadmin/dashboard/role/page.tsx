"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCookie } from "@/app/_functions/cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreVertical } from "lucide-react";

export default function EventPage() {
  interface BasicRoles {
    name: string;
    description: string;
  }

  interface Role {
    email: string;
    role: string;
  }

  const menuRef = useRef<HTMLDivElement | null>(null);
  const [basicRoles, setBasicRoles] = useState<BasicRoles[]>([]);
  const [newRole, setNewRole] = useState<Role>({ email: "", role: "" });
  const [newRoleError, setNewRoleError] = useState("");
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchBasicRoles = async () => {
    try {
      // const response = await getBasicRoles();
      const res = await fetch("/api/role/rolelist", { method: "GET" });
      const response = await res.json();
      if (
        response.status === "success" &&
        Array.isArray(response.data?.role_list)
      ) {
        setBasicRoles(response.data.role_list);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchBasicRoles();
  }, []);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Basic Role</h2>
          </div>

          {/* Role List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {basicRoles.map((item, index) => (
              <Card key={index} className="relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>

                  {/* 3-Dot Menu */}
                </CardHeader>
                <CardContent className="p-4 flex flex-col items-start">
                  <div className="text-lg font-medium break-words">
                    {item.name}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Role assigned: {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
