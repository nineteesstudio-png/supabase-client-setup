"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Globe, TrendingUp, TrendingDown, Minus, BarChart3, DollarSign, Fuel } from "lucide-react"
import { FintechCard, FintechCardHeader, FintechCardTitle, FintechBadge } from "@/components/fintech"

interface MarketIndicator {
  name: string
  value: string | number
  change: number
  trend: "up" | "down" | "neutral"
  icon?: React.ElementType
}

interface MarketContextProps {
  ihsg: MarketIndicator
  sectorRotation: {
    sector: string
    momentum: "strong" | "moderate" | "weak"
    flow: "inflow" | "outflow" | "neutral"
  }[]
  commoditySentiment: MarketIndicator[]
  usdIdr: MarketIndicator
}

function MarketIndicatorCard({ indicator }: { indicator: MarketIndicator }) {
  const trendConfig = {
    up: { color: "#00E5A8", icon: TrendingUp },
    down: { color: "#FF5A7A", icon: TrendingDown },
    neutral: { color: "#FFB547", icon: Minus },
  }

  const config = trendConfig[indicator.trend]
  const TrendIcon = config.icon
  const Icon = indicator.icon

  return (
    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[#64748B]" />}
          <span className="text-sm text-[#64748B]">{indicator.name}</span>
        </div>
        <TrendIcon className="w-4 h-4" style={{ color: config.color }} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-white font-mono">{indicator.value}</span>
        <span 
          className="text-sm font-medium"
          style={{ color: config.color }}
        >
          {indicator.change >= 0 ? "+" : ""}{indicator.change.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

export function MarketContext({
  ihsg = { name: "IHSG", value: "7,234.56", change: 0.85, trend: "up" as const, icon: BarChart3 },
  sectorRotation = [
    { sector: "Banking", momentum: "strong" as const, flow: "inflow" as const },
    { sector: "Consumer", momentum: "moderate" as const, flow: "neutral" as const },
    { sector: "Mining", momentum: "weak" as const, flow: "outflow" as const },
    { sector: "Infrastructure", momentum: "moderate" as const, flow: "inflow" as const },
  ],
  commoditySentiment = [
    { name: "Coal", value: "$145.20", change: 2.3, trend: "up" as const, icon: Fuel },
    { name: "CPO", value: "MYR 3,850", change: -1.2, trend: "down" as const, icon: Fuel },
  ],
  usdIdr = { name: "USD/IDR", value: "15,425", change: -0.15, trend: "down" as const, icon: DollarSign }
}: Partial<MarketContextProps>) {
  const momentumConfig = {
    strong: { color: "#00E5A8", bg: "bg-[#00E5A8]/10" },
    moderate: { color: "#FFB547", bg: "bg-[#FFB547]/10" },
    weak: { color: "#FF5A7A", bg: "bg-[#FF5A7A]/10" },
  }

  const flowConfig = {
    inflow: { label: "Inflow", color: "#00E5A8" },
    outflow: { label: "Outflow", color: "#FF5A7A" },
    neutral: { label: "Neutral", color: "#64748B" },
  }

  return (
    <FintechCard variant="default" padding="lg">
      <FintechCardHeader className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#A78BFA]" />
            </div>
            <div>
              <FintechCardTitle>Market Context</FintechCardTitle>
              <p className="text-sm text-[#64748B]">Macro Environment</p>
            </div>
          </div>
          <FintechBadge variant="outline" size="sm">Live</FintechBadge>
        </div>
      </FintechCardHeader>

      <div className="space-y-6">
        {/* IHSG & USD/IDR */}
        <div className="grid grid-cols-2 gap-3">
          <MarketIndicatorCard indicator={ihsg} />
          <MarketIndicatorCard indicator={usdIdr} />
        </div>

        {/* Sector Rotation */}
        <div>
          <span className="text-xs text-[#475569] uppercase tracking-wider">Sector Rotation</span>
          <div className="mt-3 space-y-2">
            {sectorRotation.map((sector) => (
              <div 
                key={sector.sector}
                className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)]"
              >
                <span className="text-sm text-[#94A3B8]">{sector.sector}</span>
                <div className="flex items-center gap-2">
                  <span 
                    className={cn(
                      "text-xs px-2 py-0.5 rounded",
                      momentumConfig[sector.momentum].bg
                    )}
                    style={{ color: momentumConfig[sector.momentum].color }}
                  >
                    {sector.momentum}
                  </span>
                  <span 
                    className="text-xs"
                    style={{ color: flowConfig[sector.flow].color }}
                  >
                    {flowConfig[sector.flow].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commodity Sentiment */}
        <div>
          <span className="text-xs text-[#475569] uppercase tracking-wider">Commodity Impact</span>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {commoditySentiment.map((commodity) => (
              <MarketIndicatorCard key={commodity.name} indicator={commodity} />
            ))}
          </div>
        </div>

        {/* Impact Summary */}
        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-gradient-to-br from-[#A78BFA]/5 to-transparent">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/10 flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4 text-[#A78BFA]" />
            </div>
            <div>
              <span className="text-sm font-medium text-white">Market Impact Analysis</span>
              <p className="text-xs text-[#64748B] mt-1">
                Current macro conditions are supportive for banking sector. Strong IDR and positive IHSG momentum create favorable environment for domestic equity exposure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FintechCard>
  )
}
