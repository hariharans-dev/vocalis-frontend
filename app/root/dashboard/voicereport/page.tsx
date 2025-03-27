"use client";

import { JSX, useEffect, useState } from "react";
import { createCookie, getCookie } from "@/app/_functions/cookie";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getVoiceData,
  createVoiceReport,
  getVoiceReport,
} from "@/app/_api/voicereport/VoiceReport";

export default function AudienceFeedback() {
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
  const [showVoiceReport, setShowVoiceReport] = useState(true);
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
      if (response?.data?.response) {
        setVoiceFeedbackResponseData(String(response.data.response));
      }
    }
  };

  const getVoiceReportFunc = async () => {
    const cookie = await getCookie("event");
    if (cookie?.event) {
      const response = await getVoiceReport(String(cookie.event));

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
        {voiceFeedbackResponseData && (
          <p className="text-red-500 text-sm">{voiceFeedbackResponseData}</p>
        )}

        <div className="text-lg font-bold flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3 my-3 text-center">
          <span className="w-full sm:w-auto">Create Voice Feedback Report</span>

          <Button
            className="w-[80%] sm:w-auto sm:px-4 py-2 mt-2 sm:mt-0"
            onClick={createVoiceReportFunc}
          >
            Create
          </Button>
        </div>

        <div className="text-lg font-bold flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3 my-3 sm:my-4 text-center">
          <span className="w-full sm:w-auto">Voice Feedback</span>

          <Button
            className="w-[80%] sm:w-auto sm:px-4 py-2 mt-2 sm:mt-0"
            onClick={() => {
              setShowVoiceData(false);
              setShowVoiceReport(!showVoiceReport);
            }}
          >
            {showVoiceReport ? "Hide" : "Show"} Voice Feedback Reports
          </Button>

          <Button
            className="w-[80%] sm:w-auto sm:px-4 py-2 mt-2 sm:mt-0"
            onClick={getVoiceReportFunc}
          >
            Refresh
          </Button>

          <Button
            className="w-[80%] sm:w-auto sm:px-4 py-2 mt-2 sm:mt-0"
            onClick={() => {
              getAudienceDataFunc();
              setShowVoiceData(!showVoiceData);
              setShowVoiceReport(false);
            }}
          >
            {showVoiceData ? "Hide" : "Show"} Voice Feedbacks
          </Button>
        </div>

        {showVoiceReport &&
          (Array.isArray(voiceReportData) && voiceReportData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {voiceReportData.map((report: VoiceReportData, index: number) => (
                <Card key={index} className="p-4 shadow-md">
                  <CardHeader>
                    <h3 className="text-lg font-bold">Report {index + 1}</h3>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <strong>General Opinion:</strong>{" "}
                      {report.general_opinion?.opinion ?? "Generating..."}
                    </p>
                    <p>
                      <strong>Total Feedbacks:</strong>{" "}
                      {report.general_opinion?.total_feedbacks ??
                        "Generating..."}
                    </p>
                    <p>
                      <strong>Positive:</strong>{" "}
                      {report.general_opinion?.positive_percentage ??
                        "Generating..."}
                      %
                    </p>
                    <p>
                      <strong>Negative:</strong>{" "}
                      {report.general_opinion?.negative_percentage ??
                        "Generating..."}
                      %
                    </p>
                    <p>
                      <strong>Positive Summary:</strong>{" "}
                      {report.summary?.positive_summary ?? "Generating..."}
                    </p>
                    <p>
                      <strong>Negative Summary:</strong>{" "}
                      {report.summary?.negative_summary ?? "Generating..."}
                    </p>
                    <p>
                      <strong>Overall Summary:</strong>{" "}
                      {report.overall_summary ?? "Generating..."}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              No voice reports available.
            </p>
          ))}

        {/* Voice Feedback Section */}
        {showVoiceData && (
          <div>
            {audienceData.length === 0 ? (
              <p className="text-center text-sm text-gray-500">
                No Voice Feedbacks Recorded
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {audienceData.map((item: any) => (
                  <Card key={item.id} className="p-4 shadow-md">
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
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-muted-foreground">
                      {item.audience.name && (
                        <p>
                          <strong>Name:</strong> {item.audience.name}
                        </p>
                      )}
                      {item.audience.email && (
                        <p>
                          <strong>Email:</strong> {item.audience.email}
                        </p>
                      )}
                      {item.audience.phone && (
                        <p>
                          <strong>Phone:</strong> {item.audience.phone}
                        </p>
                      )}
                      {item.audience.address && (
                        <p>
                          <strong>Address:</strong> {item.audience.address}
                        </p>
                      )}
                      <p>
                        <strong>Feedback:</strong> {item.data}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
