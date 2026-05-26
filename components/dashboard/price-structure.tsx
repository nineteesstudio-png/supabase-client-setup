"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, Target, Shield, TriangleAlert as AlertTriangle, ChevronUp, ChevronDown, Minus, Crosshair, Activity, Zap } from "lucide-react"
import { FintechCard, FintechCardHeader, FintechCardTitle, FintechBadge } from "@/components/fintech"

interface PriceStructureProps {
  currentPrice: number
  ema20: number
  ema50: number
  atr: number
  atrPercent: number
  support: number
  resistance: number
  entryZone: { low: number; high: number }
  stopLoss: number
  targetPrice: number
  volatilityClass: "low" | "medium" | "high"
}

// Visual price ladder component
function PriceLadder({ 
  currentPrice, 
  resistance, 
  support, 
  entryZone, 
  stopLoss, 
  targetPrice 
}: Partial<PriceStructureProps>) {
  const levels = [
    { price: targetPrice!, label: "Target", color: "#00E5A8", icon: Target },
    { price: resistance!, label: "Resistance", color: "#FF5A7A", icon: ChevronUp },
    { price: entryZone!.high, label: "Entry High", color: "#00D4FF", icon: Crosshair },
    { price: currentPrice!, label: "Current", color: "#FFB547", icon: Activity, isCurrent: true },
    { price: entryZone!.low, label: "Entry Low", color: "#00D4FF", icon: Crosshair },
    { price: support!, label: "Support", color: "#FFB547", icon: Minus },
    { price: stopLoss!, label: "Stop Loss", color: "#FF5A7A", icon: Shield },
  ].sort((a, b) => b.price - a.price)

  const minPrice = Math.min(...levels.map(l => l.price)) * 0.98
  const maxPrice = Math.max(...levels.map(l => l.price)) * 1.02
  const range = maxPrice - minPrice

  return (
    <div className="relative h-80 bg-gradient-to-b from-[rgba(0,229,168,0.02)] via-transparent to-[rgba(255,90,122,0.02)] rounded-xl border border-[rgba(255,255,255,0.06)] p-4">
      {/* Entry zone highlight */}
      <div 
        className="absolute left-4 right-4 bg-[#00D4FF]/10 border-y border-[#00D4FF]/30 rounded"
        style={{
          top: `${((maxPrice - entryZone!.high) / range) * 100}%`,
          height: `${((entryZone!.high - entryZone!.low) / range) * 100}%`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-[#00D4FF] font-medium bg-[#0B1220]/80 px-2 py-0.5 rounded">
            Optimal Entry Zone
          </span>
        </div>
      </div>

      {/* Price levels */}
      {levels.map((level) => {
        const position = ((maxPrice - level.price) / range) * 100
        const Icon = level.icon
        
        return (
          <div
            key={level.label}
            className="absolute left-0 right-0 flex items-center gap-3 px-4"
            style={{ top: `${position}%`, transform: "translateY(-50%)" }}
          >
            {/* Line */}
            <div 
              className={cn(
                "flex-1 h-px",
                level.isCurrent ? "bg-gradient-to-r from-transparent via-[#FFB547] to-transparent" : ""
              )}
              style={{ 
                backgroundColor: level.isCurrent ? undefined : `${level.color}40`,
              }}
            />
            
            {/* Label */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap",
              level.isCurrent 
                ? "bg-[#FFB547]/20 border border-[#FFB547]/50" 
                : "bg-[rgba(255,255,255,0.04)]"
            )}>
              <Icon className="w-3 h-3" style={{ color: level.color }} />
              <span className="text-[#94A3B8]">{level.label}</span>
              <span className="font-mono font-semibold" style={{ color: level.color }}>
                {level.price.toLocaleString("id-ID")}
              </span>
              {level.isCurrent && (
                <div className="w-2 h-2 bg-[#FFB547] rounded-full animate-pulse ml-1" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// EMA comparison with visual bars
function EMAComparison({ 
  currentPrice, 
  ema20, 
  ema50 
}: { 
  currentPrice: number
  ema20: number
  ema50: number 
}) {
  const aboveEma20 = currentPrice > ema20
  const aboveEma50 = currentPrice > ema50
  const emaSpread = ((ema20 - ema50) / ema50) * 100

  return (
    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[#475569] uppercase tracking-wider">Moving Averages</span>
        <div className={cn(
          "text-xs px-2 py-0.5 rounded",
          aboveEma20 && aboveEma50 
            ? "bg-[#00E5A8]/10 text-[#00E5A8]" 
            : !aboveEma20 && !aboveEma50 
            ? "bg-[#FF5A7A]/10 text-[#FF5A7A]"
            : "bg-[#FFB547]/10 text-[#FFB547]"
        )}>
          {aboveEma20 && aboveEma50 ? "Bullish" : !aboveEma20 && !aboveEma50 ? "Bearish" : "Mixed"}
        </div>
      </div>

      <div className="space-y-4">
        {/* EMA 20 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748B]">EMA 20</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white font-mono">
                {ema20.toLocaleString("id-ID")}
              </span>
              {aboveEma20 ? (
                <ChevronUp className="w-4 h-4 text-[#00E5A8]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#FF5A7A]" />
              )}
            </div>
          </div>
          <div className="relative h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
            <div
              className={cn(
                "absolute left-0 top-0 h-full rounded-full transition-all duration-700",
                aboveEma20 ? "bg-[#00E5A8]" : "bg-[#FF5A7A]"
              )}
              style={{ 
                width: `${Math.min(Math.abs((currentPrice - ema20) / ema20) * 500 + 50, 100)}%`,
                boxShadow: `0 0 10px ${aboveEma20 ? "#00E5A8" : "#FF5A7A"}`
              }}
            />
          </div>
        </div>

        {/* EMA 50 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748B]">EMA 50</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white font-mono">
                {ema50.toLocaleString("id-ID")}
              </span>
              {aboveEma50 ? (
                <ChevronUp className="w-4 h-4 text-[#00E5A8]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#FF5A7A]" />
              )}
            </div>
          </div>
          <div className="relative h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
            <div
              className={cn(
                "absolute left-0 top-0 h-full rounded-full transition-all duration-700",
                aboveEma50 ? "bg-[#00E5A8]" : "bg-[#FF5A7A]"
              )}
              style={{ 
                width: `${Math.min(Math.abs((currentPrice - ema50) / ema50) * 500 + 50, 100)}%`,
                boxShadow: `0 0 10px ${aboveEma50 ? "#00E5A8" : "#FF5A7A"}`
              }}
            />
          </div>
        </div>

        {/* EMA Spread */}
        <div className="pt-2 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#475569]">EMA Spread</span>
            <span className={cn(
              "text-sm font-semibold font-mono",
              emaSpread >= 0 ? "text-[#00E5A8]" : "text-[#FF5A7A]"
            )}>
              {emaSpread >= 0 ? "+" : ""}{emaSpread.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ATR Volatility gauge with visual classification
function VolatilityGauge({ 
  atr, 
  atrPercent, 
  volatilityClass 
}: { 
  atr: number
  atrPercent: number
  volatilityClass: string 
}) {
  const volConfig = {
    low: { color: "#00E5A8", label: "Low", description: "Calm market conditions" },
    medium: { color: "#FFB547", label: "Medium", description: "Normal volatility" },
    high: { color: "#FF5A7A", label: "High", description: "Elevated risk" }
  }

  const config = volConfig[volatilityClass as keyof typeof volConfig]
  const gaugePosition = Math.min(atrPercent * 20, 100)

  return (
    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" style={{ color: config.color }} />
          <span className="text-sm font-medium text-white">ATR Volatility</span>
        </div>
        <FintechBadge 
          variant={volatilityClass === "low" ? "success" : volatilityClass === "medium" ? "warning" : "destructive"}
          size="sm"
        >
          {config.label}
        </FintechBadge>
      </div>

      {/* Value display */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-white font-mono">
          {atr.toLocaleString("id-ID")}
        </span>
        <span className="text-lg font-semibold" style={{ color: config.color }}>
          ({atrPercent}%)
        </span>
      </div>

      {/* Gauge */}
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-[#00E5A8] via-[#FFB547] to-[#FF5A7A] rounded-full opacity-30" />
        <div 
          className="absolute top-0 h-3 rounded-full transition-all duration-700"
          style={{
            width: `${gaugePosition}%`,
            background: `linear-gradient(90deg, #00E5A8 0%, ${gaugePosition > 50 ? "#FFB547" : "#00E5A8"} 50%, ${gaugePosition > 75 ? "#FF5A7A" : gaugePosition > 50 ? "#FFB547" : "#00E5A8"} 100%)`,
            boxShadow: `0 0 15px ${config.color}`
          }}
        />
        {/* Indicator */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white bg-[#0B1220] transition-all duration-700"
          style={{ left: `${gaugePosition}%`, transform: `translateX(-50%) translateY(-50%)` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-xs">
        <span className="text-[#00E5A8]">Low</span>
        <span className="text-[#FFB547]">Medium</span>
        <span className="text-[#FF5A7A]">High</span>
      </div>

      <p className="text-xs text-[#475569] mt-3">{config.description}</p>
    </div>
  )
}

export function PriceStructure({
  currentPrice = 9875,
  ema20 = 9650,
  ema50 = 9420,
  atr = 185,
  atrPercent = 1.87,
  support = 9400,
  resistance = 10200,
  entryZone = { low: 9700, high: 9900 },
  stopLoss = 9350,
  targetPrice = 10500,
  volatilityClass = "medium"
}: Partial<PriceStructureProps>) {
  const riskReward = ((targetPrice - currentPrice) / (currentPrice - stopLoss)).toFixed(2)
  const potentialGain = ((targetPrice - currentPrice) / currentPrice * 100).toFixed(1)
  const potentialLoss = ((currentPrice - stopLoss) / currentPrice * 100).toFixed(1)

  return (
    <FintechCard variant="glass" padding="lg" className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-[#FFB547]/5 rounded-full blur-3xl" />
      
      <FintechCardHeader className="relative mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB547]/20 to-[#FF5A7A]/20 flex items-center justify-center border border-[#FFB547]/30">
                <TrendingUp className="w-6 h-6 text-[#FFB547]" />
              </div>
            </div>
            <div>
              <FintechCardTitle className="text-lg">Price Structure</FintechCardTitle>
              <p className="text-sm text-[#64748B]">Technical Analysis Levels</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-[#475569]">Risk/Reward</span>
              <p className={cn(
                "text-lg font-bold font-mono",
                parseFloat(riskReward) >= 2 ? "text-[#00E5A8]" : "text-[#FFB547]"
              )}>
                1:{riskReward}
              </p>
            </div>
          </div>
        </div>
      </FintechCardHeader>

      <div className="relative space-y-6">
        {/* Main Price Ladder */}
        <PriceLadder 
          currentPrice={currentPrice}
          resistance={resistance}
          support={support}
          entryZone={entryZone}
          stopLoss={stopLoss}
          targetPrice={targetPrice}
        />

        {/* EMA & Volatility Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EMAComparison currentPrice={currentPrice} ema20={ema20} ema50={ema50} />
          <VolatilityGauge atr={atr} atrPercent={atrPercent} volatilityClass={volatilityClass} />
        </div>

        {/* Trade Summary */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[rgba(0,212,255,0.05)] to-[rgba(0,229,168,0.05)] border border-[#00D4FF]/20">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm font-medium text-white">Trade Summary</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <span className="text-xs text-[#475569]">Potential Gain</span>
              <p className="text-xl font-bold text-[#00E5A8] font-mono">+{potentialGain}%</p>
            </div>
            <div className="text-center border-x border-[rgba(255,255,255,0.06)]">
              <span className="text-xs text-[#475569]">Potential Loss</span>
              <p className="text-xl font-bold text-[#FF5A7A] font-mono">-{potentialLoss}%</p>
            </div>
            <div className="text-center">
              <span className="text-xs text-[#475569]">Win Rate Needed</span>
              <p className="text-xl font-bold text-[#FFB547] font-mono">
                {(100 / (1 + parseFloat(riskReward))).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </FintechCard>
  )
}
