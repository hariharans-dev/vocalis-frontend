"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AudienceFeedback() {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  interface AudienceData {
    id: number;
    data: string;
    audience: {
      name?: string | null;
      phone?: string | null;
      email?: string | null;
      address?: string | null;
    };
  }

  const [audienceData, setAudienceData] = useState<AudienceData[]>([]);
  const [endpoint, setEndpoint] = useState("");

  const getAudienceDataFunc = async () => {
    const raw = document.cookie
      .split("; ")
      .find((r) => r.startsWith("eventToken="))
      ?.split("=")[1];
    const cookie = raw ? JSON.parse(atob(raw)) : null;
    if (cookie && "event" in cookie) {
      const res = await fetch("/api/audience/data/get", {
        method: "POST",
        body: JSON.stringify({ event_name: cookie.event }),
      });
      const response = await res.json();
      if (response?.data && Array.isArray(response.data)) {
        const formattedData: AudienceData[] = response.data.map(
          (element: any, index: number) => ({
            ...element,
            id: index,
          })
        );

        setAudienceData(formattedData);
      }
    }
  };

  const createEndpointfunc = async () => {
    const raw = document.cookie
      .split("; ")
      .find((r) => r.startsWith("eventToken="))
      ?.split("=")[1];
    const cookie = raw ? JSON.parse(atob(raw)) : null;
    if (cookie && "event" in cookie) {
      // const response = await createEndpoint(String(cookie.event));
      const res = await fetch("/api/audience/endpoint", {
        method: "POST",
        body: JSON.stringify({ event_name: cookie.event }),
      });
      const response = await res.json();
      if (response.data) {
        window.location.reload();
      }
    }
  };

  const getEndpointFunc = async () => {
    const raw = document.cookie
      .split("; ")
      .find((r) => r.startsWith("eventToken="))
      ?.split("=")[1];
    const cookie = raw ? JSON.parse(atob(raw)) : null;
    if (cookie && "event" in cookie) {
      const res = await fetch("/api/audience/endpoint/get", {
        method: "POST",
        body: JSON.stringify({ event_name: cookie.event }),
      });
      const response = await res.json();
      if (response.data && "event_endpoint" in response.data) {
        setEndpoint(String(response.data.event_endpoint));
      }
    }
  };

  useEffect(() => {
    getEndpointFunc();
    getAudienceDataFunc();
  },[]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        {endpoint && endpoint !== "null" ? (
          <div className="text-lg font-bold flex flex-wrap items-center justify-center sm:justify-start text-center sm:text-left gap-2">
            <span>Event Endpoint:</span>
            <span className="text-sm font-light break-words w-full sm:w-auto text-center sm:text-left">
              <Link
                href={`${frontendUrl}/audience?endpoint=${endpoint}`}
                className="text-blue-600 hover:underline inline-block"
              >
                {`${frontendUrl}/audience?endpoint=${endpoint}`}
              </Link>
            </span>
          </div>
        ) : (
          <div className="text-lg font-bold flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>Event Endpoint:</span>
            <span className="font-normal">Not Created</span>
          </div>
        )}

        {!endpoint || endpoint === "null" ? (
          <div className="flex justify-center sm:justify-start">
            <button
              onClick={createEndpointfunc}
              className="w-full sm:w-fit mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Create Endpoint
            </button>
          </div>
        ) : null}
        {audienceData.length != 0 ? (
          <div className="text-lg font-bold flex items-center space-x-1">
            <span>Audience Feedbacks </span>
          </div>
        ) : (
          <div className="text-lg font-bold flex items-center space-x-1">
            <span>No Audience Feedbacks Recorded</span>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {audienceData.map((item: any) => (
            <Card key={item.id}>
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
              </CardHeader>
              <CardContent>
                {item.audience.name && (
                  <p className="text-xs text-muted-foreground">
                    Name: {item.audience.name}
                  </p>
                )}
                {item.audience.email && (
                  <p className="text-xs text-muted-foreground">
                    Email: {item.audience.email}
                  </p>
                )}
                {item.audience.phone && (
                  <p className="text-xs text-muted-foreground">
                    Phone: {item.audience.phone}
                  </p>
                )}
                {item.audience.address && (
                  <p className="text-xs text-muted-foreground">
                    Phone: {item.audience.address}
                  </p>
                )}
                {
                  <p className="text-xs text-muted-foreground">
                    Feedback: {item.data}
                  </p>
                }
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
