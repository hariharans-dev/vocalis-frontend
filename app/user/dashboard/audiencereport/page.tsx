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
import {
  getVoiceData,
  createVoiceReport,
  getVoiceReport,
} from "@/app/_api/user/voicereport/VoiceReport";
import { Label } from "@/components/ui/label";
import {
  createAudienceReport,
  getAudienceReport,
} from "@/app/_api/user/audiencereport/Report";

export default function AudienceReport() {
  interface GeneratedAudienceReportData {
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
  interface AudienceReportData {
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

  const [selectedMinutes, setSelectedMinutes] = useState<string>("1");
  const [generating, setGenerating] = useState(false);
  const [AudienceReportData, setAudienceReportData] = useState<
    AudienceReportData[] | null
  >(null);
  const [generatedAudienceReportData, setGeneratedAudienceReportData] =
    useState<GeneratedAudienceReportData>({});
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
    const cookie = await getCookie("event");
    if (cookie && "event" in cookie) {
      const response = await createAudienceReport(String(cookie.event));
      if (response?.data?.response && UserData) {
        setVoiceFeedbackResponseData(String(response.data.response));
      }
    }
  };

  const getAudienceReportFunc = async (limit: any = null) => {
    const cookie = await getCookie("event");
    if (cookie?.event) {
      let data: any = { event_name: cookie.event, view: "all" };
      if (limit) {
        data.limit = limit;
      }
      const response = await getAudienceReport(data);
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
        <Button onClick={() => getAudienceReportFunc(1)} disabled={!generating}>
          Refresh
        </Button>
      </div>

      {generating && (
        <div className="flex justify-center w-full">
          <Card className="w-full max-w-screen-sm p-4 shadow-md">
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>General Opinion:</strong>{" "}
                {generatedAudienceReportData.general_opinion?.opinion ??
                  "Generating..."}
              </p>
              <p>
                <strong>Positive:</strong>{" "}
                {generatedAudienceReportData.general_opinion
                  ?.positive_percentage ?? "Generating..."}
                %
              </p>
              <p>
                <strong>Negative:</strong>{" "}
                {generatedAudienceReportData.general_opinion
                  ?.negative_percentage ?? "Generating..."}
                %
              </p>
              <p>
                <strong>Positive Summary:</strong>{" "}
                {generatedAudienceReportData.summary?.positive_summary ??
                  "Generating..."}
              </p>
              <p>
                <strong>Negative Summary:</strong>{" "}
                {generatedAudienceReportData.summary?.negative_summary ??
                  "Generating..."}
              </p>
              <p>
                <strong>Overall Summary:</strong>{" "}
                {generatedAudienceReportData.overall_summary ?? "Generating..."}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {AudienceReportData.map(
                (report: AudienceReportData, index: number) => (
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
                )
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
