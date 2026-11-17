"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Layers,
  Cpu,
  Sliders,
  ChevronDown,
  X,
  Plus,
  Loader2,
  Check,
} from "lucide-react";

import { cn } from "@/lib/utils";

const POPULAR_TECHS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "SQL",
  "Python",
  "Tailwind CSS",
  "MongoDB",
];

const InterviewForm = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  // Form State
  const [form, setForm] = useState({
    role: "",
    level: "Junior",
    techstack: "",
    type: "mixed",
    amount: "5",
  });

  // Tag / Chip Input State
  const [tags, setTags] = useState<string[]>([
    "React",
    "TypeScript",
    "Node.js",
  ]);
  const [tagInput, setTagInput] = useState("");

  const addTag = (rawTag: string) => {
    const trimmed = rawTag.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      toast.info(`"${trimmed}" is already added.`);
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // Submit Handler (Logic untouched)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!form.role.trim()) {
      toast.error("Please enter a target job role.");
      return;
    }

    const finalTechstack = tags.length > 0 ? tags.join(", ") : form.techstack;
    if (!finalTechstack.trim()) {
      toast.error("Please add at least one technology to the tech stack.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          techstack: finalTechstack,
          amount: Number(form.amount) || 5,
          userid: userId,
        }),
      });

      const data = await res.json();
      console.log("generate response:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed");
      }

      toast.success("Interview generated and ready!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isRoleInvalid = touched && !form.role.trim();
  const isTechstackInvalid = touched && tags.length === 0;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* ── Main Glass Card ───────────────────────────────── */}
      <div className="relative rounded-3xl bg-[#0F0F1A]/90 border border-white/[0.08] backdrop-blur-2xl p-5 sm:p-8 lg:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.7),0_0_36px_rgba(99,102,241,0.12)] overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-60 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-3xl -z-0"
        />

        {/* Card Header */}
        <div className="relative z-10 flex flex-col gap-4 pb-6 border-b border-white/[0.07]">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -m-1"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Back to Dashboard</span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 mb-2.5">
              <Sparkles className="size-3 text-indigo-400" aria-hidden="true" />
              <span>AI Question Synthesizer</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Generate an Interview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              Configure your role, experience level, and stack. Gemini AI will
              generate realistic questions tailored to your profile.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5 sm:gap-6 mt-6" noValidate>
          {/* 1. Job Role */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="target-role" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="size-3.5 text-indigo-400" aria-hidden="true" />
                <span>Target Role</span>
                <span className="text-indigo-400">*</span>
              </label>
              {isRoleInvalid && (
                <span className="text-[11px] text-red-400 font-medium">Role is required</span>
              )}
            </div>

            <input
              id="target-role"
              type="text"
              required
              aria-invalid={isRoleInvalid}
              placeholder="e.g. Frontend Developer, Full Stack Engineer"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={cn(
                "h-12 w-full rounded-xl bg-[#14141F] px-4 text-sm text-slate-100 font-medium placeholder:text-slate-400 transition-all",
                isRoleInvalid
                  ? "border border-red-500/60 focus:border-red-500 focus:ring-4 focus:ring-red-500/15"
                  : "border border-white/[0.08] focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15"
              )}
            />
          </div>

          {/* 2. Group: Level & Interview Type (2-col grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Experience Level */}
            <div className="flex flex-col gap-2">
              <label htmlFor="experience-level" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="size-3.5 text-indigo-400" aria-hidden="true" />
                <span>Experience Level</span>
              </label>

              <div className="relative">
                <select
                  id="experience-level"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="h-12 w-full rounded-xl bg-[#14141F] border border-white/[0.08] px-4 pr-10 text-sm text-slate-100 font-medium focus:outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15 cursor-pointer appearance-none transition-all"
                >
                  <option value="Fresher" className="bg-[#14141F] text-slate-200">
                    Fresher / Entry
                  </option>
                  <option value="Junior" className="bg-[#14141F] text-slate-200">
                    Junior (1-2 yrs)
                  </option>
                  <option value="Mid" className="bg-[#14141F] text-slate-200">
                    Mid-Level (3-5 yrs)
                  </option>
                  <option value="Senior" className="bg-[#14141F] text-slate-200">
                    Senior (5+ yrs)
                  </option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            {/* Interview Type */}
            <div className="flex flex-col gap-2">
              <label htmlFor="interview-type" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="size-3.5 text-indigo-400" aria-hidden="true" />
                <span>Interview Focus</span>
              </label>

              <div className="relative">
                <select
                  id="interview-type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="h-12 w-full rounded-xl bg-[#14141F] border border-white/[0.08] px-4 pr-10 text-sm text-slate-100 font-medium focus:outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15 cursor-pointer appearance-none transition-all"
                >
                  <option value="mixed" className="bg-[#14141F] text-slate-200">
                    Mixed (Tech + Behavioral)
                  </option>
                  <option value="technical" className="bg-[#14141F] text-slate-200">
                    Technical Only
                  </option>
                  <option value="behavioural" className="bg-[#14141F] text-slate-200">
                    Behavioral Only
                  </option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* 3. Tech Stack Tag / Chip Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="tech-input" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="size-3.5 text-indigo-400" aria-hidden="true" />
                <span>Tech Stack (Tags)</span>
                <span className="text-indigo-400">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Press Enter or Comma to add
              </span>
            </div>

            {/* Tag Input Box */}
            <div
              className={cn(
                "min-h-14 w-full rounded-xl bg-[#14141F] p-2.5 flex flex-wrap items-center gap-2 transition-all",
                isTechstackInvalid
                  ? "border border-red-500/60 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/15"
                  : "border border-white/[0.08] focus-within:border-indigo-500/60 focus-within:ring-4 focus-within:ring-indigo-500/15"
              )}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 group animate-fadeIn"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-indigo-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-400 rounded"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </span>
              ))}

              <input
                id="tech-input"
                type="text"
                placeholder={tags.length === 0 ? "e.g. React, Node.js, SQL" : "Add another tech..."}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => {
                  if (tagInput.trim()) addTag(tagInput);
                }}
                className="flex-1 min-w-[140px] bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none px-1 py-1"
              />
            </div>

            {/* Popular Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1" role="group" aria-label="Suggested technologies">
              <span className="text-[11px] text-slate-400 font-medium mr-1">
                Suggestions:
              </span>
              {POPULAR_TECHS.map((tech) => {
                const isSelected = tags.some((t) => t.toLowerCase() === tech.toLowerCase());
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => (isSelected ? removeTag(tech) : addTag(tech))}
                    aria-pressed={isSelected}
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400",
                      isSelected
                        ? "bg-indigo-500/25 text-indigo-200 border border-indigo-500/40"
                        : "bg-white/5 text-slate-400 border border-white/10 hover:text-slate-200 hover:bg-white/10"
                    )}
                  >
                    {isSelected ? <Check className="size-2.5 text-indigo-300" aria-hidden="true" /> : <Plus className="size-2.5" aria-hidden="true" />}
                    <span>{tech}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Number of Questions */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Question Count
              </label>
              <span className="text-xs font-bold text-indigo-300">
                {form.amount} Questions (~{Number(form.amount) * 2} mins)
              </span>
            </div>

            {/* Quick Pills in 2-col or 4-col responsive grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="Select number of questions">
              {["3", "5", "7", "10"].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setForm({ ...form, amount: cnt })}
                  aria-pressed={form.amount === cnt}
                  className={cn(
                    "h-11 rounded-xl text-xs font-bold transition-all cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                    form.amount === cnt
                      ? "bg-indigo-500 text-white border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                      : "bg-[#14141F] text-slate-300 border-white/[0.08] hover:bg-white/5 hover:text-white"
                  )}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>

          {/* 5. Full-Width Generate Button with Loading State */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={cn(
                "w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 transition-all duration-300 select-none shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]",
                loading
                  ? "bg-indigo-600/60 shadow-[0_0_20px_rgba(99,102,241,0.2)] cursor-not-allowed opacity-90"
                  : "bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_36px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:scale-[0.99]"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" aria-hidden="true" />
                  <span>Generating Interview with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4 text-indigo-200" aria-hidden="true" />
                  <span>Generate Interview</span>
                  <ArrowRight className="size-4 text-indigo-200" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewForm;
