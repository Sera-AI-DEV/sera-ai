import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView, useMotionValue, animate } from "framer-motion";
import {
  PhoneCall, CalendarCheck, Clock, Mail, LineChart, ShieldCheck,
  ChevronRight, PhoneMissed, Star, ChevronDown, CheckCircle2,
  MessageSquare, TrendingUp, Users, Zap, DollarSign, Percent, Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import receptionist from "../assets/receptionist.png";

const CALENDLY_URL = "https://calendly.com/aaron-seraai/sera-ai-demo";

function openCalendly() {
  (window as any).Calendly?.initPopupWidget({ url: CALENDLY_URL });
}

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function StatCounter({ value, suffix, prefix = "", label }: {
  value: number; suffix: string; prefix?: string; label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const count = { val: 0 };
    const controls = animate(count.val, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest).toLocaleString()),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-bold mb-2">
        <span>{prefix}</span>
        <span>{display}</span>
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

function AlwaysOnStat() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="text-4xl lg:text-5xl font-bold mb-2"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        24/7
      </motion.div>
      <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Always answering</div>
    </div>
  );
}

const TRANSCRIPT = [
  { role: "patient", text: "Hi, I need to book an appointment for my cat Max — he's been sneezing and has a runny nose." },
  { role: "sera", text: "Hi there! This is Sera from Crown Vets. Poor Max — that does sound uncomfortable. I can get him seen today at 2:30 PM or tomorrow morning at 9:00 AM. Which works best for you?" },
  { role: "patient", text: "Today at 2:30 would be great, thanks." },
  { role: "sera", text: "Perfect! Max is booked in for today at 2:30 PM with Dr. Williams. You'll receive an SMS confirmation shortly. Is there anything else I can help with?" },
  { role: "patient", text: "No that's all, thank you!" },
  { role: "sera", text: "Wonderful — we'll see you and Max at 2:30. Have a great day!" },
];

function LiveTranscript() {
  const [visible, setVisible] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && !running) {
      setRunning(true);
      TRANSCRIPT.forEach((_, i) => {
        setTimeout(() => setVisible(i + 1), i * 1200 + 400);
      });
    }
  }, [inView, running]);

  return (
    <div ref={ref} className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-hide">
      <AnimatePresence>
        {TRANSCRIPT.slice(0, visible).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex gap-3 ${msg.role === "patient" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
              msg.role === "sera"
                ? "bg-gradient-to-br from-primary to-blue-500 text-white"
                : "bg-secondary border border-border text-muted-foreground"
            }`}>
              {msg.role === "sera" ? "S" : "P"}
            </div>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "sera"
                ? "bg-primary/10 border border-primary/20 text-foreground rounded-tl-none"
                : "bg-secondary/60 border border-border text-foreground rounded-tr-none"
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {visible < TRANSCRIPT.length && (
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}
          className="flex gap-2 items-center text-xs text-muted-foreground pl-11">
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 inline-block" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/20 inline-block" />
          </span>
          Sera is typing...
        </motion.div>
      )}
    </div>
  );
}

function AnimatedDollar({ value }: { value: number }) {
  const motionVal = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <>${display.toLocaleString()}</>;
}

function ROICalculator() {
  const [missedCalls, setMissedCalls] = useState(30);
  const [consultValue, setConsultValue] = useState(95);
  const [conversionRate, setConversionRate] = useState(70);

  const weeklyLeak = Math.round((missedCalls * consultValue * conversionRate) / 100);
  const annualLeak = weeklyLeak * 52;
  const monthlyLeak = weeklyLeak * 4;

  return (
    <div className="relative rounded-[2rem] p-[1.5px] bg-gradient-to-br from-primary/50 via-border/30 to-blue-500/40 shadow-[0_0_60px_rgba(0,200,150,0.15)] overflow-hidden">
      <div className="bg-background rounded-[2rem] p-6 sm:p-8 lg:p-12 relative overflow-hidden">
        <div className="hidden md:block absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start relative z-10 min-w-0">
          <div className="min-w-0">
            <div className="text-sm font-medium text-primary uppercase tracking-wider mb-2">Interactive Calculator</div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-8">What is your clinic currently losing?</h3>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <PhoneMissed className="w-4 h-4 text-primary flex-shrink-0" />
                    Missed calls per week
                  </label>
                  <span className="text-2xl font-bold text-primary">{missedCalls}</span>
                </div>
                <input
                  type="range" min={5} max={80} step={1} value={missedCalls}
                  onChange={(e) => setMissedCalls(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>5</span><span>80</span></div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
                    Average consult value
                  </label>
                  <span className="text-2xl font-bold text-primary">${consultValue}</span>
                </div>
                <input
                  type="range" min={50} max={300} step={5} value={consultValue}
                  onChange={(e) => setConsultValue(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>$50</span><span>$300</span></div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Percent className="w-4 h-4 text-primary flex-shrink-0" />
                    Caller conversion rate
                  </label>
                  <span className="text-2xl font-bold text-primary">{conversionRate}%</span>
                </div>
                <input
                  type="range" min={40} max={100} step={5} value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>40%</span><span>100%</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-w-0">
            <div className="relative rounded-2xl overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-destructive/10 rounded-2xl"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative border border-destructive/30 rounded-2xl p-4 sm:p-6 text-center">
                <div className="text-xs font-medium text-destructive uppercase tracking-widest mb-1">Weekly revenue leak</div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-destructive mb-1 break-words">
                  <AnimatedDollar value={weeklyLeak} />
                </div>
                <div className="text-sm text-muted-foreground">slipping through each week</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 min-w-0">
              <div className="bg-secondary/40 border border-border/50 rounded-2xl p-3 sm:p-5 text-center min-w-0">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Monthly</div>
                <div className="text-lg sm:text-2xl font-bold break-words"><AnimatedDollar value={monthlyLeak} /></div>
              </div>
              <div className="bg-secondary/40 border border-border/50 rounded-2xl p-3 sm:p-5 text-center min-w-0">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Annual</div>
                <div className="text-lg sm:text-2xl font-bold break-words"><AnimatedDollar value={annualLeak} /></div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-blue-500/10 rounded-2xl" />
              <div className="relative border-2 border-primary/40 rounded-2xl p-4 sm:p-6 text-center shadow-[0_0_30px_rgba(0,200,150,0.2)]">
                <div className="text-xs font-medium text-primary uppercase tracking-widest mb-1">Sera recovers</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-1 break-words">
                  ~<AnimatedDollar value={Math.round(annualLeak * 0.9)} />
                </div>
                <div className="text-sm text-muted-foreground">per year for your clinic</div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={openCalendly}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-13 rounded-xl mt-2 shadow-[0_0_25px_rgba(0,200,150,0.35)]"
            >
              Book a Demo — Lock In This Revenue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote: "Sera has taken so much pressure off the front desk. Calls that used to go to voicemail during our busiest periods now get answered properly, and clients still get the same warm experience they're used to.",
    name: "Clare",
    clinic: "Practice Manager, Southern Cross Vets",
    rating: 5,
  },
  {
    quote: "It's been a relief having Sera pick up when we're flat out with clients in the clinic. She handles the booking questions so I can actually focus on the people in front of me.",
    name: "Maria",
    clinic: "Receptionist, Southern Cross Vets Eastern Suburbs",
    rating: 5,
  },
  {
    quote: "I was surprised how natural she sounds on the phone. Clients don't seem to mind at all, and it means we're not missing calls when everyone's already on the line.",
    name: "Vanessa",
    clinic: "Receptionist, Southern Cross Vets Surry Hills",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "Will patients know they're talking to an AI?",
    a: "Most patients don't realise — and many don't mind once they know. Sera speaks with a natural Aussie accent, uses conversational language, and is trained specifically on your clinic. She sounds professional, warm, and knowledgeable. We can also introduce her simply as 'Sera, the clinic's receptionist' which is accurate.",
  },
  {
    q: "What happens if Sera can't answer something?",
    a: "Sera is trained to handle the most common call scenarios — bookings, pricing questions, directions, services, and general enquiries. If a call is outside her knowledge or requires urgent clinical attention, she can offer to take a message and flag it for your team to call back, or direct the caller to an emergency line.",
  },
  {
    q: "Does my existing phone number change?",
    a: "Not at all. Your number stays exactly as it is. We simply set up a call forward on your line so that after a chosen number of rings — typically 3 — unanswered calls route to Sera. Patients dial the same number they always have.",
  },
  {
    q: "Which practice management systems does Sera integrate with?",
    a: "Sera works with leading Australian veterinary practice management systems including Ezyvet, Provet Cloud, Vetlink, RxWorks, and Cornerstone. During onboarding we'll confirm your system and configure the integration.",
  },
  {
    q: "How long does it take to get set up?",
    a: "Most clinics are live within 48 hours of onboarding. We handle the setup entirely — you just provide us with your clinic details, services, pricing, and team information and we train Sera from there.",
  },
  {
    q: "What does it cost?",
    a: "Sera is priced as a monthly subscription with no lock-in contracts. Pricing is based on call volume. Book a demo and we'll put together a quote specific to your clinic's needs — most clinics recover the monthly cost within the first week alone.",
  },
];

const SOFTWARE_LOGOS = [
  "Ezyvet", "Provet Cloud", "Vetlink", "RxWorks", "Cornerstone", "Smartflow",
];

function DemoForm() {
  const calendlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const styledUrl = `${CALENDLY_URL}?background_color=ffffff&text_color=0d1117&primary_color=00c896&hide_gdpr_banner=1`;

    if ((window as any).Calendly && calendlyRef.current) {
      calendlyRef.current.innerHTML = "";
      (window as any).Calendly.initInlineWidget({
        url: styledUrl,
        parentElement: calendlyRef.current,
      });
    }
  }, []);

  return (
    <div
      ref={calendlyRef}
      className="rounded-2xl overflow-hidden border border-border/50 bg-white"
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
        open
          ? "border-primary/50 bg-primary/[0.04] shadow-[0_0_25px_rgba(0,200,150,0.12)]"
          : "border-border/50 bg-secondary/10 hover:border-primary/25"
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left transition-colors cursor-pointer"
      >
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            open
              ? "bg-gradient-to-br from-primary to-blue-500 text-white shadow-[0_0_15px_rgba(0,200,150,0.4)]"
              : "bg-secondary/60 border border-border/50 text-muted-foreground"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`font-semibold pr-4 flex-1 transition-colors ${open ? "text-primary" : "text-foreground"}`}>
          {question}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
          <ChevronDown className={`w-5 h-5 transition-colors ${open ? "text-primary" : "text-muted-foreground"}`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[4.25rem]">
              <p className="text-foreground/80 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const JOURNEY_STEPS = [
  { n: "1", title: "Keep Your Number", desc: "Calls simply forward to Sera when your team doesn't answer (typically after 3 rings)." },
  { n: "2", title: "Sera Answers", desc: "Patients hear a professional Aussie receptionist who knows the clinic inside out." },
  { n: "3", title: "Instant Updates", desc: "Sera books straight into the calendar and the summary lands in your inbox immediately." },
];

function JourneySteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.4 });
  const [activeStep, setActiveStep] = useState(-1);
  const [segmentFilled, setSegmentFilled] = useState([false, false]);

  useEffect(() => {
    if (!inView) return;
    const timers = [
      setTimeout(() => setActiveStep(0), 200),
      setTimeout(() => setSegmentFilled((p) => [true, p[1]]), 700),
      setTimeout(() => setActiveStep(1), 1700),
      setTimeout(() => setSegmentFilled((p) => [p[0], true]), 2200),
      setTimeout(() => setActiveStep(2), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={containerRef} className="relative">
      {/* Base track line */}
      <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-[2px] bg-border/40" />

      {/* Segment 1: step 1 -> step 2, fills with a traveling glow */}
      <div className="hidden md:block absolute top-12 left-[16.67%] w-[33.33%] h-[2px] overflow-visible">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-blue-400"
          initial={{ width: "0%" }}
          animate={{ width: segmentFilled[0] ? "100%" : "0%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {segmentFilled[0] && !segmentFilled[1] && (
          <motion.div
            className="absolute top-1/2 w-3 h-3 -mt-1.5 rounded-full bg-primary shadow-[0_0_12px_4px_rgba(0,200,150,0.6)]"
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Segment 2: step 2 -> step 3, fills with a traveling glow */}
      <div className="hidden md:block absolute top-12 left-1/2 w-[33.33%] h-[2px] overflow-visible">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-blue-400"
          initial={{ width: "0%" }}
          animate={{ width: segmentFilled[1] ? "100%" : "0%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {segmentFilled[1] && (
          <motion.div
            className="absolute top-1/2 w-3 h-3 -mt-1.5 rounded-full bg-primary shadow-[0_0_12px_4px_rgba(0,200,150,0.6)]"
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            onAnimationComplete={() => {}}
          />
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-12 text-center relative z-10">
        {JOURNEY_STEPS.map((step, i) => {
          const isActive = activeStep >= i;
          return (
            <div key={i}>
              <div className="relative w-24 h-24 mx-auto mb-6">
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-blue-500 blur-xl"
                  />
                )}
                <div
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-br from-primary to-blue-500 border-primary shadow-[0_0_30px_rgba(0,200,150,0.5)]"
                      : "bg-secondary/40 border-border/50"
                  }`}
                >
                  <span className={`text-3xl font-bold transition-colors duration-500 ${isActive ? "text-white" : "text-muted-foreground"}`}>
                    {step.n}
                  </span>
                </div>
              </div>
              <h3 className={`text-xl font-semibold mb-3 transition-colors duration-500 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30 relative">
      {/* Subtle dot-grid texture across the whole page */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.15] z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10 shadow-[0_1px_20px_rgba(0,200,150,0.08)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-5 h-5">
                <g fill="#ffffff">
                  <rect x="9" y="22" width="6" height="20" rx="3" />
                  <rect x="19" y="16" width="6" height="32" rx="3" />
                  <rect x="29" y="10" width="6" height="44" rx="3" />
                  <rect x="39" y="16" width="6" height="32" rx="3" />
                  <rect x="49" y="22" width="6" height="20" rx="3" />
                </g>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Sera AI</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:aaron@seraai.co?subject=Sera%20AI%20Enquiry"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              title="Contact us"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a href="#demo" className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors">
              Book a Demo
            </a>
            <a href="#demo">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="hidden md:block absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
          <div className="hidden md:block absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
          <motion.div
            style={{
              y,
              maskImage: "radial-gradient(circle at 75% 40%, black 0%, black 30%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle at 75% 40%, black 0%, black 30%, transparent 70%)",
            }}
            className="hidden md:block absolute top-0 right-0 w-[65%] h-[70%]"
          >
            <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00c896" stopOpacity="0" />
                  <stop offset="50%" stopColor="#00c896" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
                  <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00c896" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.path
                  key={i}
                  d={`M0,${250 + i * 8} Q150,${180 - i * 14} 300,${250 + i * 4} T600,${250 - i * 10} T900,${250 + i * 6}`}
                  fill="none"
                  stroke={i % 2 === 0 ? "url(#waveGrad1)" : "url(#waveGrad2)"}
                  strokeWidth={1.5 + (4 - i) * 0.4}
                  animate={{
                    d: [
                      `M0,${250 + i * 8} Q150,${180 - i * 14} 300,${250 + i * 4} T600,${250 - i * 10} T900,${250 + i * 6}`,
                      `M0,${250 + i * 8} Q150,${220 - i * 14} 300,${230 + i * 4} T600,${270 - i * 10} T900,${250 + i * 6}`,
                      `M0,${250 + i * 8} Q150,${180 - i * 14} 300,${250 + i * 4} T600,${250 - i * 10} T900,${250 + i * 6}`,
                    ],
                  }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </svg>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Built exclusively for Australian Vet Clinics
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
                The receptionist that <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  never misses a call.
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl">
                Sera AI answers every missed call, books appointments, sends SMS confirmations, and emails your team instantly. She sounds like she works there. She catches revenue that's slipping through the cracks silently every week.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#demo">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg h-14 px-8 rounded-full">
                    Book a Demo <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="border-border hover:bg-secondary text-lg h-14 px-8 rounded-full">
                    See how it works
                  </Button>
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6">
                {["No lock-in contracts", "Setup within 48 hours", "Australian owned & operated"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* — 1. ANIMATED STAT COUNTERS — */}
      <section className="py-16 px-6 border-y border-border/40 bg-secondary/10">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 divide-x-0 sm:divide-x divide-border/30">
          <StatCounter value={300} suffix="+" label="Calls handled per month" />
          <StatCounter value={65} suffix="%" label="Missed calls converted to bookings" />
          <AlwaysOnStat />
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 px-6 bg-secondary/30 border-b border-border/50 relative overflow-hidden">
        <div className="hidden md:block absolute top-[10%] right-[5%] w-[35%] h-[35%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn>
                <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                  You're missing calls.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-destructive to-orange-400">And losing revenue.</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Most vet clinics miss 20–40 calls per week during lunch breaks, busy periods, and after hours. When pet owners can't get through, they call the clinic down the road.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-br from-destructive/60 via-destructive/20 to-transparent shadow-[0_0_40px_rgba(239,68,68,0.15)]">
                  <div className="bg-background rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                      <LineChart className="w-32 h-32 text-destructive" />
                    </div>
                    <div className="text-sm font-medium text-destructive mb-2 uppercase tracking-wider">The Silent Leak</div>
                    <div className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-destructive to-orange-400">$1,900 – $3,800</div>
                    <div className="text-muted-foreground">Average missed revenue <strong className="text-foreground">every single week</strong> (assuming $95 avg consult value). Sera catches all of it.</div>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-border/50">
              <img
                src={receptionist}
                alt="Receptionist at vet clinic"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 space-y-4">
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                  className="bg-background/90 backdrop-blur-sm border border-border p-4 rounded-xl shadow-xl max-w-sm flex items-start gap-4">
                  <div className="mt-1 bg-destructive/20 p-2 rounded-full">
                    <PhoneMissed className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Missed Call • 12:30 PM</div>
                    <div className="text-xs text-muted-foreground">Team was on lunch break</div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
                  className="bg-primary/90 backdrop-blur-sm border border-primary p-4 rounded-xl shadow-xl max-w-sm ml-auto flex items-start gap-4">
                  <div className="mt-1 bg-background/20 p-2 rounded-full">
                    <CalendarCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-white">Sera AI Handled</div>
                    <div className="text-xs text-white/80">Appointment booked for 3:00 PM</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="hidden md:block absolute top-[5%] left-[-5%] w-[30%] h-[30%] bg-primary/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="hidden md:block absolute bottom-[10%] right-[0%] w-[25%] h-[25%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">She sounds like she works there.</h2>
              <p className="text-lg text-muted-foreground">
                Sera isn't a generic IVR menu. She's a bespoke AI trained on your clinic's specific services, prices, hours, and team.
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Always On Duty", desc: "After hours, lunch breaks, weekends, or just slammed periods. Sera picks up after 3 rings when you can't." },
              { icon: CalendarCheck, title: "Direct Booking", desc: "She integrates with your practice management software and books appointments straight into the calendar." },
              { icon: Mail, title: "Instant Summaries", desc: "The moment a booking is made, your vet team gets an email summary of the call and appointment details." },
              { icon: ShieldCheck, title: "Answers Questions", desc: "Trained on your clinic's knowledge base. She can answer pricing, location, parking, and specific service questions." },
              { icon: PhoneCall, title: "SMS Confirmations", desc: "Automatically sends an SMS confirmation to the patient the moment the call ends with booking details." },
              { icon: LineChart, title: "Unlocks Revenue", desc: "Captures every lead. No voicemails, no hangups. Every call is treated like the valuable lead it is." },
            ].map((feature, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="group relative h-full rounded-2xl p-[1px] bg-gradient-to-b from-border/60 to-transparent hover:from-primary/60 hover:to-blue-500/20 transition-all duration-300">
                  <div className="relative h-full rounded-2xl bg-secondary/30 backdrop-blur-sm p-8 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/0 group-hover:bg-primary/10 blur-2xl rounded-full transition-all duration-500" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/10 border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,200,150,0.15)] group-hover:shadow-[0_0_30px_rgba(0,200,150,0.3)] transition-shadow duration-300">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* — 2. LIVE TRANSCRIPT PREVIEW — */}
      <section className="py-24 px-6 bg-secondary/20 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Live Demo Transcript</div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Hear exactly what your patients will experience.</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                This is a real example of how Sera handles a call. Natural. Warm. Knowledgeable. Patients never feel like they're speaking to an automated system.
              </p>
              <div className="space-y-3">
                {[
                  { icon: MessageSquare, text: "Natural, conversational Aussie voice" },
                  { icon: CalendarCheck, text: "Books directly into your calendar" },
                  { icon: Zap, text: "SMS confirmation sent instantly after" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-background rounded-2xl border border-border/50 shadow-xl overflow-hidden">
                <div className="bg-secondary/40 border-b border-border/50 px-5 py-4 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-primary/60" />
                  </div>
                  <div className="flex-1 text-center text-xs text-muted-foreground font-medium">Call Recording — Crown Vets • 12:32 PM</div>
                </div>
                <div className="p-6">
                  <LiveTranscript />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 border-b border-border/50 relative overflow-hidden">
        <div className="hidden md:block absolute top-[20%] left-[50%] -translate-x-1/2 w-[50%] h-[40%] bg-primary/8 blur-[130px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">Seamless Integration</h2>
              <p className="text-lg text-muted-foreground">No new numbers. No confusing setups.</p>
            </div>
          </FadeIn>
          <JourneySteps />
        </div>
      </section>

      {/* — 3. COMPATIBLE SOFTWARE LOGOS — */}
      <section className="py-20 px-6 border-b border-border/50 bg-secondary/10 relative overflow-hidden">
        <div className="hidden md:block absolute top-[0%] left-[20%] w-[25%] h-[100%] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5 border border-primary/20">
              <Link2 className="w-4 h-4" /> Native Integrations
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-10">
              Plugs straight into the software your clinic <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">already runs on</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {SOFTWARE_LOGOS.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-secondary/70 hover:shadow-[0_0_20px_rgba(0,200,150,0.2)] transition-all duration-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {name}
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* — 4. ROI CALCULATOR — */}
      <section className="py-24 px-6 border-b border-border/50 relative overflow-hidden">
        <div className="hidden md:block absolute bottom-[0%] right-[5%] w-[35%] h-[35%] bg-blue-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
                <TrendingUp className="w-4 h-4" /> Revenue Calculator
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">Calculate your clinic's revenue leak</h2>
              <p className="text-lg text-muted-foreground">Move the sliders and see exactly what missed calls are costing you every single week.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <ROICalculator />
          </FadeIn>
        </div>
      </section>

      {/* — 5. TESTIMONIALS — */}
      <section className="py-24 px-6 bg-secondary/40 border-b border-border/50 relative overflow-hidden">
        <div className="hidden md:block absolute top-[0%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="hidden md:block absolute bottom-[0%] left-[5%] w-[25%] h-[25%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
                <Users className="w-4 h-4" /> Real Feedback
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold">What the team at Southern Cross Vets is saying</h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="bg-background border-border/50 h-full hover:border-primary/30 transition-colors duration-300">
                  <CardContent className="p-8 flex flex-col gap-5 h-full">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed flex-1 italic">"{t.quote}"</p>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-primary mt-0.5">{t.clinic}</div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* — 6. FAQ — */}
      <section className="py-24 px-6 border-b border-border/50 relative overflow-hidden">
        <div className="hidden md:block absolute top-[10%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] bg-primary/6 blur-[130px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Common questions</h2>
              <p className="text-muted-foreground">Everything you need to know before getting started.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Massive Statement */}
      <section className="py-32 px-6 relative overflow-hidden flex items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              No missed calls.<br />
              No voicemails.<br />
              No lost patients.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                No lost revenue.
              </span>
            </h2>
          </FadeIn>
        </div>
      </section>

      {/* — FOUNDER'S NOTE — */}
      <section className="py-20 px-6 border-b border-border/50 relative overflow-hidden">
        <div className="hidden md:block absolute top-[10%] left-[10%] w-[25%] h-[25%] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-8">
              <div className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Why I built Sera</div>
            </div>
            <div className="bg-secondary/20 border border-border/50 rounded-2xl p-8 md:p-10">
              <p className="text-foreground/90 leading-relaxed mb-4">
                A few years ago my dog got sick late on a Sunday. I called every vet clinic I could find — straight to voicemail, or the phone just rang out. By the time I finally got through, a lot of time had already passed. He was okay in the end, but that feeling of not being able to reach anyone stuck with me.
              </p>
              <p className="text-foreground/90 leading-relaxed mb-6">
                Most clinics aren't missing calls because they don't care — they're just stretched thin, and the phone is usually the first thing to suffer. I built Sera so pet owners never sit with that same helpless feeling, and clinics never lose a patient simply because nobody could pick up in time.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <div className="font-semibold text-sm">Aaron</div>
                  <div className="text-xs text-muted-foreground">Founder, Sera AI</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* — 7. DEMO BOOKING SECTION — */}
      <section id="demo" className="py-24 px-6 bg-secondary/20 border-t border-border/50 relative overflow-hidden">
        <div className="hidden md:block absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-primary/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Book a Free Demo</div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to hire your new best receptionist?</h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
                Book a personalised 15-minute demo and see Sera answer calls for your specific clinic — live, in real time. Setup takes less than 48 hours. No lock-in contracts.
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {[
                  "Live demo tailored to your clinic",
                  "Setup within 48 hours of signing",
                  "No lock-in — cancel any time",
                  "We handle all the onboarding for you",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="bg-background border border-border/50 rounded-3xl p-4 md:p-6 shadow-2xl">
              <DemoForm />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6 pr-6 lg:pr-32 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-4 h-4">
                <g fill="#ffffff">
                  <rect x="9" y="22" width="6" height="20" rx="3" />
                  <rect x="19" y="16" width="6" height="32" rx="3" />
                  <rect x="29" y="10" width="6" height="44" rx="3" />
                  <rect x="39" y="16" width="6" height="32" rx="3" />
                  <rect x="49" y="22" width="6" height="20" rx="3" />
                </g>
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Sera AI</span>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Sera AI. Australian owned and operated.
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a
              href="mailto:aaron@seraai.co?subject=Sera%20AI%20Enquiry"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 hover:border-primary/50 hover:text-foreground transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
