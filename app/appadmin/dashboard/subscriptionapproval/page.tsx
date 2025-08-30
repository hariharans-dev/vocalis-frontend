"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

interface Subscription {
  root_email?: string | null;
  unique_code: string;
  subscription_plan: {
    name: string;
    description: string;
  };
  createdAt: string;
  status?: string;
}

export default function SubscriptionApprovalPage() {
  const [searchType, setSearchType] = useState<"root_email" | "unique_code">(
    "root_email"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      const data = { [searchType]: searchQuery, status: "pending" };
      const res = await fetch("/api/subscription/get/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      console.log("Fetched:", response);

      if (response.status === "success") {
        const subData = response.data?.subscription;
        if (Array.isArray(subData)) {
          setSubscriptions(subData);
        } else if (subData && typeof subData === "object") {
          setSubscriptions([subData]); // wrap single object into array
        } else {
          setSubscriptions([]);
        }
      } else {
        setSubscriptions([]);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]);
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

  useEffect(() => {
    fetchSubscriptions();
  }, [searchQuery, searchType]);

  const handleApprove = async (unique_code: string) => {
    try {
      const res = await fetch("/api/subscription/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unique_code }),
      });
      const response = await res.json();
      console.log("Approve response:", response);

      if (response.status === "success") {
        setSubscriptions((prev) =>
          prev.filter((sub) => sub.unique_code !== unique_code)
        );
      }
    } catch (error) {
      console.error("Error approving subscription:", error);
    }
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="space-y-4">
          {/* Heading */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Pending Approvals
            </h2>
          </div>

          {/* Search Type Dropdown and Input */}
          <div className="flex items-center gap-2 mb-4" ref={searchRef}>
            <select
              value={searchType}
              onChange={(e) =>
                setSearchType(e.target.value as "root_email" | "unique_code")
              }
              className="border rounded-md p-2"
            >
              <option value="root_email">Root Email</option>
              <option value="unique_code">Unique Code</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder={`Search by ${searchType.replace("_", " ")}...`}
              className="w-64 p-2 border rounded-md"
            />
          </div>

          {/* Subscriptions Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub, index) => (
                <Card key={sub.unique_code} className="relative">
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
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
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
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md p-2 z-50">
                          <button
                            onClick={() => handleApprove(sub.unique_code)}
                            className="w-full text-left text-sm p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-800"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 flex flex-col items-start">
                    <div className="text-lg font-medium break-words w-full">
                      {sub.root_email || "No Email"}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 w-full truncate">
                      Unique Code: {sub.unique_code}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 w-full truncate">
                      Plan: {sub.subscription_plan?.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 w-full truncate">
                      {new Date(sub.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 w-full truncate">
                      Status: {sub.status || "pending"}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No pending subscriptions found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
