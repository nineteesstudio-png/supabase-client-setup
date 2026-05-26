"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const fintechCardVariants = cva(
  "rounded-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-[#0B1220] border border-[rgba(255,255,255,0.06)]",
        glass:
          "bg-[rgba(11,18,32,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)]",
        gradient:
          "bg-[#0B1220] border border-transparent relative before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-br before:from-[rgba(0,212,255,0.3)] before:via-transparent before:to-[rgba(0,229,168,0.3)] before:-z-10 before:mask-composite-exclude",
        elevated:
          "bg-[#0B1220] border border-[rgba(255,255,255,0.06)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        interactive:
          "bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] cursor-pointer",
        success:
          "bg-[#0B1220] border border-[#00E5A8]/20 shadow-[0_0_20px_rgba(0,229,168,0.1)]",
        danger:
          "bg-[#0B1220] border border-[#FF5A7A]/20 shadow-[0_0_20px_rgba(255,90,122,0.1)]",
        accent:
          "bg-[#0B1220] border border-[#00D4FF]/20 shadow-[0_0_20px_rgba(0,212,255,0.1)]",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
)

export interface FintechCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fintechCardVariants> {}

const FintechCard = React.forwardRef<HTMLDivElement, FintechCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(fintechCardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
FintechCard.displayName = "FintechCard"

const FintechCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5", className)}
    {...props}
  />
))
FintechCardHeader.displayName = "FintechCardHeader"

const FintechCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-white", className)}
    {...props}
  />
))
FintechCardTitle.displayName = "FintechCardTitle"

const FintechCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#64748B]", className)}
    {...props}
  />
))
FintechCardDescription.displayName = "FintechCardDescription"

const FintechCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
FintechCardContent.displayName = "FintechCardContent"

const FintechCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-4 pt-4 border-t border-[rgba(255,255,255,0.06)]", className)}
    {...props}
  />
))
FintechCardFooter.displayName = "FintechCardFooter"

export {
  FintechCard,
  FintechCardHeader,
  FintechCardTitle,
  FintechCardDescription,
  FintechCardContent,
  FintechCardFooter,
  fintechCardVariants,
}
