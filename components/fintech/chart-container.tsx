"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  toolbar?: React.ReactNode
  footer?: React.ReactNode
  loading?: boolean
  empty?: boolean
  emptyMessage?: string
  aspectRatio?: "video" | "square" | "wide" | "auto"
  minHeight?: string
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      className,
      title,
      description,
      toolbar,
      footer,
      loading,
      empty,
      emptyMessage = "No data available",
      aspectRatio = "auto",
      minHeight = "300px",
      children,
      ...props
    },
    ref
  ) => {
    const aspectRatioClasses = {
      video: "aspect-video",
      square: "aspect-square",
      wide: "aspect-[21/9]",
      auto: "",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#0B1220] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Header */}
        {(title || toolbar) && (
          <div className="flex items-start justify-between gap-4 p-6 pb-0">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-[#64748B] mt-1">{description}</p>
              )}
            </div>
            {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
          </div>
        )}

        {/* Chart Area */}
        <div
          className={cn(
            "relative p-6",
            aspectRatioClasses[aspectRatio]
          )}
          style={{ minHeight: aspectRatio === "auto" ? minHeight : undefined }}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0B1220]/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 border-2 border-[#00D4FF]/20 rounded-full" />
                  <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-[#00D4FF] rounded-full animate-spin" />
                </div>
                <span className="text-sm text-[#64748B]">Loading chart...</span>
              </div>
            </div>
          ) : empty ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#64748B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-[#64748B]">{emptyMessage}</span>
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.06)]">
            {footer}
          </div>
        )}
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

// Chart Legend Component
export interface ChartLegendItemProps {
  color: string
  label: string
  value?: string | number
  active?: boolean
  onClick?: () => void
}

const ChartLegendItem = ({
  color,
  label,
  value,
  active = true,
  onClick,
}: ChartLegendItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md transition-colors",
        onClick && "hover:bg-[rgba(255,255,255,0.04)] cursor-pointer",
        !active && "opacity-40"
      )}
    >
      <span
        className="w-3 h-3 rounded-sm flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-[#94A3B8]">{label}</span>
      {value !== undefined && (
        <span className="text-sm font-medium text-white ml-1">{value}</span>
      )}
    </button>
  )
}

export interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ChartLegendItemProps[]
  orientation?: "horizontal" | "vertical"
}

const ChartLegend = React.forwardRef<HTMLDivElement, ChartLegendProps>(
  ({ className, items, orientation = "horizontal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap gap-1",
          orientation === "vertical" && "flex-col",
          className
        )}
        {...props}
      >
        {items.map((item, index) => (
          <ChartLegendItem key={index} {...item} />
        ))}
      </div>
    )
  }
)
ChartLegend.displayName = "ChartLegend"

export { ChartContainer, ChartLegend, ChartLegendItem }
