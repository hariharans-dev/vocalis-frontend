"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";

export default function AudienceFeedback() {
  const searchParams = useSearchParams();
  const endpoint = searchParams?.get("endpoint");

  interface AudienceData {
    name: string;
    phone: string;
    email: string;
    message: string;
  }

  const [audienceData, setAudienceData] = useState<AudienceData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [event, setEvent] = useState("");

  const [userDataError, setUserDataError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAudienceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getEventWithEndpoint = async () => {
    if (endpoint == null) {
      setEvent("");
    } else {
      const data: any = { event_endpoint: endpoint };
      const res = await fetch("/api/event/get/endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.status == "success") {
        setEvent(response.data.event);
      } else {
        setEvent("");
      }
    }
  };

  useEffect(() => {
    getEventWithEndpoint();
  }, []);

  const submitChanges = async () => {
    if (audienceData.message == "") {
      setUserDataError("Feedback is required!");
      return;
    }
    const data: any = { ...audienceData, event_endpoint: endpoint };
    const res = await fetch("/api/audience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response.status === "success") {
      setUserDataError("✅ Feedback submitted successfully!");
      setAudienceData({ name: "", phone: "", email: "", message: "" });
    } else {
      setUserDataError("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      {event === "" ? (
        <div className="flex items-center justify-center min-h-screen px-4">
          <Card className="w-full max-w-lg rounded-xl shadow-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold text-red-500">No Event Found</h2>
              <p className="text-gray-500 mt-2">
                Please check the event link or contact the organizer.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen px-4">
          <Card className="w-full max-w-2xl rounded-xl shadow-md">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                  Audience Feedback - {event}
                </h2>
                <p className="text-sm text-gray-500">
                  We value your feedback. Please fill out the form below.
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={audienceData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="text"
                    name="phone"
                    value={audienceData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={audienceData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Feedback</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={audienceData.message}
                    onChange={handleInputChange}
                    placeholder="Write your feedback here..."
                    className="min-h-[120px]"
                  />
                </div>

                {userDataError && (
                  <p
                    className={`text-sm ${
                      userDataError.startsWith("✅")
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {userDataError}
                  </p>
                )}

                <Button onClick={submitChanges} className="w-full">
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
