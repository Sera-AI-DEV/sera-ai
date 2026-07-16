import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneCall, PhoneOff, X, Volume2, Sparkles } from "lucide-react";
import Vapi from "@vapi-ai/web";

const VAPI_PUBLIC_KEY = "d78adb77-7a45-4ada-b59b-5ea2cf6613cf";
const ASSISTANT_ID = "121468e2-5cc1-473b-9ed0-be272f3bc7e4";

const SUGGESTIONS = [
  "Try asking: \"What are your opening hours?\"",
  "Try asking: \"How much is a consultation?\"",
  "Try asking: \"Do you have availability today?\"",
  "Try asking: \"Can I book my dog in for a check-up?\"",
];

type CallStatus = "idle" | "connecting" | "active" | "ending";

export default function SeraDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const vapiRef = useRef<Vapi | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const suggestionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setCallStatus("active");
    });

    vapi.on("call-end", () => {
      setCallStatus("idle");
      setIsMuted(false);
      setVolumeLevel(0);
      setIsSpeaking(false);
    });

    vapi.on("speech-start", () => {
      setIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setIsSpeaking(false);
    });

    vapi.on("volume-level", (level: number) => {
      setVolumeLevel(level);
    });

    vapi.on("error", () => {
      setCallStatus("idle");
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      vapi.stop();
    };
  }, []);

  // Rotate suggestion bubbles every 4 seconds while the call is active
  useEffect(() => {
    if (callStatus === "active") {
      setSuggestionIndex(0);
      suggestionTimerRef.current = setInterval(() => {
        setSuggestionIndex((i) => (i + 1) % SUGGESTIONS.length);
      }, 4000);
    } else {
      if (suggestionTimerRef.current) clearInterval(suggestionTimerRef.current);
    }
    return () => {
      if (suggestionTimerRef.current) clearInterval(suggestionTimerRef.current);
    };
  }, [callStatus]);

  // Countdown timer — tracks the 60 second demo limit
  useEffect(() => {
    if (callStatus === "active") {
      setSecondsLeft(60);
      countdownTimerRef.current = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      setSecondsLeft(60);
    }
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [callStatus]);

  const startCall = async () => {
    if (!vapiRef.current || callStatus !== "idle") return;
    setCallStatus("connecting");
    try {
      await vapiRef.current.start(ASSISTANT_ID);
    } catch {
      setCallStatus("idle");
    }
  };

  const endCall = () => {
    if (!vapiRef.current) return;
    setCallStatus("ending");
    vapiRef.current.stop();
  };

  const toggleMute = () => {
    if (!vapiRef.current || callStatus !== "active") return;
    vapiRef.current.setMuted(!isMuted);
    setIsMuted((m) => !m);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    if (callStatus === "active" || callStatus === "connecting") {
      endCall();
    }
    setIsOpen(false);
  };

  const volumeBar = Math.min(100, Math.round(volumeLevel * 100));

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={handleOpen}
            className="fixed bottom-8 right-8 z-50 group flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-4 rounded-full shadow-2xl shadow-primary/40 cursor-pointer border border-primary/30"
            style={{ outline: "none" }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-60" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-foreground" />
            </span>
            <PhoneCall className="w-5 h-5" />
            <span className="text-base">Talk to Sera</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="fixed bottom-8 right-8 z-50 w-[340px] rounded-3xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            <div className="relative p-6 flex flex-col items-center gap-4">
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-1 pt-2">
                <span className="text-xs font-medium text-primary tracking-widest uppercase">Live Demo</span>
                <h3 className="text-xl font-bold tracking-tight">Talk to Sera</h3>
                <p className="text-sm text-muted-foreground text-center max-w-[240px] leading-snug">
                  Experience what your patients will hear when they call your clinic.
                </p>
              </div>

              <div className="relative flex items-center justify-center w-28 h-28 my-2">
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute rounded-full border border-primary/20"
                    style={{ width: `${ring * 32 + 32}px`, height: `${ring * 32 + 32}px` }}
                    animate={
                      isSpeaking
                        ? {
                            scale: [1, 1 + ring * 0.06 + volumeBar * 0.002, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }
                        : callStatus === "active"
                        ? { opacity: [0.15, 0.3, 0.15] }
                        : { opacity: 0.1 }
                    }
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: ring * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                <div
                  className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    callStatus === "active"
                      ? "bg-gradient-to-br from-primary to-blue-500 shadow-lg shadow-primary/40"
                      : callStatus === "connecting"
                      ? "bg-primary/30 border-2 border-primary/50"
                      : "bg-secondary/60 border border-border/50"
                  }`}
                >
                  {callStatus === "connecting" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full"
                    />
                  ) : callStatus === "active" ? (
                    <Volume2 className="w-8 h-8 text-white" />
                  ) : (
                    <PhoneCall className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="w-full text-center min-h-[20px]">
                {callStatus === "connecting" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-primary font-medium"
                  >
                    Connecting to Sera...
                  </motion.p>
                )}
                {callStatus === "active" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground"
                  >
                    {isSpeaking ? (
                      <span className="text-primary font-medium">Sera is speaking...</span>
                    ) : (
                      "Listening — go ahead and speak"
                    )}
                  </motion.p>
                )}
                {callStatus === "ending" && (
                  <p className="text-sm text-muted-foreground">Ending call...</p>
                )}
              </div>

              {/* Rotating suggestion bubble — only shows during an active call */}
              <AnimatePresence mode="wait">
                {callStatus === "active" && (
                  <motion.div
                    key={suggestionIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="w-full flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-xs text-foreground leading-snug">
                      {SUGGESTIONS[suggestionIndex]}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {callStatus === "active" && (
                <div className="w-full bg-secondary/30 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${volumeBar}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              )}

              <div className="flex items-center justify-center gap-4 w-full mt-1">
                {callStatus === "idle" && (
                  <button
                    onClick={startCall}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-2xl transition-colors shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <PhoneCall className="w-5 h-5" />
                    Start Call
                  </button>
                )}

                {(callStatus === "active" || callStatus === "connecting") && (
                  <>
                    <button
                      onClick={toggleMute}
                      disabled={callStatus !== "active"}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors cursor-pointer ${
                        isMuted
                          ? "bg-destructive/20 border border-destructive/40 text-destructive"
                          : "bg-secondary/60 border border-border/50 text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={endCall}
                      className="flex-1 flex items-center justify-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold py-3.5 rounded-2xl transition-colors cursor-pointer"
                    >
                      <PhoneOff className="w-5 h-5" />
                      End Call
                    </button>
                  </>
                )}
              </div>

              <p className={`text-xs text-center pb-1 transition-colors ${
                callStatus === "active" && secondsLeft <= 10
                  ? "text-destructive font-medium"
                  : "text-muted-foreground/60"
              }`}>
                {callStatus === "active"
                  ? `Demo call — ${secondsLeft}s remaining`
                  : callStatus === "idle"
                  ? "Free 60 second demo call"
                  : "Your microphone will be requested when the call starts"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
