"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreVertical } from "lucide-react";

export default function SubscriptionPlanPage() {
  interface SubscriptionPlan {
    name: string;
    request: number;
    price: number;
    description: string;
    response?: string; // ✅ added optional response
  }

  const menuRef = useRef<HTMLDivElement | null>(null);
  const [subscriptionPlan, setsubscriptionPlan] = useState<SubscriptionPlan[]>(
    []
  );
  const [newsubscriptionPlan, setnewsubscriptionPlan] =
    useState<SubscriptionPlan>({
      name: "",
      request: 0,
      price: 0,
      description: "",
    });
  const [newSubscriptionError, setNewSubscriptionError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    request: 0,
    price: 0,
    description: "",
  });

  const fetchSubscriptionPlan = async () => {
    try {
      const res = await fetch("/api/subscription/plan/get", { method: "POST" });
      const response = await res.json();
      if (
        response.status === "success" &&
        Array.isArray(response.data?.subscription_plan)
      ) {
        setsubscriptionPlan(response.data.subscription_plan);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubscriptionPlan();
  }, []);

  const handleCreateSubscriptionPlan = async () => {
    if (newsubscriptionPlan.name == "") {
      setNewSubscriptionError("Enter a name");
      return;
    }

    if (newsubscriptionPlan.description == "") {
      setNewSubscriptionError("Enter a description");
      return;
    }

    try {
      const data = newsubscriptionPlan;
      const res = await fetch("/api/subscription/plan", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const response = await res.json();
      setNewSubscriptionError(
        response.status === "success"
          ? String(response.data?.response)
          : String(response.error?.response)
      );
      if (response.status == "success") window.location.reload();
    } catch (error) {
      console.error(error);
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

  const handleUpdatePlan = async (index: number, data: typeof editForm) => {
    try {
      const body = {
        old_name: subscriptionPlan[index].name,
        name: data.name,
        request: data.request,
        price: data.price,
        description: data.description,
      };
      const res = await fetch("/api/subscription/plan", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      const response = await res.json();
      if (response.status != "success") {
        throw Error();
      }

      setsubscriptionPlan((prev) =>
        prev.map((plan, i) =>
          i === index
            ? {
                ...plan,
                ...data,
                response: response.response || response.data?.response,
              }
            : plan
        )
      );

      setEditingIndex(null);
    } catch (err) {
      setsubscriptionPlan((prev) =>
        prev.map((plan, i) =>
          i === index
            ? { ...plan, response: "Update failed. Try again." }
            : plan
        )
      );
    }
  };

  const handleDeleteSubscriptionPlan = async (name: string) => {
    const data = { name };
    await fetch("/api/subscription/plan", {
      method: "DELETE",
      body: JSON.stringify(data),
    });
    window.location.reload();
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div>
          <div className="flex items-center justify-between space-y-2 mb-3">
            <h2 className="text-2xl font-bold tracking-tight">
              Create Subscription Plan
            </h2>
          </div>
          <Card className="col-span-4 p-4">
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="new-subscription-name" className="w-24">
                    Name
                  </Label>
                  <Input
                    id="new-subscription-name"
                    type="text"
                    name="name"
                    value={newsubscriptionPlan.name}
                    onChange={(e) =>
                      setnewsubscriptionPlan((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter Subscription Plan name"
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="new-subscription-request" className="w-24">
                    Number of requests
                  </Label>
                  <Input
                    id="new-subscription-request"
                    type="number"
                    name="request"
                    value={newsubscriptionPlan.request}
                    onChange={(e) =>
                      setnewsubscriptionPlan((prev) => ({
                        ...prev,
                        request: Number(e.target.value),
                      }))
                    }
                    placeholder="Enter number of requests"
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="new-subscription-price" className="w-24">
                    Price
                  </Label>
                  <Input
                    id="new-subscription-price"
                    type="number"
                    name="price"
                    value={newsubscriptionPlan.price}
                    onChange={(e) =>
                      setnewsubscriptionPlan((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    placeholder="Enter price in INR"
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="new-subscription-description"
                    className="w-24"
                  >
                    Description
                  </Label>
                  <textarea
                    id="new-subscription-description"
                    name="description"
                    value={newsubscriptionPlan.description}
                    onChange={(e) =>
                      setnewsubscriptionPlan((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter Subscription Plan description"
                    className="flex-1 p-2 border rounded-md min-h-[80px] resize-y"
                  />
                </div>

                {/* Error Message */}
                {newSubscriptionError && (
                  <p className="text-red-500 text-sm">{newSubscriptionError}</p>
                )}

                {/* Submit Button */}
                <div className="mt-6">
                  <Button onClick={handleCreateSubscriptionPlan}>Create</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Heading */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Subscription Plans
            </h2>
          </div>

          {/* Role List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {subscriptionPlan.map((item, index) => (
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

                    {/* Dropdown Menu */}
                    {openMenuIndex === index && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md p-2"
                      >
                        <button
                          onClick={() =>
                            handleDeleteSubscriptionPlan(item.name)
                          }
                          className="w-full text-left text-sm p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-800"
                        >
                          Delete Plan
                        </button>
                        <button
                          onClick={() => {
                            setEditingIndex(index);
                            setEditForm({
                              name: item.name,
                              request: item.request,
                              price: item.price,
                              description: item.description,
                            });
                            setOpenMenuIndex(null);
                          }}
                          className="w-full text-left text-sm p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800"
                        >
                          Update Plan
                        </button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4 flex flex-col items-start">
                  {editingIndex === index ? (
                    <>
                      <input
                        className="border p-1 rounded w-full mb-2"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        className="border p-1 rounded w-full mb-2"
                        value={editForm.request}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            request: Number(e.target.value),
                          })
                        }
                      />
                      <input
                        type="number"
                        className="border p-1 rounded w-full mb-2"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            price: Number(e.target.value),
                          })
                        }
                      />
                      <textarea
                        className="border p-1 rounded w-full mb-2"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdatePlan(index, editForm)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingIndex(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-medium break-words">
                        {item.name}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Request: {item.request}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Price: {item.price} INR
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Description: {item.description}
                      </p>
                      {item.response && (
                        <p className="text-xs text-green-600 mt-2">
                          {item.response}
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
