import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold capitalize tracking-wide transition-colors",
  {
    variants: {
      variant: {
        // Interview type badges
        technical: [
          "bg-[#6366F1]/15 text-[#A5B4FC]",
          "border border-[#6366F1]/25",
          "rounded-md",
        ],
        behavioral: [
          "bg-[#8B5CF6]/15 text-[#C4B5FD]",
          "border border-[#8B5CF6]/25",
          "rounded-md",
        ],
        mixed: [
          "bg-[#64748B]/20 text-[#94A3B8]",
          "border border-[#64748B]/30",
          "rounded-md",
        ],
        // Status badges
        success: [
          "bg-[#34D399]/15 text-[#34D399]",
          "border border-[#34D399]/25",
          "rounded-full",
        ],
        warning: [
          "bg-[#FBBF24]/15 text-[#FBBF24]",
          "border border-[#FBBF24]/25",
          "rounded-full",
        ],
        danger: [
          "bg-[#F87171]/15 text-[#F87171]",
          "border border-[#F87171]/25",
          "rounded-full",
        ],
        info: [
          "bg-[#60A5FA]/15 text-[#60A5FA]",
          "border border-[#60A5FA]/25",
          "rounded-full",
        ],
        // Accent pill
        accent: [
          "bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20",
          "text-[#A5B4FC] border border-[#6366F1]/30",
          "rounded-full",
        ],
        // Default / neutral
        default: [
          "bg-white/[0.07] text-[#94A3B8]",
          "border border-white/[0.1]",
          "rounded-md",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
