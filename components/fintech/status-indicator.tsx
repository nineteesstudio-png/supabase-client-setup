"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusIndicatorVariants = cva(
  "inline-flex items-center gap-2 font-medium",
  {
    variants: {
      status: {
        online: "text-[#00E5A8]",
        offline: "text-[#FF5A7A]",
        warning: "text-[#FFB547]",
        idle: "text-[#64748B]",
        processing: "text-[#00D4FF]",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      status: "online",
      size: "md",
    },
  }
)

const dotColors = {
  online: "bg-[#00E5A8]",
  offline: "bg-[#FF5A7A]",
  warning: "bg-[#FFB547]",
  idle: "bg-[#64748B]",
  processing: "bg-[#00D4FF]",
}

const glowColors = {
  online: "shadow-[0_0_8px_rgba(0,229,168,0.6)]",
  offline: "shadow-[0_0_8px_rgba(255,90,122,0.6)]",
  warning: "shadow-[0_0_8px_rgba(255,181,71,0.6)]",
  idle: "shadow-[0_0_8px_rgba(100,116,139,0.4)]",
  processing: "shadow-[0_0_8px_rgba(0,212,255,0.6)]",
}

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  pulse?: boolean
  glow?: boolean
  label?: string
  showDot?: boolean
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status = "online", size, pulse = true, glow = false, label, showDot = true, ...props }, ref) => {
    const statusLabels = {
      online: "Online",
      offline: "Offline",
      warning: "Warning",
      idle: "Idle",
      processing: "Processing",
    }

    return (
      <div
        ref={ref}
        className={cn(statusIndicatorVariants({ status, size, className }))}
        {...props}
      >
        {showDot && (
          <span className="relative flex h-2 w-2">
            {pulse && status !== "idle" && (
              <span
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                  dotColors[status || "online"]
                )}
              />
            )}
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                dotColors[status || "online"],
                glow && glowColors[status || "online"]
              )}
            />
          </span>
        )}
        <span>{label || statusLabels[status || "online"]}</span>
      </div>
    )
  }
)
StatusIndicator.displayName = "StatusIndicator"

// Live indicator specifically for real-time data
export interface LiveIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  label?: string
}

const LiveIndicator = React.forwardRef<HTMLDivElement, LiveIndicatorProps>(
  ({ className, active = true, label = "LIVE", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wider",
          active
            ? "bg-[#FF5A7A]/10 text-[#FF5A7A] border border-[#FF5A7A]/20"
            : "bg-[#64748B]/10 text-[#64748B] border border-[#64748B]/20",
          className
        )}
        {...props}
      >
        <span className="relative flex h-2 w-2">
          {active && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF5A7A] opacity-75 animate-ping" />
          )}
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              active ? "bg-[#FF5A7A]" : "bg-[#64748B]"
            )}
          />
        </span>
        {label}
      </div>
    )
  }
)
LiveIndicator.displayName = "LiveIndicator"

export { StatusIndicator, LiveIndicator, statusIndicatorVariants }
