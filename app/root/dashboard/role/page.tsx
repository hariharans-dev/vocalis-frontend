"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { deleteRole, getEventUsersRoles } from "@/app/_api/role/root/Role";
import { getBasicRoles, createRole } from "@/app/_api/role/root/Role";
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

  // Fetch Basic Roles
  const fetchBasicRoles = async () => {
    try {
      const response = await getBasicRoles();
      if (
        response.status === "success" &&
        Array.isArray(response.data?.role_list)
      ) {
        setBasicRoles(response.data.role_list);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Fetch Event Roles
  const fetchEventRoles = async () => {
    try {
      const cookie = await getCookie("event");
      if (cookie?.event) {
        const response = await getEventUsersRoles(String(cookie.event));
        if (response.status === "success" && Array.isArray(response.data)) {
          setRoleList(
            response.data.map((item) => ({
              role: item.role_list?.name || "Unknown Role",
              email: item.user?.email || "No Email Provided",
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error fetching event roles:", error);
    }
  };

  useEffect(() => {
    fetchBasicRoles();
    fetchEventRoles();
  }, []);

  const handleCreateRole = async () => {
    if (!newRole.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newRole.email)) {
      setNewRoleError("Not a valid email");
      return;
    }

    if (!newRole.role) {
      setNewRoleError("Please select a role");
      return;
    }

    try {
      const cookie = await getCookie("event");
      if (cookie?.event) {
        const data = { event_name: cookie.event, ...newRole };
        const response = await createRole(data);
        setNewRoleError(
          response.status === "success"
            ? String(response.data?.response)
            : String(response.error?.response)
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (email: string, role: string) => {
    const cookie = await getCookie("event");
    if (cookie && "event" in cookie) {
      const data = { event_name: cookie.event, user_email: email, role };
      await deleteRole(data);
      window.location.reload();
    }
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div>
          <div className="flex items-center justify-between space-y-2 mb-3">
            <h2 className="text-2xl font-bold tracking-tight">Create Role</h2>
          </div>
          <Card className="col-span-4 p-4">
            <CardContent>
              <div className="space-y-3">
                {/* Email Input */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="new-role-email" className="w-24">
                    User Email
                  </Label>
                  <Input
                    id="new-role-email"
                    type="text"
                    name="email"
                    value={newRole.email}
                    onChange={(e) =>
                      setNewRole((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="Enter user email"
                    className="flex-1"
                  />
                </div>

                {/* Role Selection */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="new-role-role" className="w-24">
                      Role
                    </Label>
                    <select
                      id="new-role-role"
                      name="role"
                      value={newRole.role}
                      onChange={(e) =>
                        setNewRole((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      className="flex-1 border rounded-md p-2"
                    >
                      <option value="" disabled>
                        Select a Role
                      </option>
                      {basicRoles.map((item, index) => (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role Description */}
                  {newRole.role && (
                    <p className="text-sm pl-[7rem] text-gray-600">
                      {basicRoles.find((item) => item.name === newRole.role)
                        ?.description || "No description available."}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {newRoleError && (
                  <p className="text-red-500 text-sm">{newRoleError}</p>
                )}

                {/* Submit Button */}
                <div className="mt-6">
                  <Button onClick={handleCreateRole}>Create</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Heading */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Users and Role
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative z-50 w-80" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search roles..."
              className="w-full p-2 border rounded-md"
            />

            {/* Search Dropdown */}
            {isDropdownOpen && (
              <div
                className="absolute left-0 mt-1 w-full border rounded-md shadow-lg max-h-60 overflow-y-auto duration-200 
            bg-white border-gray-200 dark:bg-black dark:border-gray-700"
              >
                {roleList
                  .filter(
                    (item) =>
                      item.email
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      item.role
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        console.log("Selected:", item);
                        setIsDropdownOpen(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {item.email} ({item.role})
                    </div>
                  ))}
                {roleList.length === 0 && (
                  <div className="p-2 text-gray-500 dark:text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Role List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {roleList
              .filter(
                (item) =>
                  item.email
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  item.role?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item, index) => (
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
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setOpenMenuIndex(
                            openMenuIndex === index ? null : index
                          )
                        }
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                      </Button>

                      {/* Dropdown Menu */}
                      {openMenuIndex === index && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md p-2"
                        >
                          <button
                            onClick={() => handleDelete(item.email, item.role)}
                            className="w-full text-left text-sm p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-800"
                          >
                            Delete Role
                          </button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col items-start">
                    <div className="text-lg font-medium break-words">
                      {item.email}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Role assigned: {item.role}
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
