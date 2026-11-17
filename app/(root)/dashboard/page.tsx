import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Bot, Compass, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Dashboard() {
  // Logic & API calls untouched
  const user = await getCurrentUser();
  const userId = user?.id ?? "";

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(userId),
    getLatestInterviews({ userId }),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (allInterview?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-10 sm:gap-12 w-full">
      {/* ── Hero Section ───────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-[#161432] via-[#0F0F1D] to-[#09090F] p-6 sm:p-10 lg:p-14 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_48px_rgba(0,0,0,0.6),0_0_36px_rgba(99,102,241,0.15)]"
        aria-label="Introduction banner"
      >
        {/* Background ambient glow circles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-indigo-500/15 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-1/4 size-96 rounded-full bg-purple-500/10 blur-[100px]"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          {/* Left: Heading, Badge, Subtitle & CTA */}
          <div className="flex flex-col gap-5 sm:gap-6 max-w-xl text-left w-full">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold text-indigo-300 w-fit shadow-xs">
              <Sparkles className="size-3.5 text-indigo-400" aria-hidden="true" />
              <span>Real-time voice AI mock interviews</span>
            </div>

            {/* Large Heading with Gradient Accent */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.18]">
              Get Interview-Ready with{" "}
              <span className="bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent">
                AI-Powered Practice
              </span>{" "}
              &amp; Instant Feedback
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
              Practice role-specific technical and behavioral questions with an
              intelligent voice interviewer. Get instant scoring, comprehensive
              transcripts, and actionable tips to level up.
            </p>

            {/* Clear CTA Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-1">
              <Button
                asChild
                size="lg"
                className="btn-primary !h-12 !px-8 text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 w-full sm:w-auto"
              >
                <Link
                  href="/interview"
                  className="flex items-center justify-center gap-2"
                  aria-label="Start a new mock interview"
                >
                  <span>Start an Interview</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>

              <span className="text-xs text-slate-400 text-center sm:text-left">
                ⚡ Takes ~10 mins • Voice &amp; instant analysis
              </span>
            </div>
          </div>

          {/* Right: Large Robot Illustration with Ambient Glow */}
          <div className="relative flex-shrink-0 flex items-center justify-center w-full lg:w-[420px] max-lg:max-w-[320px]">
            {/* Soft backdrop glow behind robot */}
            <div
              className="absolute size-64 sm:size-72 lg:size-80 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl -z-10"
              aria-hidden="true"
            />

            <Image
              src="/robot.svg"
              alt="AI Interviewer Assistant"
              width={510}
              height={405}
              priority
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-500 max-h-[260px] sm:max-h-[320px] lg:max-h-[400px] w-auto select-none pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* ── Your Interviews Section ────────────────────────── */}
      <section className="flex flex-col gap-6" aria-labelledby="your-interviews-heading">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 id="your-interviews-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Your Interviews
            </h2>
            {hasPastInterviews && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                {userInterviews?.length ?? 0}
              </span>
            )}
          </div>
        </div>

        {hasPastInterviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
            {userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))}
          </div>
        ) : (
          /* Empty State: Rich, inviting container with icon + text + CTA */
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0F0F1A]/80 to-[#09090F] p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-lg">
            {/* Ambient center glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-full bg-indigo-500/10 blur-[80px]"
            />

            {/* Icon badge */}
            <div className="relative flex items-center justify-center size-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 mb-4 shadow-[0_0_24px_rgba(99,102,241,0.2)]">
              <Bot className="size-7" aria-hidden="true" />
            </div>

            {/* Heading & Subtext */}
            <h3 className="text-lg font-bold text-slate-100">
              You haven&apos;t taken any interviews yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 mb-6 leading-relaxed">
              Step into an AI-conducted mock interview to practice realistic questions,
              boost your confidence, and receive comprehensive performance scores.
            </p>

            {/* CTA */}
            <Button
              asChild
              className="btn-primary !h-10 !px-6 text-xs font-semibold shadow-md shadow-indigo-500/20 w-full sm:w-auto"
            >
              <Link href="/interview" className="flex items-center justify-center gap-2">
                <PlusCircle className="size-4" aria-hidden="true" />
                <span>Start Your First Interview</span>
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* ── Take Interviews Section ────────────────────────── */}
      <section className="flex flex-col gap-6" aria-labelledby="take-interviews-heading">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 id="take-interviews-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Take Interviews
            </h2>
            {hasUpcomingInterviews && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                {allInterview?.length ?? 0} available
              </span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Compass className="size-4 text-indigo-400" aria-hidden="true" />
            <span>Curated by AI role frameworks</span>
          </div>
        </div>

        {hasUpcomingInterviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
            {allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0F0F1A] p-8 text-center text-slate-400 text-sm">
            There are no interviews available at the moment.
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
