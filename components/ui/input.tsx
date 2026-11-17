import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base layout
        "flex h-12 w-full min-w-0 px-5",
        "text-sm text-[#F1F5F9]",
        "rounded-full",
        // Background
        "bg-[#14141F]",
        // Border
        "border border-white/[0.08]",
        // Placeholder
        "placeholder:text-[#64748B]",
        // File input
        "file:text-[#F1F5F9] file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Transitions
        "transition-[border-color,box-shadow] duration-200",
        // Focus
        "focus-visible:outline-none focus-visible:border-[#6366F1]/60 focus-visible:ring-[3px] focus-visible:ring-[#6366F1]/15",
        // Invalid
        "aria-invalid:border-[#F87171] aria-invalid:ring-2 aria-invalid:ring-[#F87171]/20",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}

export { Input };
