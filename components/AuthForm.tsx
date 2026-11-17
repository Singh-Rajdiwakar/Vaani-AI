"use client";

import { useState } from "react";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Bot,
  CheckCircle2,
  Star,
  ShieldCheck,
} from "lucide-react";

import { auth } from "@/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { cn } from "@/lib/utils";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z.string().min(2, "Name must be at least 2 characters")
        : z.string().optional(),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
};

/* ─── Framer Motion Animation Variants ───────────── */
const EASE = "easeOut" as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

const formContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const formItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSignIn = type === "sign-in";
  const formSchema = authFormSchema(type);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (!auth) {
        toast.error("Add Firebase credentials to .env.local before signing in.");
        setIsLoading(false);
        return;
      }

      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(
            result?.message ?? "Failed to create account. Please try again."
          );
          setIsLoading(false);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          setIsLoading(false);
          return;
        }

        const result = await signIn({
          email,
          idToken,
        });

        if (!result?.success) {
          toast.error(
            result?.message ?? "Failed to log into account. Please try again."
          );
          setIsLoading(false);
          return;
        }

        toast.success("Signed in successfully.");
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      if (
        msg.includes("auth/invalid-credential") ||
        msg.includes("auth/user-not-found") ||
        msg.includes("auth/wrong-password")
      ) {
        toast.error("Invalid email or password. Please try again.");
      } else if (msg.includes("auth/email-already-in-use")) {
        toast.error("An account with this email already exists. Please sign in.");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full rounded-3xl border border-white/[0.08] bg-[#0F0F1A]/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(99,102,241,0.12)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]"
    >
      {/* ── LEFT BRAND PANEL (Desktop only) ────────────────── */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 xl:p-10 relative overflow-hidden bg-gradient-to-br from-[#161432] via-[#0F0F1E] to-[#0A0A14] border-r border-white/[0.07]">
        {/* Animated background gradient orbs */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-purple-500/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Top: Brand & Badge */}
        <div className="relative z-10 flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="size-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
              <Bot className="size-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Vaani
              <span className="bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-xs font-semibold text-indigo-300 w-fit">
            <Sparkles className="size-3 text-indigo-400" aria-hidden="true" />
            <span>AI-Powered Interview Coach</span>
          </div>
        </div>

        {/* Middle: Floating Showcase Cards */}
        <div className="relative z-10 flex flex-col gap-4 my-auto py-6">
          {/* Card 1: AI Interviewer Question Card */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="rounded-2xl border border-indigo-500/25 bg-[#121226]/85 backdrop-blur-md p-4 shadow-lg shadow-indigo-950/40"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Bot className="size-4" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold text-white">
                  AI Interviewer
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Session
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &ldquo;Walk me through how you would architect a resilient,
              low-latency notification pipeline.&rdquo;
            </p>

            {/* Audio Waveform Animation */}
            <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium">
                Live Voice Synthesis
              </span>
              <div className="flex items-center gap-0.5 ml-auto">
                {[8, 14, 20, 10, 16, 22, 12, 18, 9].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-indigo-400 rounded-full"
                    animate={{
                      height: [`${h * 0.4}px`, `${h}px`, `${h * 0.4}px`],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.09,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: Performance Assessment Card */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="rounded-2xl border border-white/[0.08] bg-[#111122]/75 backdrop-blur-md p-4 shadow-lg shadow-black/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Latest Mock Assessment
                </p>
                <p className="text-sm font-bold text-white mt-0.5">
                  Senior Full-Stack Engineer
                </p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>94 / 100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/[0.06] text-[11px]">
              <div>
                <span className="text-slate-400">Technical Depth:</span>{" "}
                <strong className="text-indigo-300 font-semibold">96%</strong>
              </div>
              <div>
                <span className="text-slate-400">Communication:</span>{" "}
                <strong className="text-violet-300 font-semibold">92%</strong>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: Candidate Testimonial */}
        <div className="relative z-10 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="size-3.5 text-amber-400 fill-amber-400"
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            &ldquo;VaaniAI made my actual FAANG loops feel completely familiar.
            The voice feedback and scoring were spot on.&rdquo;
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="size-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white ring-1 ring-white/20">
              AK
            </div>
            <span className="text-[11px] font-semibold text-slate-300">
              Alex K.
            </span>
            <span className="text-[10px] text-slate-500">· Senior Engineer</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ───────────────────────────────── */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-14 relative">
        {/* Top bar: Back link + Mobile Brand logo */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="lg:hidden flex items-center gap-2 group"
            aria-label="VaaniAI Home"
          >
            <div className="size-8 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
              <Bot className="size-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-base font-bold text-white">
              Vaani
              <span className="bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -m-1"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header: Center Aligned */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 mb-3 shadow-[0_0_24px_rgba(99,102,241,0.2)]">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {isSignIn ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            {isSignIn
              ? "Sign in to access your interview practice sessions and scores"
              : "Start practicing realistic AI voice mock interviews in under 2 minutes"}
          </p>
        </div>

        {/* ── Form with Staggered Inputs ─────────────────────── */}
        <motion.form
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
          noValidate
        >
          {/* Name Field (Sign-up only) */}
          {!isSignIn && (
            <motion.div variants={formItemVariants} className="flex flex-col gap-1.5">
              <label
                htmlFor="auth-name"
                className="text-xs font-semibold text-slate-300 pl-1"
              >
                Full Name
              </label>

              <div
                className={cn(
                  "relative flex items-center rounded-2xl bg-[#141422] border border-white/[0.08] transition-all duration-200",
                  "focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.2)]",
                  errors.name &&
                    "border-rose-500/70 focus-within:border-rose-500 focus-within:ring-rose-500/20"
                )}
              >
                <div
                  className="absolute left-4 pointer-events-none text-slate-400"
                  aria-hidden="true"
                >
                  <User className="size-4" />
                </div>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Alex Kumar"
                  autoComplete="name"
                  disabled={isLoading}
                  {...register("name")}
                  className="w-full h-12 bg-transparent text-sm text-white placeholder:text-slate-400 pl-11 pr-4 focus:outline-none rounded-2xl disabled:opacity-50"
                />
              </div>

              {/* Inline animated error message */}
              <AnimatePresence mode="wait">
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pl-1"
                  >
                    <span className="size-1 rounded-full bg-rose-400" />
                    <span>{errors.name.message}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Email Field */}
          <motion.div variants={formItemVariants} className="flex flex-col gap-1.5">
            <label
              htmlFor="auth-email"
              className="text-xs font-semibold text-slate-300 pl-1"
            >
              Email Address
            </label>

            <div
              className={cn(
                "relative flex items-center rounded-2xl bg-[#141422] border border-white/[0.08] transition-all duration-200",
                "focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.2)]",
                errors.email &&
                  "border-rose-500/70 focus-within:border-rose-500 focus-within:ring-rose-500/20"
              )}
            >
              <div
                className="absolute left-4 pointer-events-none text-slate-400"
                aria-hidden="true"
              >
                <Mail className="size-4" />
              </div>
              <input
                id="auth-email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                disabled={isLoading}
                {...register("email")}
                className="w-full h-12 bg-transparent text-sm text-white placeholder:text-slate-400 pl-11 pr-4 focus:outline-none rounded-2xl disabled:opacity-50"
              />
            </div>

            {/* Inline animated error message */}
            <AnimatePresence mode="wait">
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pl-1"
                >
                  <span className="size-1 rounded-full bg-rose-400" />
                  <span>{errors.email.message}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password Field with Show/Hide Toggle */}
          <motion.div variants={formItemVariants} className="flex flex-col gap-1.5">
            <label
              htmlFor="auth-password"
              className="text-xs font-semibold text-slate-300 pl-1"
            >
              Password
            </label>

            <div
              className={cn(
                "relative flex items-center rounded-2xl bg-[#141422] border border-white/[0.08] transition-all duration-200",
                "focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.2)]",
                errors.password &&
                  "border-rose-500/70 focus-within:border-rose-500 focus-within:ring-rose-500/20"
              )}
            >
              <div
                className="absolute left-4 pointer-events-none text-slate-400"
                aria-hidden="true"
              >
                <Lock className="size-4" />
              </div>
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete={isSignIn ? "current-password" : "new-password"}
                disabled={isLoading}
                {...register("password")}
                className="w-full h-12 bg-transparent text-sm text-white placeholder:text-slate-400 pl-11 pr-12 focus:outline-none rounded-2xl disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Inline animated error message */}
            <AnimatePresence mode="wait">
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pl-1"
                >
                  <span className="size-1 rounded-full bg-rose-400" />
                  <span>{errors.password.message}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit Button with Hover Shine & Loading State */}
          <motion.div variants={formItemVariants} className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "group relative w-full h-12 rounded-2xl font-semibold text-sm text-white overflow-hidden transition-all duration-300",
                "bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6]",
                "hover:shadow-[0_0_24px_rgba(99,102,241,0.45)] hover:scale-[1.005]",
                "active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F1A]",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              )}
            >
              {/* Hover sweep shine reflection effect */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin text-white"
                      aria-hidden="true"
                    />
                    <span>
                      {isSignIn ? "Signing in..." : "Creating account..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>{isSignIn ? "Sign In" : "Create Account"}</span>
                    <ArrowRight
                      className="size-4 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </>
                )}
              </span>
            </button>
          </motion.div>
        </motion.form>

        {/* Switch Link between Sign-in and Sign-up */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs sm:text-sm text-slate-400">
            {isSignIn ? "Don't have an account yet?" : "Have an account already?"}
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors ml-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </Link>
          </p>
          <p className="text-[11px] text-slate-500/80 mt-4 tracking-wide">
            Built by Singh Rajdiwakar
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthForm;
