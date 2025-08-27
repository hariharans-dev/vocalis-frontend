"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { createCookie, getCookie } from "@/app/_functions/cookie";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";

export default function AudienceReport() {
  interface GeneratedAudienceReportData {
    total_feedbacks: number;
    positive_feedbacks: number;
    negative_feedbacks: number;
    positive_summary: string | null;
    negative_summary: string | null;
    general_opinion: string | null;
    overall_summary: string | null;
  }
  interface AudienceReportData {
    map(
      arg0: (report: any, index: number) => JSX.Element
    ): import("react").ReactNode;
    length: number;
    total_feedbacks: number;
    positive_feedbacks: number;
    negative_feedbacks: number;
    positive_summary: string | null;
    negative_summary: string | null;
    general_opinion: string | null;
    overall_summary: string | null;
  }

  const [selectedMinutes, setSelectedMinutes] = useState<string>("1");
  const [generating, setGenerating] = useState(false);
  const [AudienceReportData, setAudienceReportData] = useState<
    AudienceReportData[] | null
  >(null);
  const [generatedAudienceReportData, setGeneratedAudienceReportData] =
    useState<GeneratedAudienceReportData>({
      total_feedbacks: 0,
      positive_feedbacks: 0,
      negative_feedbacks: 0,
      positive_summary: null,
      negative_summary: null,
      general_opinion: null,
      overall_summary: null,
    });
  const [showVoiceData, setShowVoiceData] = useState(false);
  const [voiceFeedbackResponseData, setVoiceFeedbackResponseData] =
    useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timely = async () => {
    getAudienceReportFunc(1);
    createAudienceReportFunc(false);
  };

  const startGenerating = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setGenerating(true);
    timely();
    intervalRef.current = setInterval(
      timely,
      Number(selectedMinutes) * 60 * 1000
    );
  };

  const stopGenerating = () => {
    setGenerating(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const createAudienceReportFunc = async (UserData: Boolean = true) => {
    const raw = document.cookie
      .split("; ")
      .find((r) => r.startsWith("eventToken="))
      ?.split("=")[1];
    const cookie = raw ? JSON.parse(atob(raw)) : null;
    if (cookie && "event" in cookie) {
      const res = await fetch("/api/audience/report", {
        method: "POST",
        body: JSON.stringify({ event_name: cookie.event }),
      });
      const response = await res.json();
      if (response?.data?.response && UserData) {
        setVoiceFeedbackResponseData(String(response.data.response));
      } else if (response?.error?.response) {
        setVoiceFeedbackResponseData("no subscription");
      }
    }
  };

  const getAudienceReportFunc = async (limit: any = null) => {
    const raw = document.cookie
      .split("; ")
      .find((r) => r.startsWith("eventToken="))
      ?.split("=")[1];
    const cookie = raw ? JSON.parse(atob(raw)) : null;
    if (cookie?.event) {
      let data: any = { event_name: cookie.event };
      if (limit) {
        data.limit = limit;
      }
      const res = await fetch("/api/audience/report/get", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (
        response?.status === "success" &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        if (limit) {
          setGeneratedAudienceReportData(response.data[0]);
        } else {
          setAudienceReportData(response.data);
        }
      }
    }
  };

  useEffect(() => {
    getAudienceReportFunc();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {voiceFeedbackResponseData === "no subscription" ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-xl shadow-md">
          <p className="text-lg font-semibold text-gray-700">
            You need a subscription to generate new Audience Reports.
          </p>
          <Button
            className="px-6 py-2"
            onClick={() => (window.location.href = "/root/dashboard/subscription")}
          >
            Subscribe Now
          </Button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-lg sm:text-xl font-bold">
              Create Audience Feedback Report
            </h1>
            <Button onClick={() => createAudienceReportFunc()}>Create</Button>
          </div>

          {voiceFeedbackResponseData && (
            <p className="text-red-500 text-sm">{voiceFeedbackResponseData}</p>
          )}

          {/* Refresh Interval Selector */}
          <div className="flex flex-wrap items-center gap-4">
            <Label htmlFor="minutes" className="text-lg font-semibold">
              Select Refresh Interval:
            </Label>
            <Select onValueChange={setSelectedMinutes} value={selectedMinutes}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent className="max-h-40 overflow-y-auto p-1">
                {Array.from({ length: 60 }, (_, i) => (
                  <SelectItem
                    key={i + 1}
                    value={(i + 1).toString()}
                    className="p-2 text-sm"
                  >
                    {i + 1} min
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={startGenerating} disabled={generating}>
              Start
            </Button>
            <Button onClick={stopGenerating} disabled={!generating}>
              Stop
            </Button>
            <Button
              onClick={() => getAudienceReportFunc(1)}
              disabled={!generating}
            >
              Refresh
            </Button>
          </div>

          {generating && (
            <div className="flex justify-center w-full">
              <Card className="w-full max-w-screen-sm p-4 shadow-md">
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <strong>General Opinion:</strong>{" "}
                    {generatedAudienceReportData.general_opinion ??
                      "Generating..."}
                  </p>
                  <p>
                    <strong>Positive:</strong>{" "}
                    {generatedAudienceReportData.total_feedbacks
                      ? (
                          (generatedAudienceReportData.positive_feedbacks /
                            generatedAudienceReportData.total_feedbacks) *
                          100
                        ).toFixed(1)
                      : "0"}
                    %
                  </p>
                  <p>
                    <strong>Negative:</strong>{" "}
                    {generatedAudienceReportData.total_feedbacks
                      ? (
                          (generatedAudienceReportData.negative_feedbacks /
                            generatedAudienceReportData.total_feedbacks) *
                          100
                        ).toFixed(1)
                      : "0"}
                    %
                  </p>
                  <p>
                    <strong>Positive Summary:</strong>{" "}
                    {generatedAudienceReportData.positive_summary ??
                      "Generating..."}
                  </p>
                  <p>
                    <strong>Negative Summary:</strong>{" "}
                    {generatedAudienceReportData.negative_summary ??
                      "Generating..."}
                  </p>
                  <p>
                    <strong>Overall Summary:</strong>{" "}
                    {generatedAudienceReportData.overall_summary ??
                      "Generating..."}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* --- always show reports section --- */}
      <Button
        className="w-[80%] sm:w-auto sm:px-4 py-2 mt-2 sm:mt-0"
        onClick={() => setShowVoiceData(!showVoiceData)}
      >
        {showVoiceData ? "Hide" : "Show"} Reports
      </Button>
      {showVoiceData && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold">
              All Audience Feedback Reports
            </h2>
            <Button onClick={() => getAudienceReportFunc()}>Refresh</Button>
          </div>

          {Array.isArray(AudienceReportData) &&
          AudienceReportData.length > 0 ? (
            <div className="grid gap-4">
              {AudienceReportData.map(
                (report: AudienceReportData, index: number) => {
                  const posPercent = report.total_feedbacks
                    ? (
                        (report.positive_feedbacks / report.total_feedbacks) *
                        100
                      ).toFixed(1)
                    : "0";
                  const negPercent = report.total_feedbacks
                    ? (
                        (report.negative_feedbacks / report.total_feedbacks) *
                        100
                      ).toFixed(1)
                    : "0";

                  return (
                    <Card key={index} className="p-4 shadow-md">
                      <CardHeader>
                        <h3 className="text-lg font-bold">
                          Report {index + 1}
                        </h3>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>
                          <strong>General Opinion:</strong>{" "}
                          {report.general_opinion ?? "Generating..."}
                        </p>
                        <p>
                          <strong>Positive:</strong> {posPercent}%
                        </p>
                        <p>
                          <strong>Negative:</strong> {negPercent}%
                        </p>
                        <p>
                          <strong>Positive Summary:</strong>{" "}
                          {report.positive_summary ?? "Generating..."}
                        </p>
                        <p>
                          <strong>Negative Summary:</strong>{" "}
                          {report.negative_summary ?? "Generating..."}
                        </p>
                        <p>
                          <strong>Overall Summary:</strong>{" "}
                          {report.overall_summary ?? "Generating..."}
                        </p>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              No Audience reports available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
