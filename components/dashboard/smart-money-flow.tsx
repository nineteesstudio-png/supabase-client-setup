"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Users, Droplets, TrendingUp, Activity, Zap, ChartBar as BarChart3 } from "lucide-react"
import { FintechCard, FintechCardHeader, FintechCardTitle, FintechBadge } from "@/components/fintech"

interface SmartMoneyFlowProps {
  foreignInflow: number
  foreignOutflow: number
  brokerAccumulation: {
    name: string
    netValue: number
    percentage: number
    trend: "up" | "down" | "neutral"
  }[]
  liquidityStrength: number
  accumulationTrend: "accumulating" | "distributing" | "neutral"
  accumulationScore: number
}

// Animated flow particle component
function FlowParticle({ direction, delay }: { direction: "in" | "out"; delay: number }) {
  return (
    <div
      className={cn(
        "absolute w-1.5 h-1.5 rounded-full animate-pulse",
        direction === "in" ? "bg-[#00E5A8]" : "bg-[#FF5A7A]"
      )}
      style={{
        animationDelay: `${delay}ms`,
        left: direction === "in" ? "0%" : "100%",
        animation: `${direction === "in" ? "flowIn" : "flowOut"} 2s ease-in-out infinite ${delay}ms`
      }}
    />
  )
}

// Animated flow bar with particles
function AnimatedFlowBar({ 
  inflow, 
  outflow 
}: { 
  inflow: number
  outflow: number 
}) {
  const total = inflow + outflow
  const inflowPercent = (inflow / total) * 100
  const netFlow = inflow - outflow
  const isPositive = netFlow >= 0

  return (
    <div className="space-y-4">
      {/* Inflow Row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 w-24">
          <div className="relative">
            <ArrowUpRight className="w-5 h-5 text-[#00E5A8]" />
            <div className="absolute inset-0 bg-[#00E5A8] blur-md opacity-40 animate-pulse" />
          </div>
          <span className="text-sm text-[#64748B]">Inflow</span>
        </div>
        <div className="flex-1 relative h-8 bg-[rgba(0,229,168,0.05)] rounded-lg overflow-hidden border border-[#00E5A8]/20">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00E5A8]/40 via-[#00E5A8]/60 to-[#00E5A8]/40 rounded-lg transition-all duration-1000"
            style={{ width: `${inflowPercent}%` }}
          >
            {/* Animated glow sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-sweep" />
          </div>
          {/* Flow particles */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            {[...Array(5)].map((_, i) => (
              <FlowParticle key={i} direction="in" delay={i * 400} />
            ))}
          </div>
        </div>
        <span className="w-20 text-right font-mono font-semibold text-[#00E5A8]">
          +{(inflow / 1e9).toFixed(1)}B
        </span>
      </div>

      {/* Outflow Row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 w-24">
          <div className="relative">
            <ArrowDownRight className="w-5 h-5 text-[#FF5A7A]" />
            <div className="absolute inset-0 bg-[#FF5A7A] blur-md opacity-40 animate-pulse" />
          </div>
          <span className="text-sm text-[#64748B]">Outflow</span>
        </div>
        <div className="flex-1 relative h-8 bg-[rgba(255,90,122,0.05)] rounded-lg overflow-hidden border border-[#FF5A7A]/20">
          <div
            className="absolute right-0 top-0 h-full bg-gradient-to-l from-[#FF5A7A]/40 via-[#FF5A7A]/60 to-[#FF5A7A]/40 rounded-lg transition-all duration-1000"
            style={{ width: `${100 - inflowPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-sweep" />
          </div>
        </div>
        <span className="w-20 text-right font-mono font-semibold text-[#FF5A7A]">
          -{(outflow / 1e9).toFixed(1)}B
        </span>
      </div>

      {/* Net Flow Summary */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[rgba(255,255,255,0.02)] to-transparent border border-[rgba(255,255,255,0.06)]">
        <span className="text-sm text-[#64748B]">Net Foreign Flow</span>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            isPositive ? "bg-[#00E5A8]" : "bg-[#FF5A7A]"
          )} />
          <span className={cn(
            "text-xl font-bold font-mono",
            isPositive ? "text-[#00E5A8]" : "text-[#FF5A7A]"
          )}>
            {isPositive ? "+" : ""}{(netFlow / 1e9).toFixed(2)}B IDR
          </span>
        </div>
      </div>
    </div>
  )
}

// Glowing accumulation meter
function AccumulationMeter({ score, trend }: { score: number; trend: string }) {
  const getGlowColor = () => {
    if (trend === "accumulating") return "#00E5A8"
    if (trend === "distributing") return "#FF5A7A"
    return "#FFB547"
  }

  const glowColor = getGlowColor()
  const segments = 20
  const activeSegments = Math.round((score / 100) * segments)

  return (
    <div className="relative p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
      {/* Background glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
        style={{ backgroundColor: glowColor }}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" style={{ color: glowColor }} />
            <span className="text-sm font-medium text-white">Accumulation Trend</span>
          </div>
          <FintechBadge 
            variant={trend === "accumulating" ? "success" : trend === "distributing" ? "destructive" : "warning"}
            size="sm"
            pulse
          >
            {trend === "accumulating" ? "Accumulating" : trend === "distributing" ? "Distributing" : "Neutral"}
          </FintechBadge>
        </div>

        {/* Segmented meter */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(segments)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-3 rounded-sm transition-all duration-300",
                i < activeSegments ? "opacity-100" : "opacity-20"
              )}
              style={{
                backgroundColor: i < activeSegments ? glowColor : "#1E293B",
                boxShadow: i < activeSegments ? `0 0 8px ${glowColor}` : "none",
                transitionDelay: `${i * 30}ms`
              }}
            />
          ))}
        </div>

        {/* Score display */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-4xl font-bold font-mono" style={{ color: glowColor }}>
              {score}
            </span>
            <span className="text-lg text-[#64748B]">/100</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#475569]">Institutional Activity Score</p>
            <p className="text-sm text-[#94A3B8]">
              {score >= 70 ? "Strong institutional buying" : score >= 40 ? "Mixed activity" : "Distribution phase"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Broker orderflow visualization
function BrokerOrderflow({ 
  brokers 
}: { 
  brokers: SmartMoneyFlowProps["brokerAccumulation"]
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-[#00D4FF]" />
        <span className="text-sm font-medium text-white">Top Broker Orderflow</span>
      </div>
      
      {brokers.map((broker, index) => (
        <div 
          key={broker.name}
          className="group relative p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] hover:border-[#00D4FF]/30 transition-all duration-300"
        >
          {/* Rank indicator */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0B1220] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
            <span className="text-xs font-semibold text-[#00D4FF]">#{index + 1}</span>
          </div>

          <div className="ml-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{broker.name}</span>
                {broker.trend === "up" && (
                  <ArrowUpRight className="w-3 h-3 text-[#00E5A8]" />
                )}
                {broker.trend === "down" && (
                  <ArrowDownRight className="w-3 h-3 text-[#FF5A7A]" />
                )}
              </div>
              <span className={cn(
                "text-sm font-bold font-mono",
                broker.netValue >= 0 ? "text-[#00E5A8]" : "text-[#FF5A7A]"
              )}>
                {broker.netValue >= 0 ? "+" : ""}{(broker.netValue / 1e9).toFixed(2)}B
              </span>
            </div>

            {/* Progress bar with glow */}
            <div className="relative h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                style={{ 
                  width: `${broker.percentage}%`,
                  backgroundColor: broker.netValue >= 0 ? "#00D4FF" : "#FF5A7A",
                  boxShadow: `0 0 10px ${broker.netValue >= 0 ? "#00D4FF" : "#FF5A7A"}`
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Liquidity strength gauge
function LiquidityGauge({ strength }: { strength: number }) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (strength / 100) * circumference

  return (
    <div className="relative p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-6">
        {/* Circular gauge */}
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#liquidityGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
            {/* Glow filter */}
            <defs>
              <linearGradient id="liquidityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#00E5A8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplets className="w-5 h-5 text-[#00D4FF] mb-1" />
            <span className="text-2xl font-bold text-white font-mono">{strength}%</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white mb-1">Liquidity Strength</h4>
          <p className="text-xs text-[#64748B] mb-3">Market depth & order book analysis</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">Bid Depth</span>
              <span className="text-[#00E5A8]">Strong</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">Ask Depth</span>
              <span className="text-[#FFB547]">Moderate</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569]">Spread</span>
              <span className="text-[#00D4FF]">Tight</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SmartMoneyFlow({
  foreignInflow = 45.2e9,
  foreignOutflow = 32.8e9,
  brokerAccumulation = [
    { name: "Mirae Asset", netValue: 12.5e9, percentage: 85, trend: "up" as const },
    { name: "CGS CIMB", netValue: 8.3e9, percentage: 65, trend: "up" as const },
    { name: "Mandiri Sekuritas", netValue: 6.1e9, percentage: 48, trend: "neutral" as const },
    { name: "BNI Sekuritas", netValue: -2.2e9, percentage: 28, trend: "down" as const },
  ],
  liquidityStrength = 78,
  accumulationTrend = "accumulating",
  accumulationScore = 82
}: Partial<SmartMoneyFlowProps>) {
  return (
    <FintechCard variant="glass" padding="lg" className="relative overflow-hidden">
      {/* Ambient background effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5A8]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00D4FF]/5 rounded-full blur-3xl" />

      <FintechCardHeader className="relative mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00E5A8]/20 to-[#00D4FF]/20 flex items-center justify-center border border-[#00E5A8]/30">
                <Users className="w-6 h-6 text-[#00E5A8]" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00E5A8] rounded-full animate-pulse">
                <div className="absolute inset-0 bg-[#00E5A8] rounded-full animate-ping" />
              </div>
            </div>
            <div>
              <FintechCardTitle className="text-lg">Smart Money Flow</FintechCardTitle>
              <p className="text-sm text-[#64748B]">Institutional Orderflow Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FFB547]" />
            <span className="text-xs text-[#64748B]">Real-time</span>
          </div>
        </div>
      </FintechCardHeader>

      <div className="relative space-y-6">
        {/* Foreign Flow */}
        <AnimatedFlowBar inflow={foreignInflow} outflow={foreignOutflow} />

        {/* Accumulation Meter */}
        <AccumulationMeter score={accumulationScore} trend={accumulationTrend} />

        {/* Two column layout for broker and liquidity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BrokerOrderflow brokers={brokerAccumulation} />
          <LiquidityGauge strength={liquidityStrength} />
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes flowIn {
          0% { left: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes flowOut {
          0% { left: 100%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 0%; opacity: 0; }
        }
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-sweep {
          animation: sweep 2s ease-in-out infinite;
        }
      `}</style>
    </FintechCard>
  )
}
