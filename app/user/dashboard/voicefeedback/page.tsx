"use client";

import { useState, useEffect, useRef, MutableRefObject } from "react";
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
  const [audio, setAudio] = useState<Blob>(
    new Blob([], { type: "audio/webm;codecs=opus" }) // Default to opus
  );
  const mediaRecorder: MutableRefObject<MediaRecorder | null> = useRef(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [audienceData, setAudienceData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    [key: string]: string; // Index signature
  }>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        mediaRecorder.current = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });
        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prevChunks) => [...prevChunks, event.data]);
          }
        };

        mediaRecorder.current.onstop = () => {
          try {
            const audioBlob = new Blob(audioChunks, {
              type: "audio/webm;codecs=opus",
            });
            setAudio(audioBlob);
            setAudioChunks([]);
            stopMicrophone();
          } catch (blobError) {
            console.error("Error creating audio blob:", blobError);
          }
        };
        mediaRecorder.current.onerror = (event) => {
          console.error("MediaRecorder error:", event.error);
          setIsRecording(false);
          setIsPaused(false);
          setRecordingStored(false);
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
        try {
          mediaRecorder.current.stop();
        } catch (stopError) {
          console.error("Error stopping MediaRecorder:", stopError);
        }
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

  const sendAudioToBackend = async () => {
    const cookie: { event: string; role: string } = await getCookie("event");
    const formData = new FormData();
    if (audio) {
      formData.append("file", audio, "recording.webm"); // Use .webm extension
    }
    for (const key in audienceData) {
      if (
        audienceData.hasOwnProperty(key) &&
        String(audienceData[key]) !== ""
      ) {
        formData.append(key, audienceData[key]);
      }
    }
    console.log(cookie);
    if (cookie?.event) {
      formData.append("event_name", String(cookie.event));
    }

    const response = await sendVoiceFeedback(formData);
    console.log(response);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingStored(false);
    setAudioChunks([]);
    stopMicrophone();
  };

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
                ? "bg-black text-white border-gray-300 hover:bg-gray-400"
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
        <div className="flex justify-center mt-2 space-x-2">
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
        <div>
          <div className="flex justify-center mt-2 mb-4">
            <Button onClick={handleRemoveStored}>Discard Recording</Button>
          </div>
          <Card className="col-span-4 p-4">
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="audience-name" className="w-24">
                    Name
                  </Label>
                  <Input
                    id="audience-name"
                    type="text"
                    name="name"
                    value={audienceData.name}
                    onChange={(e) => {
                      setAudienceData({
                        ...audienceData,
                        name: e.target.value,
                      });
                    }}
                    placeholder={audienceData.name}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="audience-email" className="w-24">
                    Email
                  </Label>
                  <Input
                    id="audience-email"
                    type="text"
                    name="email"
                    value={audienceData.email}
                    onChange={(e) => {
                      setAudienceData({
                        ...audienceData,
                        email: e.target.value,
                      });
                    }}
                    placeholder={audienceData.email}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="audience-phone" className="w-24">
                    Phone
                  </Label>
                  <Input
                    id="audience-phone"
                    type="text"
                    name="phone"
                    value={audienceData.phone}
                    onChange={(e) => {
                      setAudienceData({
                        ...audienceData,
                        phone: e.target.value,
                      });
                    }}
                    placeholder={audienceData.phone}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="audience-address" className="w-24">
                    Address
                  </Label>
                  <Input
                    id="audience-address"
                    type="text"
                    name="address"
                    value={audienceData.address}
                    onChange={(e) => {
                      setAudienceData({
                        ...audienceData,
                        address: e.target.value,
                      });
                    }}
                    placeholder={audienceData.address}
                    className="flex-1"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    className="flex items-center"
                    onClick={sendAudioToBackend}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {recordingStored && (
            <div>
              <audio
                controls
                src={URL.createObjectURL(audio)}
                preload="metadata"
                onLoadedMetadata={() => console.log("Audio metadata loaded")}
                onLoadedData={() => console.log("Audio data loaded")}
                onCanPlay={() => console.log("Audio can play")}
                onError={(error) => console.error("Audio error:", error)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecordingPage;
