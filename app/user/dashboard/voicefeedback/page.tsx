"use client";

import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mic, Pause, Play, Square } from "lucide-react";
import { useTheme } from "next-themes";

function RecordingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingStored, setRecordingStored] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorder: MutableRefObject<MediaRecorder | null> = useRef(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prevChunks) => [...prevChunks, event.data]);
          }
        };

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log("Recording URL:", audioUrl);
          setAudioChunks([]);
          stopMicrophone();
        };

        mediaRecorder.current.start();
        setIsRecording(true);
        setIsPaused(false);
        console.log("Recording started");
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      if (
        mediaRecorder.current &&
        mediaRecorder.current.state === "recording"
      ) {
        mediaRecorder.current.stop();
      }
      setIsRecording(false);
      setIsPaused(false);
      setRecordingStored(true);
      console.log("Recording stored");
    }
  };

  const handlePause = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.pause();
    } else if (
      mediaRecorder.current &&
      mediaRecorder.current.state === "paused"
    ) {
      mediaRecorder.current.resume();
    }
    setIsPaused(!isPaused);
    console.log(isPaused ? "Recording resumed" : "Recording paused");
  };

  const handleDiscard = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingStored(false);
    setAudioChunks([]);
    stopMicrophone();
    console.log("Recording discarded");
  };

  const handleRemoveStored = () => {
    setRecordingStored(false);
    stopMicrophone();
    console.log("Stored recording removed");
  };

  const stopMicrophone = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (theme === undefined) {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    }
    setIsClient(true);
  }, [theme, setTheme]);

  if (!isClient) {
    return (
      <div className="flex flex-col h-screen justify-center items-center p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center p-6">
      <div className="flex-grow flex items-center justify-center">
        {!isRecording && !recordingStored ? (
          <Button
            variant="destructive"
            size={"lg"}
            className={cn(
              "rounded-full w-48 h-48 flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 border-4",
              theme === "dark"
                ? "bg-black text-white border-gray-300"
                : "bg-white text-black "
            )}
            onClick={handleRecord}
          >
            <Mic className="w-24 h-24" />
          </Button>
        ) : isRecording ? (
          <div
            className={cn(
              "w-48 h-48 rounded-full animate-pulse shadow-md flex items-center justify-center",
              isPaused ? "bg-yellow-500" : "bg-red-500"
            )}
            onClick={handleRecord}
          >
            {isPaused ? (
              <Pause className="w-24 h-24" />
            ) : (
              <Mic className="w-24 h-24" />
            )}
          </div>
        ) : (
          <div className="w-48 h-48 flex items-center justify-center">
            <Mic className="w-24 h-24 text-green-500" />
          </div>
        )}
      </div>

      {isRecording && (
        <div className="flex justify-center mt-4 space-x-2">
          {" "}
          {/* space-x-2 for small gap */}
          <Button
            variant="secondary"
            className={
              theme === "dark" ? "bg-black text-white" : "bg-white text-black"
            }
            onClick={handlePause}
          >
            {isPaused ? <Play className="mr-2" /> : <Pause className="mr-2" />}
          </Button>
          <Button
            variant="destructive"
            className={
              theme === "dark" ? "bg-black text-white" : "bg-white text-black"
            }
            onClick={handleDiscard}
          >
            <Square className="mr-2" /> Discard
          </Button>
        </div>
      )}
      {recordingStored && (
        <div className="flex justify-center mt-4">
          <Button
            variant="destructive"
            className={
              theme === "dark" ? "bg-black text-white" : "bg-white text-black"
            }
            onClick={handleRemoveStored}
          >
            Discard Recording
          </Button>
        </div>
      )}
    </div>
  );
}

export default RecordingPage;
