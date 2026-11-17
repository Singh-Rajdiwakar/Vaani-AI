import dayjs from "dayjs";
import Link from "next/link";
import {
  Calendar,
  Code2,
  Database,
  Server,
  Layers,
  Terminal,
  ArrowRight,
} from "lucide-react";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

// Helper to resolve clean tech/role visuals without random company logos
function getTechRoleVisual(role: string, techstack: string[] = []) {
  const clean = (role || "").replace(/devloper/gi, "Developer").trim();
  const lowerRole = clean.toLowerCase();
  const lowerTechs = techstack.map((t) => t.toLowerCase());

  // 1. Role-based checks first (primary intent)
  if (
    lowerRole.includes("front") ||
    lowerRole.includes("ui") ||
    lowerRole.includes("web")
  ) {
    return {
      label: "FE",
      gradient: "from-cyan-400 via-blue-500 to-indigo-600",
      glow: "rgba(6, 182, 212, 0.35)",
      border: "rgba(6, 182, 212, 0.3)",
      Icon: Code2,
    };
  }

  if (
    lowerRole.includes("full") ||
    lowerRole.includes("mern") ||
    lowerRole.includes("mean")
  ) {
    return {
      label: "FS",
      gradient: "from-violet-500 via-purple-600 to-indigo-700",
      glow: "rgba(168, 85, 247, 0.35)",
      border: "rgba(168, 85, 247, 0.3)",
      Icon: Layers,
    };
  }

  if (
    lowerRole.includes("back") ||
    lowerRole.includes("api") ||
    lowerRole.includes("devops")
  ) {
    return {
      label: "BE",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      glow: "rgba(16, 185, 129, 0.35)",
      border: "rgba(16, 185, 129, 0.3)",
      Icon: Server,
    };
  }

  if (
    lowerRole.includes("sql") ||
    lowerRole.includes("database") ||
    lowerRole.includes("data")
  ) {
    return {
      label: "SQL",
      gradient: "from-sky-500 via-blue-600 to-indigo-700",
      glow: "rgba(14, 165, 233, 0.35)",
      border: "rgba(14, 165, 233, 0.3)",
      Icon: Database,
    };
  }

  // 2. Techstack-based checks fallback
  if (
    lowerTechs.some((t) =>
      t.includes("react") ||
      t.includes("next") ||
      t.includes("vue") ||
      t.includes("css") ||
      t.includes("html") ||
      t.includes("tailwind")
    )
  ) {
    return {
      label: "FE",
      gradient: "from-cyan-400 via-blue-500 to-indigo-600",
      glow: "rgba(6, 182, 212, 0.35)",
      border: "rgba(6, 182, 212, 0.3)",
      Icon: Code2,
    };
  }

  if (
    lowerTechs.some((t) =>
      t.includes("node") ||
      t.includes("express") ||
      t.includes("python") ||
      t.includes("java") ||
      t.includes("golang") ||
      t.includes("c#")
    )
  ) {
    return {
      label: "BE",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      glow: "rgba(16, 185, 129, 0.35)",
      border: "rgba(16, 185, 129, 0.3)",
      Icon: Server,
    };
  }

  if (
    lowerTechs.some((t) =>
      t.includes("sql") ||
      t.includes("postgres") ||
      t.includes("mongo") ||
      t.includes("redis")
    )
  ) {
    return {
      label: "DB",
      gradient: "from-sky-500 via-blue-600 to-indigo-700",
      glow: "rgba(14, 165, 233, 0.35)",
      border: "rgba(14, 165, 233, 0.3)",
      Icon: Database,
    };
  }

  // 3. Generic Role Initials
  const words = clean.split(" ").filter(Boolean);
  const initials =
    words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : clean.slice(0, 2).toUpperCase() || "IT";

  return {
    label: initials,
    gradient: "from-indigo-500 via-indigo-600 to-violet-700",
    glow: "rgba(99, 102, 241, 0.35)",
    border: "rgba(99, 102, 241, 0.3)",
    Icon: Terminal,
  };
}

// Accessible SVG Circular Score Ring
function ScoreRing({ score }: { score?: number | null }) {
  const hasScore = typeof score === "number" && score >= 0;
  const size = 44;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = hasScore ? Math.min(100, Math.max(0, score)) : 0;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const strokeColor = !hasScore
    ? "rgba(255, 255, 255, 0.15)"
    : normalizedScore >= 80
    ? "#34D399" // emerald
    : normalizedScore >= 60
    ? "#818CF8" // indigo
    : normalizedScore >= 40
    ? "#FBBF24" // amber
    : "#F87171"; // red

  return (
    <div
      className="flex items-center gap-2.5"
      role="meter"
      aria-label="AI Performance Score"
      aria-valuenow={hasScore ? normalizedScore : 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={hasScore ? `${normalizedScore} out of 100` : "Not taken yet"}
    >
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="transform -rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {hasScore ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          ) : (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth={strokeWidth}
              strokeDasharray="4 4"
              fill="transparent"
            />
          )}
        </svg>
        <span className="absolute text-[11px] font-bold text-white tracking-tight" aria-hidden="true">
          {hasScore ? normalizedScore : "—"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
          AI Score
        </span>
        <span className="text-xs font-semibold text-slate-200">
          {hasScore ? `${normalizedScore}/100` : "Not Taken"}
        </span>
      </div>
    </div>
  );
}

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  // Logic & API call untouched
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  // Typo fix: "Frontend Devloper" -> "Frontend Developer"
  const cleanRole = (role || "Interview").replace(/devloper/gi, "Developer").trim();
  const displayTitle = cleanRole.toLowerCase().includes("interview")
    ? cleanRole
    : `${cleanRole} Interview`;

  // Normalize Type
  const normalizedType = /mix/gi.test(type)
    ? "Mixed"
    : /tech/gi.test(type)
    ? "Technical"
    : /behav/gi.test(type)
    ? "Behavioral"
    : type || "Mixed";

  const badgeVariant =
    normalizedType === "Technical"
      ? "technical"
      : normalizedType === "Behavioral"
      ? "behavioral"
      : "mixed";

  // Visual avatar based on role and techstack
  const visual = getTechRoleVisual(cleanRole, techstack);
  const IconComponent = visual.Icon;

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <article className="group relative w-full h-full flex flex-col justify-between p-6 rounded-2xl bg-[#0F0F1A] border border-white/[0.08] hover:border-indigo-500/40 hover:shadow-[0_12px_36px_rgba(99,102,241,0.18)] focus-within:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Ambient background hover shimmer */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-purple-500/[0.04] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Top Header: Tech Avatar & Type Badge */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          {/* Tech/Role Avatar */}
          <div
            className={`relative flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br ${visual.gradient} shadow-lg text-white font-extrabold text-sm tracking-wider`}
            style={{
              boxShadow: `0 4px 20px ${visual.glow}`,
              border: `1px solid ${visual.border}`,
            }}
            aria-hidden="true"
          >
            <div className="flex flex-col items-center justify-center leading-none">
              <IconComponent className="size-5 mb-0.5 opacity-90" />
              <span className="text-[10px] font-bold tracking-tight">{visual.label}</span>
            </div>
          </div>

          {/* Type Badge */}
          <Badge variant={badgeVariant} className="text-xs font-semibold shrink-0">
            {normalizedType}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-lg font-bold text-slate-100 group-hover:text-indigo-200 transition-colors capitalize line-clamp-1">
          {displayTitle}
        </h3>

        {/* Date & Score Ring Row */}
        <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-white/[0.06]">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="size-3.5 text-slate-400" aria-hidden="true" />
            <time dateTime={feedback?.createdAt || createdAt}>{formattedDate}</time>
          </div>

          {/* Score Ring */}
          <ScoreRing score={feedback?.totalScore} />
        </div>

        {/* Feedback Assessment or Placeholder */}
        <p className="line-clamp-2 mt-4 text-xs text-slate-400 leading-relaxed min-h-[34px]">
          {feedback?.finalAssessment ||
            "Practice realistic AI-conducted questions tailored to this role and get instant assessment."}
        </p>
      </div>

      {/* Footer: Tech Stack Icons + Action Button */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-white/[0.06]">
        <DisplayTechIcons techStack={techstack} />

        {feedback ? (
          <Button
            asChild
            className="btn-secondary !h-9 !px-4 !text-xs font-semibold focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F1A]"
          >
            <Link
              href={`/interview/${interviewId}/feedback`}
              aria-label={`Check feedback for ${displayTitle}`}
            >
              Check Feedback
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            className="btn-primary !h-9 !px-4 !text-xs font-semibold group/btn focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F1A]"
          >
            <Link
              href={`/interview/${interviewId}`}
              className="flex items-center gap-1.5"
              aria-label={`Take ${displayTitle}`}
            >
              <span>Take Interview</span>
              <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
};

export default InterviewCard;
