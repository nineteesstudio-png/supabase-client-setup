"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const fintechButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[#00D4FF] text-[#050816] hover:bg-[#00D4FF]/90 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]",
        success:
          "bg-[#00E5A8] text-[#050816] hover:bg-[#00E5A8]/90 shadow-[0_0_20px_rgba(0,229,168,0.3)] hover:shadow-[0_0_30px_rgba(0,229,168,0.4)]",
        destructive:
          "bg-[#FF5A7A] text-white hover:bg-[#FF5A7A]/90 shadow-[0_0_20px_rgba(255,90,122,0.3)] hover:shadow-[0_0_30px_rgba(255,90,122,0.4)]",
        secondary:
          "bg-[#1A2332] text-[#94A3B8] border border-[rgba(255,255,255,0.06)] hover:bg-[#1A2332]/80 hover:text-white",
        ghost:
          "text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.06)]",
        outline:
          "border border-[rgba(255,255,255,0.1)] bg-transparent text-white hover:bg-[rgba(255,255,255,0.06)] hover:border-[#00D4FF]/50",
        "outline-success":
          "border border-[#00E5A8]/30 bg-transparent text-[#00E5A8] hover:bg-[#00E5A8]/10 hover:border-[#00E5A8]/50",
        "outline-destructive":
          "border border-[#FF5A7A]/30 bg-transparent text-[#FF5A7A] hover:bg-[#FF5A7A]/10 hover:border-[#FF5A7A]/50",
        glass:
          "bg-[rgba(11,18,32,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(11,18,32,0.9)] hover:border-[rgba(255,255,255,0.15)]",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 text-sm rounded-lg",
        lg: "h-12 px-6 text-base rounded-lg",
        xl: "h-14 px-8 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface FintechButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fintechButtonVariants> {
  isLoading?: boolean
}

const FintechButton = React.forwardRef<HTMLButtonElement, FintechButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(fintechButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)
FintechButton.displayName = "FintechButton"

export { FintechButton, fintechButtonVariants }
