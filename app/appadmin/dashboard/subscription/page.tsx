"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

interface Subscription {
  root_email?: string | null;
  unique_code: string;
  remaining_request?: number;
  subscription_plan: {
    name: string;
    description: string;
    request?: number;
  };
  createdAt: string;
  status?: boolean;
}

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "all">(
    "pending"
  );
  const [searchType, setSearchType] = useState<"root_email" | "unique_code">(
    "root_email"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchSubscriptions = async () => {
    try {
      const data = { [searchType]: searchQuery, status: activeTab };
      const res = await fetch("/api/subscription/get/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      console.log("Fetched:", response);

      if (response.status === "success") {
        const subData = response.data?.subscription;
        if (Array.isArray(subData)) setSubscriptions(subData);
        else if (subData && typeof subData === "object")
          setSubscriptions([subData]);
        else setSubscriptions([]);
      } else {
        setSubscriptions([]);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setSubscriptions([]);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [searchQuery, searchType, activeTab]);

  const handleDelete = async (unique_code: string) => {
    try {
      const res = await fetch("/api/subscription", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unique_code }),
      });
      const response = await res.json();
      setOpenMenuIndex(null);
      console.log("Delete response:", response);

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
    <div className="flex flex-col p-6 md:p-8 lg:p-10 space-y-6">
      {/* Header + Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Subscriptions
        </h1>
        <div className="flex gap-2">
          {(["active", "pending", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-gray-600 text-white dark:bg-gray-500 dark:text-white shadow-md"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-2 w-full max-w-md"
        ref={searchRef}
      >
        <select
          value={searchType}
          onChange={(e) =>
            setSearchType(e.target.value as "root_email" | "unique_code")
          }
          className="border rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={activeTab === "active" || activeTab == "all"} // disable select for active tab
        >
          <option value="root_email">Root Email</option>
          {activeTab === "pending" && (
            <option value="unique_code">Unique Code</option>
          )}
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search by ${searchType.replace("_", " ")}...`}
          className="flex-1 border rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Subscription Cards */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {subscriptions.length > 0 ? (
          subscriptions.map((sub, index) => (
            <Card
              key={sub.unique_code + index}
              className="relative break-words hover:shadow-lg transition"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
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

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setOpenMenuIndex(openMenuIndex === index ? null : index)
                    }
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                  </Button>

                  {openMenuIndex === index && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md p-2 z-50">
                      <button
                        onClick={() => handleDelete(sub.unique_code)}
                        className="w-full text-left text-sm p-2 text-red-600 hover:bg-green-100 dark:hover:bg-green-800 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 flex flex-col items-start space-y-1 break-words">
                <div className="text-lg font-medium w-full break-words">
                  {sub.root_email || "No Email"}
                </div>
                <p className="text-sm text-muted-foreground w-full truncate">
                  Unique Code: {sub.unique_code}
                </p>
                <p className="text-sm text-muted-foreground w-full truncate">
                  Plan: {sub.subscription_plan?.name} (
                  {sub.subscription_plan?.request})
                </p>
                <p className="text-sm text-muted-foreground w-full truncate">
                  Remaining Requests: {sub.remaining_request ?? "-"}
                </p>
                <p className="text-sm text-muted-foreground w-full truncate">
                  Created At: {new Date(sub.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground w-full truncate">
                  Status: {sub.status ? "Active" : "Pending"}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground mt-6">
            No {activeTab} subscriptions found.
          </p>
        )}
      </div>
    </div>
  );
}
