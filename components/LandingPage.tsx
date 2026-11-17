"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Mic,
  BarChart3,
  Zap,
  TrendingUp,
  Bot,
  CheckCircle2,
  Sparkles,
  Star,
  ChevronDown,
  PhoneCall,
  Volume2,
  MessageSquare,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Reduced Motion Hook ───────────────────────── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ─── Animated Counter ───────────────────────────── */
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setCount(target); return; }
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, reduced]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

/* ─── Scroll-reveal wrapper ──────────────────────── */
function Reveal({
  children,
  className = "",
  delay = 0,
  y = 32,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Feature Data ───────────────────────────────── */
const FEATURES = [
  {
    icon: Mic,
    title: "Real Voice Interviews",
    desc: "Speak naturally with an AI that listens, adapts, and responds — replicating real recruiter conversations.",
    gradient: "from-indigo-500/15 to-indigo-500/0",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-400",
    glow: "group-hover:shadow-[0_8px_32px_rgba(99,102,241,0.25)]",
    border: "border-indigo-500/20 group-hover:border-indigo-500/40",
  },
  {
    icon: Layers,
    title: "Role & Tech-Stack Tailored",
    desc: "Frontend, Backend, Full-Stack, Data — questions customized to your exact tech stack and experience level.",
    gradient: "from-violet-500/15 to-violet-500/0",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    glow: "group-hover:shadow-[0_8px_32px_rgba(139,92,246,0.25)]",
    border: "border-violet-500/20 group-hover:border-violet-500/40",
  },
  {
    icon: Zap,
    title: "Instant AI Feedback",
    desc: "Get scored across communication, technical depth, confidence, and problem-solving — right after you finish.",
    gradient: "from-purple-500/15 to-purple-500/0",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
    glow: "group-hover:shadow-[0_8px_32px_rgba(168,85,247,0.25)]",
    border: "border-purple-500/20 group-hover:border-purple-500/40",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    desc: "Watch your scores improve session over session. Visual performance history keeps you motivated.",
    gradient: "from-fuchsia-500/15 to-fuchsia-500/0",
    iconBg: "bg-fuchsia-500/15",
    iconColor: "text-fuchsia-400",
    glow: "group-hover:shadow-[0_8px_32px_rgba(217,70,239,0.25)]",
    border: "border-fuchsia-500/20 group-hover:border-fuchsia-500/40",
  },
  {
    icon: MessageSquare,
    title: "Full Transcript Review",
    desc: "Every word captured — go back and review exactly what you said, what could've been better, what scored well.",
    gradient: "from-blue-500/15 to-blue-500/0",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    glow: "group-hover:shadow-[0_8px_32px_rgba(59,130,246,0.25)]",
    border: "border-blue-500/20 group-hover:border-blue-500/40",
  },
  {
    icon: TrendingUp,
    title: "Confidence Building",
    desc: "The more you practice, the better you get. No judgment, no pressure — just you and your AI coach.",
    gradient: "from-cyan-500/15 to-cyan-500/0",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-400",
    glow: "group-hover:shadow-[0_8px_32px_rgba(6,182,212,0.25)]",
    border: "border-cyan-500/20 group-hover:border-cyan-500/40",
  },
];

const STEPS = [
  {
    num: "01",
    icon: Layers,
    title: "Generate Interview",
    desc: "Pick your role, tech stack, experience level, and interview type. AI builds your personalized question set instantly.",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    glow: "shadow-[0_0_32px_rgba(99,102,241,0.25)]",
  },
  {
    num: "02",
    icon: Mic,
    title: "Take the Interview",
    desc: "Speak your answers out loud. The AI interviews you in real time, listens to every word, and keeps the session flowing.",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    glow: "shadow-[0_0_32px_rgba(139,92,246,0.25)]",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Review Feedback",
    desc: "Get instant AI-scored feedback with breakdown by category, full transcript, and actionable improvement tips.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    glow: "shadow-[0_0_32px_rgba(168,85,247,0.25)]",
  },
];

const STATS = [
  { target: 500, suffix: "+", label: "Developers Practiced" },
  { target: 10, suffix: "+", label: "Role Archetypes" },
  { target: 98, suffix: "%", label: "Satisfaction Rate" },
  { target: 3, prefix: "<", suffix: "min", label: "To First Interview" },
];

/* ─── Mock demo transcript lines ─────────────────── */
const TRANSCRIPT = [
  { role: "ai", text: "Tell me about your experience with React hooks and state management." },
  { role: "user", text: "Sure! I've been using React for 3 years. For state management I primarily use..." },
  { role: "ai", text: "Great! Can you explain the difference between useMemo and useCallback?" },
];

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
export default function LandingPage() {
  const reduced = usePrefersReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [speakingAI, setSpeakingAI] = useState(true);
  const [activeLine, setActiveLine] = useState(0);

  /* Navbar scroll shadow */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Animate connecting line on scroll */
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: false, amount: 0.3 });
  useEffect(() => {
    if (!stepsInView) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setActiveLine(i);
      if (i >= STEPS.length) clearInterval(t);
    }, 500);
    return () => clearInterval(t);
  }, [stepsInView]);

  /* Demo speaking toggle */
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setSpeakingAI((p) => !p), 2800);
    return () => clearInterval(t);
  }, [reduced]);

  /* ── NAV LINKS ── */
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Preview", href: "#demo" },
  ];

  return (
    <div className="min-h-screen bg-[#09090F] text-white overflow-x-hidden">

      {/* ══ NAVBAR ══════════════════════════════════════ */}
      <motion.header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#09090F]/90 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        }`}
        initial={reduced ? false : { y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="size-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
              <Bot className="size-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-white">
              Vaani<span className="bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] bg-clip-text text-transparent">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Site navigation">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Button asChild variant="ghost" size="sm" className="btn-ghost !h-9 !px-4 text-sm text-slate-300">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="btn-primary !h-9 !px-5 text-sm font-semibold shadow-md shadow-indigo-500/30">
              <Link href="/sign-up" className="flex items-center gap-1.5">
                Get Started
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden size-9 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/[0.07] bg-[#09090F]/95 backdrop-blur-xl px-4 pt-3 pb-5 flex flex-col gap-1"
            >
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06] mt-2">
                <Button asChild variant="ghost" size="sm" className="btn-ghost w-full !h-10 text-sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="btn-primary w-full !h-10 text-sm font-semibold">
                  <Link href="/sign-up">Get Started Free</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ══ HERO ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16 pb-12 overflow-hidden" aria-label="Hero">
        {/* Animated gradient orbs */}
        {!reduced && (
          <>
            <motion.div
              className="pointer-events-none absolute top-[8%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]"
              animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-purple-600/12 blur-[130px]"
              animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.05, 1] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-violet-500/8 blur-[100px]"
              animate={{ scale: [1, 1.08, 0.97, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        {/* Subtle dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-10">

            {/* LEFT: Text content */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              {/* Badge */}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold text-indigo-300 mb-6 shadow-sm"
              >
                <Sparkles className="size-3.5 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                AI-Powered Mock Interviews · Free to try
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={reduced ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
                className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight leading-[1.1] mb-6"
              >
                Crack your next{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent">
                    interview
                  </span>
                </span>
                <br />
                with{" "}
                <span className="bg-gradient-to-r from-[#C084FC] via-[#A78BFA] to-[#818CF8] bg-clip-text text-transparent">
                  AI
                </span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8"
              >
                Practice voice interviews with an AI that listens, adapts, and scores you in real time.
                Get better every session — no recruiter needed.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
              >
                <Button
                  asChild
                  size="lg"
                  className="btn-primary !h-13 !px-8 text-sm font-semibold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 w-full sm:w-auto group"
                >
                  <Link href="/sign-up" className="flex items-center gap-2">
                    Start for free
                    <motion.span
                      animate={reduced ? {} : { x: [0, 4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </motion.span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="btn-ghost !h-13 !px-6 text-sm font-medium w-full sm:w-auto"
                >
                  <a href="#demo" className="flex items-center gap-2">
                    See how it works
                    <ChevronDown className="size-4 text-slate-400" aria-hidden="true" />
                  </a>
                </Button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center justify-center lg:justify-start gap-3 mt-8"
              >
                <div className="flex -space-x-2.5">
                  {["RS", "AK", "PS", "MJ", "VK"].map((initials, i) => (
                    <div
                      key={i}
                      className="size-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[#09090F]"
                      aria-hidden="true"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3 text-amber-400 fill-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">Loved by <strong className="text-slate-200">500+</strong> developers</p>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Floating robot */}
            <motion.div
              initial={reduced ? false : { opacity: 0, x: 48, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
              className="relative flex-shrink-0 w-full lg:w-[580px] flex items-center justify-center"
            >
              {/* Glow behind robot */}
              <div className="absolute size-72 sm:size-80 lg:size-[500px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/15 blur-3xl" aria-hidden="true" />

              {/* Floating animation */}
              <motion.div
                animate={reduced ? {} : { y: [0, -18, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/robot.svg"
                  alt="AI Interview Assistant"
                  width={680}
                  height={540}
                  className="relative object-contain drop-shadow-[0_28px_56px_rgba(0,0,0,0.9)] max-h-[300px] sm:max-h-[400px] lg:max-h-none lg:w-full lg:h-auto select-none pointer-events-none"
                />
              </motion.div>

              {/* Floating badge cards */}
              {!reduced && (
                <>
                  <motion.div
                    className="absolute top-8 -left-4 sm:left-0 flex items-center gap-2 bg-[#161432]/90 border border-indigo-500/30 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg shadow-black/40 text-xs font-semibold text-indigo-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    aria-hidden="true"
                  >
                    <Bot className="size-4 text-indigo-400" />
                    AI Interviewer active
                  </motion.div>
                  <motion.div
                    className="absolute bottom-16 -right-2 sm:right-4 flex items-center gap-2 bg-[#161432]/90 border border-green-500/30 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg shadow-black/40 text-xs font-semibold text-green-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    aria-hidden="true"
                  >
                    <CheckCircle2 className="size-4 text-green-400" />
                    Score: 92 / 100
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        {!reduced && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
            animate={{ y: [0, 8, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-indigo-400/60 to-transparent" />
            <ChevronDown className="size-4 text-indigo-400" />
          </motion.div>
        )}
      </section>

      {/* ══ STATS BAR ════════════════════════════════════ */}
      <section className="border-y border-white/[0.06] bg-[#0C0C18]/80 py-10" aria-label="Stats">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="flex flex-col gap-1.5">
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent tabular-nums">
                  <AnimatedCounter target={s.target} suffix={s.suffix} prefix={s.prefix} />
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-medium">{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ═════════════════════════════════════ */}
      <section id="features" className="py-24 px-4 sm:px-6" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">What you get</p>
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
                land the role
              </span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
              VaaniAI simulates real interviews end-to-end — from question generation to AI scoring — so you walk in prepared.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <motion.div
                  className={`group relative rounded-2xl border ${f.border} bg-gradient-to-b ${f.gradient} to-transparent p-6 backdrop-blur-sm transition-all duration-300 cursor-default ${f.glow} h-full`}
                  whileHover={reduced ? {} : { y: -4 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className={`inline-flex items-center justify-center size-12 rounded-xl ${f.iconBg} border border-white/[0.08] ${f.iconColor} mb-4`}>
                    <f.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════ */}
      <section id="how" className="py-24 px-4 sm:px-6 bg-[#0C0C18]/50" aria-labelledby="how-heading">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-3">Simple process</p>
            <h2 id="how-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Three steps to interview-ready
            </h2>
            <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
              From zero to your first practice session in under three minutes.
            </p>
          </Reveal>

          {/* Steps */}
          <div ref={stepsRef} className="relative flex flex-col md:flex-row gap-8 md:gap-0 items-start">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-14 left-[calc(16.6%+24px)] right-[calc(16.6%+24px)] h-px bg-white/[0.06]" aria-hidden="true">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: stepsInView ? 1 : 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              />
            </div>

            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.18} className="flex-1 flex flex-col items-center md:items-center text-center px-4">
                {/* Icon circle */}
                <motion.div
                  className={`relative z-10 flex items-center justify-center size-14 rounded-2xl ${s.bgColor} border ${s.borderColor} ${s.color} mb-5 ${stepsInView && activeLine > i ? s.glow : ""} transition-all duration-700`}
                  whileHover={reduced ? {} : { scale: 1.08 }}
                  transition={{ duration: 0.2 }}
                >
                  <s.icon className="size-6" aria-hidden="true" />
                  <span className="absolute -top-2 -right-2 size-5 rounded-full bg-[#09090F] border border-white/10 text-[9px] font-black text-white flex items-center justify-center">
                    {s.num.replace("0", "")}
                  </span>
                </motion.div>

                {/* Mobile vertical line */}
                {i < STEPS.length - 1 && (
                  <div className="md:hidden w-px h-8 bg-gradient-to-b from-indigo-500/60 to-transparent mb-5" aria-hidden="true" />
                )}

                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[220px] md:max-w-none">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DEMO PREVIEW ═════════════════════════════════ */}
      <section id="demo" className="py-24 px-4 sm:px-6" aria-labelledby="demo-heading">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3">Live preview</p>
            <h2 id="demo-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              See it in action
            </h2>
            <p className="text-slate-400 text-base max-w-lg mx-auto">
              This is what a real VaaniAI session looks like — AI interviewer, live transcript, and your performance score.
            </p>
          </Reveal>

          <Reveal>
            <div className="relative rounded-3xl border border-white/[0.08] bg-[#0F0F1A] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] bg-[#0C0C18]/80">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <div className="size-3 rounded-full bg-red-500/70" />
                    <div className="size-3 rounded-full bg-amber-500/70" />
                    <div className="size-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 ml-1">Frontend Developer Interview · Senior</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold">
                  <div className="size-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                  LIVE · 04:32
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* Stage cards */}
                <div className="flex-1 p-6 flex flex-col sm:flex-row gap-5 items-center justify-center">
                  {/* AI card */}
                  <div className={`relative flex-1 min-h-[160px] rounded-2xl border flex flex-col items-center justify-center gap-3 p-5 transition-all duration-500 ${
                    speakingAI
                      ? "border-indigo-500/50 bg-gradient-to-b from-indigo-500/10 to-transparent shadow-[0_0_40px_rgba(99,102,241,0.2)]"
                      : "border-white/[0.08] bg-[#0C0C18]/50"
                  }`}>
                    {/* Pulse ring */}
                    {speakingAI && !reduced && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-indigo-500/30"
                          animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.15, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          aria-hidden="true"
                        />
                        <motion.div
                          className="absolute inset-0 rounded-2xl border border-indigo-500/20"
                          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                          aria-hidden="true"
                        />
                      </>
                    )}
                    <div className={`size-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      speakingAI ? "bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.4)]" : "bg-white/5"
                    }`}>
                      <Bot className={`size-7 transition-colors duration-300 ${speakingAI ? "text-indigo-400" : "text-slate-400"}`} aria-hidden="true" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">AI Interviewer</p>
                      {speakingAI && (
                        <div className="flex items-center justify-center gap-0.5 mt-1" aria-label="AI is speaking">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 rounded-full bg-indigo-400"
                              animate={reduced ? {} : { height: ["4px", `${8 + i * 4}px`, "4px"] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User card */}
                  <div className={`relative flex-1 min-h-[160px] rounded-2xl border flex flex-col items-center justify-center gap-3 p-5 transition-all duration-500 ${
                    !speakingAI
                      ? "border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-transparent shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                      : "border-white/[0.08] bg-[#0C0C18]/50"
                  }`}>
                    {!speakingAI && !reduced && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-violet-500/30"
                          animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.15, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          aria-hidden="true"
                        />
                      </>
                    )}
                    <div className={`size-14 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 ${
                      !speakingAI
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(139,92,246,0.4)] text-white"
                        : "bg-white/10 text-slate-300"
                    }`}>
                      RS
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">You</p>
                      {!speakingAI && (
                        <div className="flex items-center justify-center gap-0.5 mt-1" aria-label="You are speaking">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 rounded-full bg-violet-400"
                              animate={reduced ? {} : { height: ["4px", `${6 + i * 3}px`, "4px"] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transcript panel */}
                <div className="lg:w-[320px] border-t lg:border-t-0 lg:border-l border-white/[0.07] bg-[#0C0C18]/50 p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/[0.07]">
                    <MessageSquare className="size-3.5 text-indigo-400" aria-hidden="true" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Live Transcript</span>
                  </div>
                  <div className="flex flex-col gap-3 overflow-hidden">
                    {TRANSCRIPT.map((line, i) => (
                      <Reveal key={i} delay={i * 0.15}>
                        <div className={`flex gap-2.5 items-start ${line.role === "user" ? "flex-row-reverse" : ""}`}>
                          <div className={`flex-shrink-0 size-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            line.role === "ai"
                              ? "bg-indigo-500/20 text-indigo-400"
                              : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                          }`} aria-hidden="true">
                            {line.role === "ai" ? <Bot className="size-3" /> : "RS"}
                          </div>
                          <div className={`text-xs leading-relaxed rounded-xl px-3 py-2 max-w-[200px] ${
                            line.role === "ai"
                              ? "bg-indigo-500/10 border border-indigo-500/20 text-slate-200"
                              : "bg-violet-500/10 border border-violet-500/20 text-slate-200 text-right"
                          }`}>
                            {line.text}
                          </div>
                        </div>
                      </Reveal>
                    ))}
                    {/* Typing indicator */}
                    {speakingAI && !reduced && (
                      <div className="flex gap-2.5 items-center">
                        <div className="size-6 rounded-full bg-indigo-500/20 flex items-center justify-center" aria-label="AI is typing">
                          <Bot className="size-3 text-indigo-400" />
                        </div>
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-2 flex gap-1 items-center">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="size-1.5 rounded-full bg-indigo-400"
                              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Score preview */}
                  <div className="mt-auto pt-3 border-t border-white/[0.07]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400 font-medium">Session score</span>
                      <span className="text-xs font-bold text-green-400">92 / 100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "92%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom control bar */}
              <div className="flex items-center justify-center gap-4 px-5 py-5 border-t border-white/[0.07] bg-[#0C0C18]/80">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Volume2 className="size-4" aria-hidden="true" />
                  <span>Voice active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                    <Mic className="size-4" aria-hidden="true" />
                  </div>
                  <div className="size-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <PhoneCall className="size-5 text-white" aria-hidden="true" />
                  </div>
                </div>
                <span className="text-xs text-slate-500 italic">Mock preview only</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FINAL CTA BANNER ═════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6" aria-labelledby="cta-heading">
        <Reveal>
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-[#161432] via-[#120F2A] to-[#09090F] p-10 sm:p-16 text-center shadow-[0_0_80px_rgba(99,102,241,0.15)]">
            {/* Inner glows */}
            <div aria-hidden="true" className="pointer-events-none absolute -top-20 -left-20 size-64 rounded-full bg-indigo-500/15 blur-[80px]" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-purple-500/15 blur-[80px]" />

            {/* Grid overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-xs font-semibold text-purple-300 mb-6">
                <Sparkles className="size-3.5 text-purple-400" aria-hidden="true" />
                Start in under 60 seconds
              </div>

              <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5">
                Ready to ace your{" "}
                <span className="bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent">
                  next interview?
                </span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                Join hundreds of developers who practice smarter, build confidence, and land offers faster with VaaniAI.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary !h-13 !px-10 text-sm font-semibold shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 w-full sm:w-auto"
                >
                  <Link href="/sign-up" className="flex items-center gap-2">
                    Create free account
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="btn-ghost !h-13 !px-8 text-sm w-full sm:w-auto">
                  <Link href="/sign-in">I already have an account</Link>
                </Button>
              </div>

              {/* Perks row */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
                {["No credit card", "Unlimited practice", "Instant AI feedback", "Free forever"].map((p) => (
                  <div key={p} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CheckCircle2 className="size-3.5 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="size-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bot className="size-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                Vaani<span className="bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] bg-clip-text text-transparent">AI</span>
              </span>
            </Link>

            {/* Links */}
            <nav className="flex items-center gap-6 text-xs text-slate-500" aria-label="Footer navigation">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-slate-300 transition-colors">
                  {l.label}
                </a>
              ))}
              <Link href="/sign-in" className="hover:text-slate-300 transition-colors">Sign In</Link>
            </nav>

            {/* Copyright & Built by */}
            <div className="flex flex-col sm:items-end items-center gap-1">
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} VaaniAI. Built for developers.
              </p>
              <p className="text-xs text-slate-500/80">
                Built by Singh Rajdiwakar
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
