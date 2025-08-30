"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { QRCodeCanvas } from "qrcode.react";
import GooglePayQRCode from "@/components/googlePay";

export default function EventPage() {
  interface SubscriptionPlan {
    name: string;
    request: number;
    price: number;
    description: string;
  }

  interface Subscription {
    name: string;
    remaining_request: number;
    request: number;
    description: string;
    status: boolean;
    createdAt: Date;
  }

  const formattedDate = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [newSubscription, setNewSubscription] = useState<string>("");
  const [newSubscriptionError, setNewSubscriptionError] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [createdSubscription, setCreatedSubscription] = useState<{
    code: string;
    price: number;
    upi_id?: string;
  } | null>(null);

  // Fetch subscription plans
  const fetchBasicSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscription/plan/get", { method: "POST" });
      const response = await res.json();
      if (
        response.status === "success" &&
        Array.isArray(response.data?.subscription_plan)
      ) {
        const filteredPlans = response.data.subscription_plan.filter(
          (plan: { name: string }) => plan.name !== "free-tier"
        );
        setSubscriptionPlans(filteredPlans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  // Fetch all subscriptions
  const fetchRootSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscription/get", { method: "POST" });
      const response = await res.json();

      if (
        response.status === "success" &&
        Array.isArray(response.data?.subscription)
      ) {
        setSubscriptions(
          response.data.subscription.map(
            (item: {
              remaining_request: number;
              status: boolean;
              createdAt: Date;
              subscription_plan: {
                description: string;
                name: string;
                request: number;
              };
            }) => ({
              name: item.subscription_plan?.name || "Unknown",
              description:
                item.subscription_plan?.description || "No Description",
              request: item.subscription_plan?.request || 0,
              remaining_request: item.remaining_request || 0,
              status: item.status,
              createdAt: item.createdAt
                ? formattedDate(item.createdAt)
                : undefined,
            })
          )
        );
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  useEffect(() => {
    fetchBasicSubscriptions();
    fetchRootSubscriptions();
  }, []);

  const handleCreateSubscription = async () => {
    if (!newSubscription) return;
    setIsCreating(true);
    try {
      const data = { subscription_plan_name: newSubscription };
      const res = await fetch("/api/subscription", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.status === "success" && response.data?.secret_key) {
        setCreatedSubscription({
          code: response.data.secret_key,
          price: response.data.price,
          upi_id: response.data.upi_id,
        });
      } else {
        setNewSubscriptionError(
          response.error?.response || "Failed to create subscription."
        );
      }
      fetchRootSubscriptions();
    } catch (error) {
      console.error(error);
      setNewSubscriptionError("Error creating subscription.");
    } finally {
      setIsCreating(false);
    }
  };

  // Filtering logic
  const filteredSubscriptions = subscriptions.filter((item) => {
    if (searchQuery === "all") return item.status;
    if (searchQuery === "active")
      return item.remaining_request > 0 && item.status;
    if (searchQuery === "expired")
      return item.remaining_request <= 0 && item.status;
    return true;
  });

  const filteredPendingSubscriptions = subscriptions.filter((item) => {
    return !item.status;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black">
      <div className="flex-1 space-y-6 p-4 md:p-8 lg:p-12">
        {/* Create Subscription Section */}
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="mb-4 flex gap-2">
            <TabsTrigger
              value="create"
              className="p-2 border rounded-md data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
            >
              Create Subscription
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="p-2 border rounded-md data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
            >
              Pending Subscriptions
            </TabsTrigger>
          </TabsList>

          {/* Create Subscription Tab */}
          <TabsContent value="create">
            <Card className="p-4 md:p-6 shadow-sm rounded-2xl">
              {createdSubscription ? (
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Payment Instructions & QR */}
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                      Subscription Payment Instructions
                    </h3>

                    <ol className="list-decimal list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-2">
                      <li>Open Google Pay on your mobile device.</li>
                      <li>Scan the QR code below to pay the exact amount.</li>
                      <li>
                        In the payment note, ensure it shows your subscription{" "}
                        <span className="font-semibold">Code</span>.
                      </li>
                      <li>Complete the payment in Google Pay.</li>
                      <li>
                        After payment, click the{" "}
                        <span className="font-semibold">Done Payment</span>{" "}
                        button below.
                      </li>
                      <li>
                        Your payment will be verified and updated by the admin
                        within 24 hours.
                      </li>
                    </ol>

                    <p className="text-center text-sm text-gray-500">
                      Scan to pay using Google Pay
                    </p>

                    <div className="flex justify-center">
                      <Button
                        onClick={() => setCreatedSubscription(null)}
                        className="w-full md:w-1/2 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Done Payment
                      </Button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex-1 flex justify-center items-center">
                    <GooglePayQRCode
                      upiId={String(createdSubscription.upi_id)}
                      code={String(createdSubscription.code)}
                      amount={createdSubscription.price}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Subscription Selection */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                        <Label
                          htmlFor="new-Subscription"
                          className="w-24 shrink-0"
                        >
                          Plan
                        </Label>
                        <select
                          id="new-Subscription"
                          name="Subscription"
                          value={newSubscription}
                          onChange={(e) => setNewSubscription(e.target.value)}
                          className="w-full md:flex-1 border rounded-md p-2 text-sm"
                          disabled={isCreating}
                        >
                          <option value="" disabled>
                            Select a Subscription Plan
                          </option>
                          {subscriptionPlans.map((item, index) => (
                            <option key={index} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {newSubscription &&
                        (() => {
                          const selectedPlan = subscriptionPlans.find(
                            (item) => item.name === newSubscription
                          );
                          if (!selectedPlan) return null;
                          return (
                            <div className="pl-0 md:pl-[7rem] text-sm text-gray-600 dark:text-gray-300 space-y-1">
                              <p>
                                <span className="font-semibold">Name:</span>{" "}
                                {selectedPlan.name}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Description:
                                </span>{" "}
                                {selectedPlan.description}
                              </p>
                              <p>
                                <span className="font-semibold">Price:</span>{" "}
                                Rs.{selectedPlan.price}
                              </p>
                              <p>
                                <span className="font-semibold">Requests:</span>{" "}
                                {selectedPlan.request}
                              </p>
                            </div>
                          );
                        })()}
                    </div>

                    {newSubscriptionError && (
                      <p className="text-red-500 text-sm">
                        {newSubscriptionError}
                      </p>
                    )}

                    <div>
                      <Button
                        onClick={handleCreateSubscription}
                        className="w-full md:w-auto"
                        disabled={isCreating}
                      >
                        {isCreating ? "Creating..." : "Create"}
                      </Button>
                    </div>
                  </div>

                  {/* QR / Payment Area Placeholder */}
                  <div className="flex-1 flex justify-center items-center">
                    <p className="text-gray-500 dark:text-gray-400 text-center"></p>
                  </div>
                </div>
              )}
            </Card>
            <div className="mt-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  Subscriptions
                </h2>
                <div className="w-full md:w-80">
                  <select
                    id="search-Subscription"
                    name="search-Subscription"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  >
                    <option value="all">All Subscriptions</option>
                    <option value="active">Active Subscriptions</option>
                    <option value="expired">Expired Subscriptions</option>
                  </select>
                </div>
              </div>

              {/* Subscription Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((item, index) => (
                    <Card
                      key={index}
                      className="p-4 md:p-5 shadow-sm rounded-2xl hover:shadow-md transition"
                    >
                      <CardHeader className="pb-2">
                        <h3 className="font-semibold text-base md:text-lg">
                          {item.name}
                        </h3>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p>
                          <span className="font-semibold">Description:</span>{" "}
                          {item.description}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Initial Requests:
                          </span>{" "}
                          {item.request}
                        </p>
                        <p>
                          <span className="font-semibold">Remaining:</span>{" "}
                          {item.remaining_request}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No subscriptions found.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Pending Subscriptions Tab */}
          <TabsContent value="pending">
            <Card className="p-4 md:p-6 shadow-sm rounded-2xl">
              <CardContent>
                {filteredPendingSubscriptions.length > 0 ? (
                  filteredPendingSubscriptions.map((item, index) => (
                    <Card
                      key={index}
                      className="p-4 md:p-5 shadow-sm rounded-2xl hover:shadow-md transition"
                    >
                      <CardHeader className="pb-2">
                        <h3 className="font-semibold text-base md:text-lg">
                          {item.name}
                        </h3>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p>
                          <span className="font-semibold">Description:</span>{" "}
                          {item.description}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Initial Requests:
                          </span>{" "}
                          {item.request}
                        </p>
                        <p>
                          <span className="font-semibold">Remaining:</span>{" "}
                          {item.remaining_request}
                        </p>
                        <p>
                          <span className="font-semibold">Created At:</span>{" "}
                          {String(item.createdAt)}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No Pending subscriptions found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Subscriptions Section */}
      </div>
    </div>
  );
}
