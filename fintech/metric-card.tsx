"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  size?: "sm" | "md" | "lg"
  showTrendIcon?: boolean
  sparkline?: number[]
}

function MiniSparkline({ data, trend }: { data: number[]; trend?: "up" | "down" | "neutral" }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const height = 24
  const width = 60
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(" ")

  const color = trend === "up" ? "#00E5A8" : trend === "down" ? "#FF5A7A" : "#64748B"

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      title,
      value,
      change,
      changeLabel,
      prefix,
      suffix,
      icon,
      trend,
      size = "md",
      showTrendIcon = true,
      sparkline,
      ...props
    },
    ref
  ) => {
    const derivedTrend = trend || (change !== undefined ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : "neutral")

    const trendColors = {
      up: "text-[#00E5A8]",
      down: "text-[#FF5A7A]",
      neutral: "text-[#64748B]",
    }

    const trendBgColors = {
      up: "bg-[#00E5A8]/10",
      down: "bg-[#FF5A7A]/10",
      neutral: "bg-[#64748B]/10",
    }

    const sizes = {
      sm: {
        wrapper: "p-4",
        title: "text-xs",
        value: "text-xl",
        change: "text-xs",
      },
      md: {
        wrapper: "p-6",
        title: "text-sm",
        value: "text-2xl",
        change: "text-sm",
      },
      lg: {
        wrapper: "p-8",
        title: "text-base",
        value: "text-4xl",
        change: "text-base",
      },
    }

    const TrendIcon = derivedTrend === "up" ? TrendingUp : derivedTrend === "down" ? TrendingDown : Minus

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-xl",
          sizes[size].wrapper,
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              {icon && (
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)]">
                  {icon}
                </div>
              )}
              <span className={cn("text-[#64748B] font-medium", sizes[size].title)}>
                {title}
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              {prefix && (
                <span className={cn("text-[#64748B] font-medium", sizes[size].value)}>
                  {prefix}
                </span>
              )}
              <span className={cn("font-semibold text-white tracking-tight", sizes[size].value)}>
                {value}
              </span>
              {suffix && (
                <span className={cn("text-[#64748B] font-medium text-lg")}>
                  {suffix}
                </span>
              )}
            </div>

            {change !== undefined && (
              <div className="flex items-center gap-2 mt-3">
                <div
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md",
                    trendBgColors[derivedTrend],
                    trendColors[derivedTrend],
                    sizes[size].change
                  )}
                >
                  {showTrendIcon && <TrendIcon className="w-3 h-3" />}
                  <span className="font-medium">
                    {change > 0 ? "+" : ""}
                    {change.toFixed(2)}%
                  </span>
                </div>
                {changeLabel && (
                  <span className={cn("text-[#64748B]", sizes[size].change)}>
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          {sparkline && sparkline.length > 1 && (
            <div className="flex-shrink-0">
              <MiniSparkline data={sparkline} trend={derivedTrend} />
            </div>
          )}
        </div>
      </div>
    )
  }
)
MetricCard.displayName = "MetricCard"

export { MetricCard }
