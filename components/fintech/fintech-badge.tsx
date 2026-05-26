"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const fintechBadgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#1A2332] text-[#94A3B8] border border-[rgba(255,255,255,0.06)]",
        primary:
          "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20",
        success:
          "bg-[#00E5A8]/10 text-[#00E5A8] border border-[#00E5A8]/20",
        destructive:
          "bg-[#FF5A7A]/10 text-[#FF5A7A] border border-[#FF5A7A]/20",
        warning:
          "bg-[#FFB547]/10 text-[#FFB547] border border-[#FFB547]/20",
        outline:
          "bg-transparent text-[#94A3B8] border border-[rgba(255,255,255,0.1)]",
        glass:
          "bg-[rgba(255,255,255,0.05)] backdrop-blur-sm text-white border border-[rgba(255,255,255,0.08)]",
      },
      size: {
        sm: "text-xs px-2 py-0.5 rounded-md",
        md: "text-xs px-2.5 py-1 rounded-lg",
        lg: "text-sm px-3 py-1.5 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface FintechBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fintechBadgeVariants> {
  dot?: boolean
  dotColor?: string
  pulse?: boolean
}

const FintechBadge = React.forwardRef<HTMLDivElement, FintechBadgeProps>(
  ({ className, variant, size, dot, dotColor, pulse, children, ...props }, ref) => {
    const defaultDotColors = {
      default: "bg-[#64748B]",
      primary: "bg-[#00D4FF]",
      success: "bg-[#00E5A8]",
      destructive: "bg-[#FF5A7A]",
      warning: "bg-[#FFB547]",
      outline: "bg-[#64748B]",
      glass: "bg-white",
    }

    return (
      <div
        ref={ref}
        className={cn(fintechBadgeVariants({ variant, size, className }))}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
              dotColor || defaultDotColors[variant || "default"],
              pulse && "animate-pulse"
            )}
          />
        )}
        {children}
      </div>
    )
  }
)
FintechBadge.displayName = "FintechBadge"

export { FintechBadge, fintechBadgeVariants }
