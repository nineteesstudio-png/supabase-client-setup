"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Shield, AlertTriangle, TrendingUp, Calculator } from "lucide-react"
import { FintechCard, FintechCardHeader, FintechCardTitle, FintechBadge } from "@/components/fintech"

interface RiskEngineProps {
  portfolioValue: number
  riskPerTrade: number
  positionSize: number
  positionValue: number
  riskRewardRatio: number
  volatilityClass: "low" | "medium" | "high"
  maxDrawdown: number
}

function RiskMeter({ value, max, label }: { value: number; max: number; label: string }) {
  const percentage = (value / max) * 100
  const getColor = () => {
    if (percentage < 33) return "#00E5A8"
    if (percentage < 66) return "#FFB547"
    return "#FF5A7A"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#64748B]">{label}</span>
        <span className="text-sm font-semibold text-white">{value.toFixed(1)}%</span>
      </div>
      <div className="relative h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: getColor() }}
        />
      </div>
    </div>
  )
}

export function RiskEngine({
  portfolioValue = 500000000,
  riskPerTrade = 2,
  positionSize = 1000,
  positionValue = 9875000,
  riskRewardRatio = 2.5,
  volatilityClass = "medium",
  maxDrawdown = 5.2
}: Partial<RiskEngineProps>) {
  const riskAmount = (portfolioValue * riskPerTrade) / 100
  
  const volatilityConfig = {
    low: { color: "#00E5A8", label: "Low Volatility", bg: "bg-[#00E5A8]/10" },
    medium: { color: "#FFB547", label: "Medium Volatility", bg: "bg-[#FFB547]/10" },
    high: { color: "#FF5A7A", label: "High Volatility", bg: "bg-[#FF5A7A]/10" },
  }

  const volConfig = volatilityConfig[volatilityClass]

  return (
    <FintechCard variant="default" padding="lg">
      <FintechCardHeader className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A7A]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#FF5A7A]" />
            </div>
            <div>
              <FintechCardTitle>Risk Engine</FintechCardTitle>
              <p className="text-sm text-[#64748B]">Position Management</p>
            </div>
          </div>
          <FintechBadge 
            variant={volatilityClass === "low" ? "success" : volatilityClass === "medium" ? "warning" : "destructive"}
            size="sm"
          >
            {volConfig.label}
          </FintechBadge>
        </div>
      </FintechCardHeader>

      <div className="space-y-6">
        {/* Position Sizing */}
        <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm font-medium text-white">Recommended Position</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-[#475569] uppercase tracking-wider">Lot Size</span>
              <p className="text-2xl font-bold text-[#00D4FF] mt-1 font-mono">
                {positionSize.toLocaleString("id-ID")}
              </p>
              <span className="text-xs text-[#64748B]">shares</span>
            </div>
            <div>
              <span className="text-xs text-[#475569] uppercase tracking-wider">Position Value</span>
              <p className="text-2xl font-bold text-white mt-1 font-mono">
                {(positionValue / 1e6).toFixed(1)}M
              </p>
              <span className="text-xs text-[#64748B]">IDR</span>
            </div>
          </div>
        </div>

        {/* Risk Parameters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FFB547]" />
              <span className="text-sm text-[#64748B]">Risk per Trade</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-white">{riskPerTrade}%</span>
              <span className="text-xs text-[#475569] ml-2">
                ({(riskAmount / 1e6).toFixed(1)}M IDR)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00E5A8]" />
              <span className="text-sm text-[#64748B]">Risk/Reward Ratio</span>
            </div>
            <span className={cn(
              "text-sm font-semibold px-2 py-0.5 rounded",
              riskRewardRatio >= 2 ? "bg-[#00E5A8]/10 text-[#00E5A8]" : "bg-[#FFB547]/10 text-[#FFB547]"
            )}>
              1:{riskRewardRatio}
            </span>
          </div>
        </div>

        {/* Risk Meters */}
        <div className="space-y-4">
          <RiskMeter value={riskPerTrade} max={5} label="Trade Risk" />
          <RiskMeter value={maxDrawdown} max={15} label="Max Drawdown" />
          <RiskMeter 
            value={(positionValue / portfolioValue) * 100} 
            max={20} 
            label="Portfolio Allocation" 
          />
        </div>

        {/* Portfolio Context */}
        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-gradient-to-br from-[#00D4FF]/5 to-transparent">
          <span className="text-xs text-[#475569] uppercase tracking-wider">Portfolio Value</span>
          <p className="text-lg font-bold text-white mt-1 font-mono">
            IDR {(portfolioValue / 1e6).toFixed(0)}M
          </p>
          <p className="text-xs text-[#64748B] mt-1">
            Based on your portfolio size and risk tolerance
          </p>
        </div>
      </div>
    </FintechCard>
  )
}
