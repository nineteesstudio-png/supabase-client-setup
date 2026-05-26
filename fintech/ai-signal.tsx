"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Sparkles, Zap } from "lucide-react"

export type SignalStrength = "strong" | "moderate" | "weak"
export type SignalDirection = "bullish" | "bearish" | "neutral"

export interface AISignalProps extends React.HTMLAttributes<HTMLDivElement> {
  signal: SignalDirection
  strength: SignalStrength
  confidence: number
  title?: string
  description?: string
  compact?: boolean
}

const AISignal = React.forwardRef<HTMLDivElement, AISignalProps>(
  ({ className, signal, strength, confidence, title, description, compact = false, ...props }, ref) => {
    const signalConfig = {
      bullish: {
        color: "#00E5A8",
        bgColor: "bg-[#00E5A8]/10",
        borderColor: "border-[#00E5A8]/20",
        glowColor: "shadow-[0_0_20px_rgba(0,229,168,0.15)]",
        icon: TrendingUp,
        label: "Bullish",
      },
      bearish: {
        color: "#FF5A7A",
        bgColor: "bg-[#FF5A7A]/10",
        borderColor: "border-[#FF5A7A]/20",
        glowColor: "shadow-[0_0_20px_rgba(255,90,122,0.15)]",
        icon: TrendingDown,
        label: "Bearish",
      },
      neutral: {
        color: "#FFB547",
        bgColor: "bg-[#FFB547]/10",
        borderColor: "border-[#FFB547]/20",
        glowColor: "shadow-[0_0_20px_rgba(255,181,71,0.15)]",
        icon: AlertTriangle,
        label: "Neutral",
      },
    }

    const strengthConfig = {
      strong: { bars: 3, label: "Strong" },
      moderate: { bars: 2, label: "Moderate" },
      weak: { bars: 1, label: "Weak" },
    }

    const config = signalConfig[signal]
    const Icon = config.icon

    if (compact) {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border",
            config.bgColor,
            config.borderColor,
            className
          )}
          style={{ color: config.color }}
          {...props}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm font-semibold">{config.label}</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((bar) => (
              <div
                key={bar}
                className={cn(
                  "w-1 rounded-full transition-all",
                  bar <= strengthConfig[strength].bars
                    ? "h-3"
                    : "h-2 opacity-30"
                )}
                style={{
                  backgroundColor:
                    bar <= strengthConfig[strength].bars
                      ? config.color
                      : config.color,
                }}
              />
            ))}
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border p-5",
          config.bgColor,
          config.borderColor,
          config.glowColor,
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                config.bgColor
              )}
              style={{ color: config.color }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-lg font-semibold"
                  style={{ color: config.color }}
                >
                  {config.label}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className={cn(
                        "w-1.5 rounded-full transition-all",
                        bar <= strengthConfig[strength].bars
                          ? "h-4"
                          : "h-2 opacity-30"
                      )}
                      style={{
                        backgroundColor: config.color,
                      }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-[#64748B]">
                {strengthConfig[strength].label} Signal
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1">
              <Brain className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-sm text-[#64748B]">AI Confidence</span>
            </div>
            <span
              className="text-2xl font-bold"
              style={{ color: config.color }}
            >
              {confidence}%
            </span>
          </div>
        </div>

        {(title || description) && (
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            {title && (
              <h4 className="text-sm font-medium text-white mb-1">{title}</h4>
            )}
            {description && (
              <p className="text-sm text-[#64748B]">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
AISignal.displayName = "AISignal"

// AI Insight Component
export interface AIInsightProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "insight" | "alert" | "recommendation"
  title: string
  description: string
  confidence?: number
  timestamp?: string
}

const AIInsight = React.forwardRef<HTMLDivElement, AIInsightProps>(
  ({ className, type = "insight", title, description, confidence, timestamp, ...props }, ref) => {
    const typeConfig = {
      insight: {
        icon: Sparkles,
        color: "#00D4FF",
        bgColor: "bg-[#00D4FF]/10",
        borderColor: "border-[#00D4FF]/20",
      },
      alert: {
        icon: AlertTriangle,
        color: "#FFB547",
        bgColor: "bg-[#FFB547]/10",
        borderColor: "border-[#FFB547]/20",
      },
      recommendation: {
        icon: Zap,
        color: "#00E5A8",
        bgColor: "bg-[#00E5A8]/10",
        borderColor: "border-[#00E5A8]/20",
      },
    }

    const config = typeConfig[type]
    const Icon = config.icon

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border p-4",
          config.bgColor,
          config.borderColor,
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              config.bgColor
            )}
            style={{ color: config.color }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium text-white">{title}</h4>
              {confidence !== undefined && (
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${config.color}20`,
                    color: config.color,
                  }}
                >
                  {confidence}% conf.
                </span>
              )}
            </div>
            <p className="text-sm text-[#64748B] mt-1">{description}</p>
            {timestamp && (
              <span className="text-xs text-[#475569] mt-2 block">
                {timestamp}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }
)
AIInsight.displayName = "AIInsight"

export { AISignal, AIInsight }
