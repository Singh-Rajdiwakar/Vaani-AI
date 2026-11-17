"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { auth } from "@/firebase/client";
import { signOut as firebaseSignOut } from "firebase/auth";
import { signOut as serverSignOut } from "@/lib/actions/auth.action";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    id?: string;
  } | null;
  rightSlot?: React.ReactNode;
}

const Navbar = ({ user, rightSlot }: NavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract user initials
  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "ME";

  // Handle outside click & Escape key accessibility
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // 1. Firebase client sign out
      if (auth) {
        try {
          await firebaseSignOut(auth);
        } catch (fbErr) {
          console.warn("Firebase sign out warning:", fbErr);
        }
      }

      // 2. Clear session cookie via server action and API endpoint
      try {
        await serverSignOut();
      } catch (srvErr) {
        console.warn("Server action sign out warning:", srvErr);
      }

      await fetch("/api/auth/sign-out", { method: "POST" }).catch(() => {});

      toast.success("Signed out successfully");

      // 3. Redirect to "/" (public landing page)
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="pp-navbar">
      <div className="pp-navbar-inner">
        {/* ── Brand ── */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F] rounded-xl p-1 -m-1"
          aria-label="VaaniAI - Go to Dashboard"
        >
          <div className="relative flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-[0_0_16px_rgba(99,102,241,0.4)] transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo-icon.svg"
              alt=""
              width={22}
              height={22}
              className="object-contain"
              aria-hidden="true"
              unoptimized
            />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#F1F5F9] group-hover:text-white transition-colors duration-200 flex items-center gap-1">
              Vaani
              <span className="bg-gradient-to-r from-[#A5B4FC] to-[#C4B5FD] bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </div>
        </Link>

        {/* ── Right side: Quick Action + Profile Dropdown ── */}
        <div className="flex items-center gap-3">
          {rightSlot}

          {/* Quick Start Link */}
          <Link
            href="/interview"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 hover:bg-indigo-500/20 hover:text-white hover:border-indigo-500/40 transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
          >
            <Sparkles className="size-3.5 text-indigo-400" aria-hidden="true" />
            <span>New Practice</span>
          </Link>

          {/* Profile Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
              aria-label="Open user profile menu"
              className="flex items-center gap-2.5 p-1.5 -m-1.5 rounded-2xl hover:bg-white/[0.05] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 group cursor-pointer"
            >
              {/* Avatar circle */}
              <div className="relative flex items-center justify-center size-9 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold tracking-wider ring-2 ring-white/10 shadow-[0_0_12px_rgba(99,102,241,0.35)] group-hover:ring-indigo-400/50 transition-all">
                {initials}
                {/* Active indicator */}
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#34D399] ring-2 ring-[#09090F]" />
              </div>

              {/* Name & Role */}
              {user?.name && (
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200 line-clamp-1 max-w-[120px] group-hover:text-white transition-colors">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[120px]">
                    Candidate
                  </span>
                </div>
              )}

              {/* Chevron icon */}
              <ChevronDown
                className={`size-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  className="absolute right-0 top-full mt-2.5 w-64 sm:w-72 rounded-2xl border border-white/[0.08] bg-[#0F0F1A]/95 backdrop-blur-xl p-2 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_28px_rgba(99,102,241,0.15)] z-50 overflow-hidden"
                >
                  {/* User info header */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="relative flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold tracking-wider ring-2 ring-white/10 flex-shrink-0">
                      {initials}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-bold text-white truncate">
                        {user?.name || "Candidate"}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">
                        {user?.email || "Signed In"}
                      </span>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="size-3" />
                        <span>Ready to interview</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/[0.07] my-1.5" />

                  {/* Navigation Links */}
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:bg-white/[0.08]"
                    >
                      <LayoutDashboard className="size-4 text-indigo-400" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/interview"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:bg-white/[0.08]"
                    >
                      <PlusCircle className="size-4 text-violet-400" />
                      <span>Generate New Interview</span>
                    </Link>
                  </div>

                  <div className="h-px bg-white/[0.07] my-1.5" />

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    role="menuitem"
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {isLoggingOut ? (
                      <Loader2
                        className="size-4 text-rose-400 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <LogOut
                        className="size-4 text-rose-400 group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    )}
                    <span>{isLoggingOut ? "Signing out..." : "Log out"}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
