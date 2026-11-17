"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Loader2,
  Clock,
  ArrowLeft,
  Radio,
  Volume2,
  Bot,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { createFeedback } from "@/lib/actions/general.action";
import { Badge } from "@/components/ui/badge";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  role,
  level,
  interviewType,
  techstack,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [duration, setDuration] = useState(0);
  const [micVolume, setMicVolume] = useState(0); // 0-100 mic level
  const [isMuted, setIsMuted] = useState(false);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === CallStatus.ACTIVE) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Vapi event listeners
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setDuration(0);
      setIsMuted(false);
      setMicVolume(0);
      try {
        vapi.setMuted(false);
        vapi.startLocalAudioLevelObserver(100).catch(() => {});
      } catch {
        // observer will start automatically if already active
      }
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setMicVolume(0);
      setIsMuted(false);
    };

    const onLocalVolumeLevel = (volume: number) => {
      // volume is between 0 and 1
      const normalized = Math.min(100, Math.round(volume * 100));
      setMicVolume(normalized);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("Vapi Error:", error);
      toast.error(`Voice error: ${error?.message || "Unknown error"}`, {
        duration: 5000,
      });
      setCallStatus(CallStatus.INACTIVE);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("local-volume-level", onLocalVolumeLevel);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("local-volume-level", onLocalVolumeLevel);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
      vapi.stop(); // stop the call when leaving the page
    };
  }, []);

  // Handle messages and feedback generation
  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      const hasUserSpoken = messages.some((m) => m.role === "user");
      if (!hasUserSpoken) {
        toast.error(
          "No response detected from you. Please check your mic and try again."
        );
        router.push("/dashboard");
        return;
      }

      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/dashboard");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/dashboard");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  // Handle call initiation
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    // Explicitly check mic permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      // Small pause to allow hardware audio device to release cleanly
      await new Promise((resolve) => setTimeout(resolve, 150));
    } catch {
      toast.error(
        "Microphone access denied. Please allow mic in browser settings and try again."
      );
      setCallStatus(CallStatus.INACTIVE);
      return;
    }

    try {
      if (type === "generate") {
        const generateAssistantId =
          process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID;

        if (!generateAssistantId) {
          throw new Error(
            "Set NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID for interview generation."
          );
        }

        await vapi.start(generateAssistantId, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

        if (!assistantId) {
          throw new Error("Set NEXT_PUBLIC_VAPI_ASSISTANT_ID.");
        }

        const formattedQuestions = questions
          ?.map((question) => `- ${question}`)
          .join("\n");

        await vapi.start(assistantId, {
          variableValues: {
            username: userName,
            questions: formattedQuestions ?? "",
            role: role ?? "",
            level: level ?? "",
            techstack: Array.isArray(techstack)
              ? techstack.join(", ")
              : techstack ?? "",
          },
        });
      }
    } catch (error) {
      console.error("Unable to start Vapi call:", error);
      setCallStatus(CallStatus.INACTIVE);
      toast.error(
        "Unable to start the AI call. Please check the Vapi configuration."
      );
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    setMicVolume(0);
    setIsMuted(false);
    vapi.stop();
  };

  // Toggle mic mute
  const toggleMute = () => {
    if (callStatus !== CallStatus.ACTIVE) return;
    const next = !isMuted;
    try {
      vapi.setMuted(next);
      setIsMuted(next);
      toast.info(next ? "Microphone muted" : "Microphone active");
    } catch (e) {
      console.error("Failed to toggle mute:", e);
    }
  };

  // Typo and display title normalization
  const cleanRole = (role || "Technical")
    .replace(/devloper/gi, "Developer")
    .trim();
  const title = cleanRole.toLowerCase().includes("interview")
    ? cleanRole
    : `${cleanRole} Interview`;

  // User initials
  const userInitials = userName
    ? userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "ME";

  // Last active message details
  const lastMessageObj =
    messages.length > 0 ? messages[messages.length - 1] : null;
  const isAILastSpeaker = lastMessageObj?.role === "assistant";

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto min-h-[calc(100vh-140px)] justify-between relative">
      {/* Header: Title, Level Badge, Type, Timer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0F0F1A]/80 border border-white/[0.08] backdrop-blur-xl shadow-lg">
        {/* Left: Back Link and Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center size-9 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Back to Dashboard"
            title="Back to Dashboard"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>

          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold text-white capitalize flex items-center gap-2">
              {title}
            </h1>
            <p className="text-xs text-slate-400">
              Interactive AI Mock Interview Session
            </p>
          </div>
        </div>

        {/* Right: Badges and Live Timer */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {level && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {level} Level
            </span>
          )}

          {interviewType && (
            <Badge variant="mixed" className="text-xs font-semibold capitalize">
              {interviewType}
            </Badge>
          )}

          {/* Call Status / Timer Badge */}
          <div
            className={cn(
              "flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold transition-colors",
              callStatus === CallStatus.ACTIVE
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                : callStatus === CallStatus.CONNECTING
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse"
                : "bg-white/5 text-slate-400 border border-white/10"
            )}
            role="status"
            aria-live="polite"
          >
            <span
              className={cn(
                "size-2 rounded-full",
                callStatus === CallStatus.ACTIVE
                  ? "bg-emerald-400 animate-ping"
                  : callStatus === CallStatus.CONNECTING
                  ? "bg-amber-400 animate-pulse"
                  : "bg-slate-500"
              )}
              aria-hidden="true"
            />
            <Clock className="size-3.5" aria-hidden="true" />
            <span>
              {callStatus === CallStatus.ACTIVE
                ? formatTimer(duration)
                : callStatus === CallStatus.CONNECTING
                ? "Connecting..."
                : "00:00"}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Dual Stage Cards (AI Interviewer and User) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 w-full flex-1 items-stretch">
        {/* CARD 1: AI Interviewer */}
        <div
          className={cn(
            "relative flex flex-col items-center justify-between p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-[#14122C] to-[#0D0D1A] border transition-all duration-500 overflow-hidden min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]",
            isSpeaking
              ? "border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.25)]"
              : "border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* Ambient background glow when speaking */}
          <div
            className={cn(
              "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent_70%)] pointer-events-none transition-opacity duration-500",
              isSpeaking ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
          />

          {/* Card Top: Status Tag */}
          <div className="relative z-10 w-full flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="size-3.5 text-indigo-400" aria-hidden="true" />
              <span>Voice AI Agent</span>
            </span>

            {isSpeaking ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full bg-indigo-400 animate-ping"
                  aria-hidden="true"
                />
                <span>Speaking</span>
              </span>
            ) : callStatus === CallStatus.ACTIVE ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                <span
                  className="size-1.5 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                <span>Listening</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-400">
                Ready
              </span>
            )}
          </div>

          {/* Card Middle: Big Avatar with Glow / Pulse Rings */}
          <div className="relative z-10 my-4 sm:my-6 flex items-center justify-center">
            {isSpeaking && (
              <>
                <span
                  className="absolute size-36 sm:size-48 lg:size-56 rounded-full bg-indigo-500/15 animate-ping"
                  aria-hidden="true"
                />
                <span
                  className="absolute size-32 sm:size-44 lg:size-52 rounded-full border-2 border-indigo-400/40 animate-pulse"
                  aria-hidden="true"
                />
                <span
                  className="absolute size-28 sm:size-40 lg:size-48 rounded-full border border-indigo-500/25"
                  aria-hidden="true"
                />
              </>
            )}

            {/* Main Avatar Circle */}
            <div
              className={cn(
                "relative flex items-center justify-center size-28 sm:size-36 lg:size-44 rounded-full overflow-hidden p-2 bg-[#0D0D1A] transition-all duration-300",
                isSpeaking
                  ? "shadow-[0_0_40px_rgba(99,102,241,0.6)]"
                  : "border-2 border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.2)]"
              )}
            >
              <Image
                src="/robot.svg"
                alt="AI Interviewer"
                width={176}
                height={176}
                className="size-full object-contain select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Card Bottom: Title and Waveform Visualizer */}
          <div className="relative z-10 flex flex-col items-center text-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              AI Interviewer
            </h2>

            <div className="flex items-center gap-1.5 h-6">
              {isSpeaking ? (
                <div
                  className="flex items-center gap-1"
                  aria-label="AI is speaking"
                >
                  <span className="w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.35s] h-3.5" />
                  <span className="w-1 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.2s] h-5" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.1s] h-6" />
                  <span className="w-1 bg-purple-300 rounded-full animate-bounce [animation-delay:-0.25s] h-4" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s] h-[22px]" />
                  <span className="w-1 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                </div>
              ) : (
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Volume2
                    className="size-3.5 text-slate-400"
                    aria-hidden="true"
                  />
                  <span>Vapi Neural Voice • Ready</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CARD 2: User / Candidate */}
        <div className="relative flex flex-col items-center justify-between p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-[#111122] to-[#0A0A14] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-500 overflow-hidden min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]">
          {/* Card Top: Status Tag */}
          <div className="relative z-10 w-full flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="size-3.5 text-emerald-400" aria-hidden="true" />
              <span>Candidate</span>
            </span>

            {callStatus === CallStatus.ACTIVE && !isSpeaking ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full bg-emerald-400 animate-pulse"
                  aria-hidden="true"
                />
                <span>Your Turn to Speak</span>
              </span>
            ) : callStatus === CallStatus.ACTIVE ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-400 flex items-center gap-1.5">
                <Mic className="size-3 text-slate-400" aria-hidden="true" />
                <span>Mic On</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-400">
                Standby
              </span>
            )}
          </div>

          {/* Card Middle: Big Avatar with Mic Glow Rings */}
          <div className="relative z-10 my-4 sm:my-6 flex items-center justify-center">
            {callStatus === CallStatus.ACTIVE && !isSpeaking && (
              <>
                <span
                  className="absolute size-32 sm:size-44 lg:size-52 rounded-full border-2 border-emerald-400/40 animate-pulse"
                  aria-hidden="true"
                />
                <span
                  className="absolute size-28 sm:size-40 lg:size-48 rounded-full border border-emerald-500/20"
                  aria-hidden="true"
                />
              </>
            )}

            {/* Main Avatar Circle */}
            <div
              className={cn(
                "relative flex items-center justify-center size-28 sm:size-36 lg:size-44 rounded-full transition-all duration-300",
                callStatus === CallStatus.ACTIVE && !isSpeaking
                  ? "bg-gradient-to-br from-[#065F46] to-[#047857] shadow-[0_0_40px_rgba(16,185,129,0.5)] border-2 border-emerald-400/50"
                  : "bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              )}
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wider">
                {userInitials}
              </span>

              {/* Online mic dot */}
              <span
                className="absolute bottom-2 right-2 size-3.5 sm:size-4 rounded-full bg-emerald-400 ring-4 ring-[#0F0F1A]"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Card Bottom: User Name and Audio Status */}
          <div className="relative z-10 flex flex-col items-center text-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {userName || "Candidate"}
            </h2>

            {/* Live Mic Volume Meter */}
            {callStatus === CallStatus.ACTIVE ? (
              <div className="flex flex-col items-center gap-1.5 w-full max-w-[170px]">
                {isMuted ? (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <MicOff className="size-3.5" aria-hidden="true" />
                    <span>Microphone Muted</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <Mic className="size-3.5" aria-hidden="true" />
                      <span>
                        {micVolume > 5
                          ? `Speaking (${micVolume}%)`
                          : isSpeaking
                          ? "Interviewer Speaking"
                          : "Listening for your voice..."}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-100",
                          micVolume > 60
                            ? "bg-emerald-400"
                            : micVolume > 20
                            ? "bg-teal-400"
                            : "bg-indigo-400"
                        )}
                        style={{ width: `${Math.max(8, micVolume)}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 h-6">
                <Mic className="size-3.5 text-emerald-400" aria-hidden="true" />
                <span>Microphone Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Transcript Panel */}
      <div
        className="w-full rounded-2xl bg-[#0F0F1A]/80 border border-white/[0.08] backdrop-blur-xl p-4 sm:p-5 shadow-lg transition-all duration-300"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
            <Radio
              className="size-3.5 text-indigo-400 animate-pulse"
              aria-hidden="true"
            />
            <span>Live Audio Transcript</span>
          </div>

          {lastMessage && (
            <span className="text-[11px] text-slate-400 font-medium">
              Turn {messages.length}
            </span>
          )}
        </div>

        {lastMessage ? (
          <div className="flex items-start gap-3 py-1">
            <div
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5",
                isAILastSpeaker
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              )}
            >
              {isAILastSpeaker ? "AI Interviewer" : "You"}
            </div>

            <p
              key={lastMessage}
              className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed transition-opacity duration-300"
            >
              &ldquo;{lastMessage}&rdquo;
            </p>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-400 italic py-1 text-center">
            {callStatus === CallStatus.ACTIVE
              ? "Listening... Speak naturally into your microphone."
              : "Click 'Start Interview' below to connect with your AI interviewer."}
          </p>
        )}
      </div>

      {/* Floating Bottom Control Bar */}
      <div className="sticky bottom-4 z-30 mx-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-8 py-3 rounded-full bg-[#0F0F1A]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_30px_rgba(99,102,241,0.25)] max-w-[calc(100vw-32px)] sm:w-fit">
        {/* Mic Indicator / Mute Toggle Button */}
        <button
          type="button"
          onClick={toggleMute}
          disabled={callStatus !== CallStatus.ACTIVE}
          className={cn(
            "flex items-center gap-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-full p-1 -m-1",
            callStatus === CallStatus.ACTIVE ? "cursor-pointer" : "cursor-default opacity-80",
            isMuted ? "text-amber-300" : "text-slate-300"
          )}
          title={
            callStatus !== CallStatus.ACTIVE
              ? "Microphone ready"
              : isMuted
              ? "Click to unmute microphone"
              : "Click to mute microphone"
          }
        >
          <div
            className={cn(
              "flex items-center justify-center size-8 rounded-full border transition-all shrink-0",
              isMuted
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                : "bg-white/5 border-white/10 text-emerald-400"
            )}
          >
            {isMuted ? (
              <MicOff className="size-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Mic className="size-4 text-emerald-400" aria-hidden="true" />
            )}
          </div>
          <span className="hidden sm:inline">
            {callStatus !== CallStatus.ACTIVE
              ? "Mic Ready"
              : isMuted
              ? "Mic Muted"
              : "Mic Live"}
          </span>
        </button>

        {/* Big Action Call / End Button */}
        <div>
          {callStatus !== CallStatus.ACTIVE ? (
            <button
              onClick={() => handleCall()}
              disabled={callStatus === CallStatus.CONNECTING}
              aria-label="Start Voice Interview"
              className={cn(
                "flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base transition-all duration-300 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]",
                callStatus === CallStatus.CONNECTING
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_24px_rgba(251,191,36,0.4)] animate-pulse"
                  : "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white shadow-[0_0_24px_rgba(52,211,153,0.4)] hover:shadow-[0_0_36px_rgba(52,211,153,0.6)] hover:scale-105 active:scale-95"
              )}
            >
              {callStatus === CallStatus.CONNECTING ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <PhoneCall className="size-5" aria-hidden="true" />
                  <span>Start Interview</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleDisconnect()}
              aria-label="End Voice Interview"
              className="flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-red-500 via-rose-600 to-red-600 hover:from-red-400 hover:to-rose-500 shadow-[0_0_24px_rgba(248,113,113,0.4)] hover:shadow-[0_0_36px_rgba(248,113,113,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
            >
              <PhoneOff className="size-5" aria-hidden="true" />
              <span>End Interview</span>
            </button>
          )}
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span
            className={cn(
              "size-2.5 rounded-full shrink-0",
              callStatus === CallStatus.ACTIVE
                ? "bg-emerald-400 animate-ping"
                : "bg-slate-500"
            )}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">
            {callStatus === CallStatus.ACTIVE ? "In Call" : "Standby"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Agent;