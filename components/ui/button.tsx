import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles — layout & transitions only
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer select-none",
  {
    variants: {
      variant: {
        // ── Primary: indigo→violet gradient ──
        primary: [
          "text-white border-none",
          "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]",
          "hover:opacity-88 hover:-translate-y-px hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]",
          "focus-visible:ring-2 focus-visible:ring-[#6366F1]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]",
          "active:scale-[0.98]",
        ],
        // ── Secondary: outlined accent ──
        secondary: [
          "text-[#A5B4FC] bg-transparent",
          "border border-[#6366F1]/40",
          "hover:bg-[#6366F1]/10 hover:border-[#6366F1]/70 hover:-translate-y-px",
          "focus-visible:ring-2 focus-visible:ring-[#6366F1]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]",
          "active:scale-[0.98]",
        ],
        // ── Ghost: no border, subtle hover ──
        ghost: [
          "text-[#A5B4FC] bg-transparent border-transparent",
          "hover:bg-[#6366F1]/10 hover:text-[#C4B5FD]",
          "focus-visible:ring-2 focus-visible:ring-[#6366F1]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]",
          "active:scale-[0.98]",
        ],
        // ── Danger ──
        danger: [
          "text-white border-none",
          "bg-gradient-to-br from-[#F87171] to-[#DC2626]",
          "hover:opacity-88 hover:-translate-y-px hover:shadow-[0_0_20px_rgba(248,113,113,0.35)]",
          "focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]",
          "active:scale-[0.98]",
        ],
        // ── Default (shadcn compat) ──
        default: [
          "text-white border-none",
          "bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]",
          "hover:opacity-88 hover:-translate-y-px hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]",
          "focus-visible:ring-2 focus-visible:ring-[#6366F1]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]",
          "active:scale-[0.98]",
        ],
        // ── Outline (shadcn compat) ──
        outline: [
          "text-[#A5B4FC] bg-transparent",
          "border border-[#6366F1]/40",
          "hover:bg-[#6366F1]/10 hover:border-[#6366F1]/70 hover:-translate-y-px",
          "focus-visible:ring-2 focus-visible:ring-[#6366F1]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]",
          "active:scale-[0.98]",
        ],
        // ── Link ──
        link: "text-[#A5B4FC] underline-offset-4 hover:underline hover:text-[#C4B5FD]",
        // ── Destructive (shadcn compat) ──
        destructive: [
          "text-white border-none",
          "bg-gradient-to-br from-[#F87171] to-[#DC2626]",
          "hover:opacity-88 hover:-translate-y-px hover:shadow-[0_0_20px_rgba(248,113,113,0.35)]",
          "focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]",
          "active:scale-[0.98]",
        ],
      },
      size: {
        sm: "h-8 px-4 text-xs rounded-full",
        default: "h-10 px-5 text-sm rounded-full",
        md: "h-10 px-5 text-sm rounded-full",
        lg: "h-12 px-7 text-sm rounded-full",
        xl: "h-14 px-8 text-base rounded-full",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
