"use client";

import { JSX, useEffect, useState } from "react";
import { createCookie, getCookie } from "@/app/_functions/cookie";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getVoiceData,
  createVoiceReport,
  getVoiceReport,
} from "@/app/_api/user/voicereport/VoiceReport";

export default function AudienceReport() {
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
  interface VoiceReportData {
    map(
      arg0: (report: any, index: number) => JSX.Element
    ): import("react").ReactNode;
    length: number;
    general_opinion?: {
      opinion: string;
      total_feedbacks: number;
      negative_feedbacks: number;
      positive_feedbacks: number;
      negative_percentage: number;
      positive_percentage: number;
    } | null;
    summary?: {
      negative_summary: string;
      positive_summary: string;
    } | null;
    overall_summary?: string | null;
  }

  const [audienceData, setAudienceData] = useState<AudienceData[]>([]);
  const [voiceReportData, setVoiceReportData] = useState<
    VoiceReportData[] | null
  >(null);

  const [showVoiceData, setShowVoiceData] = useState(false);
  const [voiceFeedbackResponseData, setVoiceFeedbackResponseData] =
    useState("");

  const getAudienceDataFunc = async () => {
    const cookie = await getCookie("event");
    if (cookie && "event" in cookie) {
      const data: Object = { event_name: cookie.event, option: "all" };
      const response = await getVoiceData(data);
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

  const createVoiceReportFunc = async () => {
    const cookie = await getCookie("event");
    if (cookie && "event" in cookie) {
      const response = await createVoiceReport(String(cookie.event));
      console.log(response);
      if (response?.data?.response) {
        setVoiceFeedbackResponseData(String(response.data.response));
      }
    }
  };

  const getVoiceReportFunc = async () => {
    const cookie = await getCookie("event");
    if (cookie?.event) {
      const response = await getVoiceReport(String(cookie.event));
      console.log(response);

      if (
        response?.status === "success" &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setVoiceReportData(response.data);
      }
    }
  };

  useEffect(() => {
    getVoiceReportFunc();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="text-lg font-bold flex items-center space-x-6 my-3">
          <span>Create Voice Feedback Report</span>
          <Button onClick={createVoiceReportFunc}>Create</Button>
        </div>

        {voiceFeedbackResponseData && (
          <div>
            <p className="text-red-500 text-sm">{voiceFeedbackResponseData}</p>
          </div>
        )}
        <div>
          <div className="text-lg font-bold flex items-center space-x-6 my-3">
            <span>Voice Feedback Reports</span>
            <Button
              onClick={() => {
                getVoiceReportFunc();
              }}
            >
              Refresh
            </Button>
          </div>
          {Array.isArray(voiceReportData) && voiceReportData.length > 0 ? (
            <div className="grid gap-6">
              {voiceReportData.map((report: VoiceReportData, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-sm bg-gray-200 dark:bg-gray-700"
                >
                  <h2 className="text-lg font-bold mb-4">Report {index + 1}</h2>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* General Opinion */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span className="font-bold text-lg">
                          General Opinion
                        </span>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          {report.general_opinion?.opinion ??
                            "Generating report..."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Feedbacks:{" "}
                          {report.general_opinion?.total_feedbacks ??
                            "Generating report..."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Positive:{" "}
                          {report.general_opinion?.positive_percentage ??
                            "Generating report..."}
                          %
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Negative:{" "}
                          {report.general_opinion?.negative_percentage ??
                            "Generating report..."}
                          %
                        </p>
                      </CardContent>
                    </Card>

                    {/* Positive Summary */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span className="font-bold text-lg">
                          Positive Summary
                        </span>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          {report.summary?.positive_summary ??
                            "Generating report..."}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Negative Summary */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span className="font-bold text-lg">
                          Negative Summary
                        </span>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          {report.summary?.negative_summary ??
                            "Generating report..."}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Overall Summary */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <span className="font-bold text-lg">
                          Overall Summary
                        </span>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          {report.overall_summary ?? "Generating report..."}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              No voice reports available.
            </p>
          )}
        </div>
        <Button
          onClick={() => {
            getAudienceDataFunc();
            setShowVoiceData(!showVoiceData);
          }}
        >
          Show Voice Feedbacks
        </Button>
        {showVoiceData && (
          <div>
            {audienceData.length != 0 ? (
              <div className="text-lg font-bold flex items-center space-x-1 my-3">
                <span>Voice Feedbacks </span>
              </div>
            ) : (
              <div className="text-lg font-bold flex items-center space-x-1 my-3">
                <span>No Voice Feedbacks Recorded</span>
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
        )}
      </div>
    </div>
  );
}
