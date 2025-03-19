"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mic, Pause, Play, Square } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { sendVoiceFeedback } from "@/app/_api/user/voicefeedback/sendVoiceFeedback";
import { getCookie } from "@/app/_functions/cookie";

function RecordingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingStored, setRecordingStored] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [audienceData, setAudienceData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
    setIsClient(true);
  }, [setTheme]);

  const audioChunksRef = useRef<Blob[]>([]); // Use ref instead of state

  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        const media = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorder.current = media;
        audioChunksRef.current = []; // Reset before recording starts

        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.current.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });
            setAudio(URL.createObjectURL(audioBlob));
            setRecordingStored(true); // ✅ Ensure the form displays immediately
          }
          stopMicrophone();
        };

        mediaRecorder.current.start();
        setIsRecording(true);
        setIsPaused(false);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      stopRecording();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (mediaRecorder.current) {
      isPaused ? mediaRecorder.current.resume() : mediaRecorder.current.pause();
      setIsPaused(!isPaused);
    }
  };

  const handleDiscard = () => {
    stopRecording();
    setRecordingStored(false);
    setAudioChunks([]);
    setAudio(null);
  };

  const handleRemoveStored = () => {
    setRecordingStored(false);
    stopMicrophone();
    setAudio(null);
  };

  const stopMicrophone = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const sendAudioToBackend = async () => {
    const cookie = await getCookie("event");
    const formData = new FormData();

    if (audio) {
      const response = await fetch(audio);
      const blob = await response.blob();
      formData.append("file", blob, "recording.webm");
    }

    Object.entries(audienceData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (cookie?.event) formData.append("event_name", String(cookie.event));

    const response = await sendVoiceFeedback(formData);
    console.log(response);
    handleDiscard();
  };

  if (!isClient) {
    return (
      <div className="flex flex-col h-screen justify-center items-center p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center p-6">
      <Button
        onClick={isRecording ? stopRecording : handleRecord}
        className="rounded-full w-48 h-48"
      >
        {isRecording ? (
          <Square className="w-24 h-24" />
        ) : (
          <Mic className="w-24 h-24" />
        )}
      </Button>
      {isRecording && (
        <Button onClick={handlePause}>{isPaused ? <Play /> : <Pause />}</Button>
      )}
      {recordingStored && (
        <Card className="p-4">
          <CardContent>
            {Object.entries(audienceData).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Label>{key}</Label>
                <Input
                  value={value}
                  onChange={(e) =>
                    setAudienceData({ ...audienceData, [key]: e.target.value })
                  }
                />
              </div>
            ))}
            <Button onClick={sendAudioToBackend}>Submit</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default RecordingPage;
