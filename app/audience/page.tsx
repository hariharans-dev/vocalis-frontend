"use client";

import { useState } from "react";
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

  const [userDataError, setUserDataError] = useState<string | null>(null);

  // Handle input changes correctly
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAudienceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitChanges = async () => {
    if (audienceData.message == "") {
      setUserDataError("feedback missing !!");
      return;
    }
    var data: any = audienceData;
    data.event_endpoint = endpoint;
    // const response = await createAudienceData(data);
    const res = await fetch("/api/audience", {
      method: "POST",
      headers: { "Content-Type": "application-json" },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response.status == "success") {
      setUserDataError(String(response.data?.response));
    } else {
      setUserDataError(String(response.error?.response));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">
            Audience Feedback
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="name" className="w-24">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={audienceData.name}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="phone" className="w-24">
                Phone
              </Label>
              <Input
                id="phone"
                type="text"
                name="phone"
                value={audienceData.phone}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="email" className="w-24">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={audienceData.email}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message" className="text-lg font-semibold">
                Feedback
              </Label>
              <Textarea
                id="message"
                name="message"
                value={audienceData.message}
                onChange={handleInputChange}
                placeholder="Enter your feedback here..."
                className="w-full min-h-[100px]"
              />
            </div>

            {userDataError && (
              <p className="text-red-500 text-sm">{userDataError}</p>
            )}

            <Button onClick={submitChanges} className="w-full">
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
