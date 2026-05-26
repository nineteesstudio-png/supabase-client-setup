"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Clock, Shield, Zap, ExternalLink, Star, MoveHorizontal as MoreHorizontal, Activity, Brain, Sparkles } from "lucide-react"
import { FintechCard, FintechBadge, LiveIndicator } from "@/components/fintech"
import Image from "next/image"

interface HeroSummaryProps {
  ticker: string
  companyName: string
  logoUrl?: string
  price: number
  change: number
  changePercent: number
  signal: "bullish" | "bearish" | "neutral"
  signalStrength: "strong" | "moderate" | "weak"
  confidence: number
  riskLevel: "low" | "medium" | "high"
  lastUpdate: string
  dataSources: Array<{ name: string; icon?: string }>
}

export function HeroSummary({
  ticker = "BBCA",
  companyName = "Bank Central Asia Tbk",
  logoUrl,
  price = 9875,
  change = 125,
  changePercent = 1.28,
  signal = "bullish",
  signalStrength = "strong",
  confidence = 87,
  riskLevel = "low",
  lastUpdate = "14:32:05 WIB",
  dataSources = [
    { name: "Yahoo Finance" },
    { name: "IDX" }
  ]
}: Partial<HeroSummaryProps>) {
  const isPositive = change >= 0
  const [isPulsing, setIsPulsing] = React.useState(true)

  // Simulate real-time pulse
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const signalConfig = {
    bullish: { 
      color: "#00E5A8", 
      label: "BULLISH", 
      icon: TrendingUp,
      glow: "shadow-[0_0_30px_rgba(0,229,168,0.3),0_0_60px_rgba(0,229,168,0.15)]",
      bg: "bg-[#00E5A8]/10",
      border: "border-[#00E5A8]/30"
    },
    bearish: { 
      color: "#FF5A7A", 
      label: "BEARISH", 
      icon: TrendingDown,
      glow: "shadow-[0_0_30px_rgba(255,90,122,0.3),0_0_60px_rgba(255,90,122,0.15)]",
      bg: "bg-[#FF5A7A]/10",
      border: "border-[#FF5A7A]/30"
    },
    neutral: { 
      color: "#FFB547", 
      label: "NEUTRAL", 
      icon: Activity,
      glow: "shadow-[0_0_30px_rgba(255,181,71,0.3),0_0_60px_rgba(255,181,71,0.15)]",
      bg: "bg-[#FFB547]/10",
      border: "border-[#FFB547]/30"
    },
  }

  const strengthConfig = {
    strong: { label: "Strong Signal", opacity: 1 },
    moderate: { label: "Moderate Signal", opacity: 0.8 },
    weak: { label: "Weak Signal", opacity: 0.6 },
  }

  const riskConfig = {
    low: { color: "#00E5A8", label: "Low Risk", bg: "bg-[#00E5A8]/10", border: "border-[#00E5A8]/20" },
    medium: { color: "#FFB547", label: "Medium Risk", bg: "bg-[#FFB547]/10", border: "border-[#FFB547]/20" },
    high: { color: "#FF5A7A", label: "High Risk", bg: "bg-[#FF5A7A]/10", border: "border-[#FF5A7A]/20" },
  }

  const SignalIcon = signalConfig[signal].icon

  return (
    <FintechCard variant="elevated" padding="none" className="relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/[0.03] via-transparent to-[#00E5A8]/[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D4FF]/[0.02] blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative p-8">
        {/* Top Row - Stock Identity & Actions */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-5">
            {/* Stock Logo */}
            <div className="relative">
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden",
                "bg-gradient-to-br from-[#1A2332] to-[#0F1729]",
                "border border-[rgba(255,255,255,0.08)]",
                "shadow-lg"
              )}>
                {logoUrl ? (
                  <Image 
                    src={logoUrl} 
                    alt={`${ticker} logo`} 
                    width={48} 
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-2xl font-bold bg-gradient-to-br from-[#00D4FF] to-[#00E5A8] bg-clip-text text-transparent">
                    {ticker.slice(0, 2)}
                  </span>
                )}
              </div>
              {/* Live indicator dot */}
              <div className={cn(
                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                "bg-[#0B1220] border-2 border-[#050816]"
              )}>
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full bg-[#00E5A8]",
                  isPulsing && "animate-pulse"
                )} />
              </div>
            </div>

            {/* Ticker & Company Name */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white tracking-tight">{ticker}</h1>
                <FintechBadge variant="outline" size="sm" className="text-[#64748B]">IDX</FintechBadge>
              </div>
              <p className="text-base text-[#64748B]">{companyName}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#64748B] hover:text-[#FFB547] hover:border-[#FFB547]/30 hover:bg-[#FFB547]/5 transition-all duration-200">
              <Star className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#64748B] hover:text-[#00D4FF] hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/5 transition-all duration-200">
              <ExternalLink className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#64748B] hover:text-white hover:border-[rgba(255,255,255,0.15)] transition-all duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-10">
          {/* Current Price */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#64748B] uppercase tracking-wider font-medium">Live Price</span>
              <div className={cn(
                "w-2 h-2 rounded-full bg-[#00E5A8]",
                isPulsing && "animate-pulse"
              )} />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl lg:text-6xl font-bold text-white tracking-tight font-mono">
                {price.toLocaleString("id-ID")}
              </span>
              <span className="text-xl text-[#64748B] font-medium">IDR</span>
            </div>
          </div>

          {/* Daily Change */}
          <div className={cn(
            "flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-300",
            isPositive 
              ? "bg-[#00E5A8]/[0.08] border-[#00E5A8]/20" 
              : "bg-[#FF5A7A]/[0.08] border-[#FF5A7A]/20"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isPositive ? "bg-[#00E5A8]/20" : "bg-[#FF5A7A]/20"
            )}>
              {isPositive ? (
                <TrendingUp className="w-6 h-6 text-[#00E5A8]" />
              ) : (
                <TrendingDown className="w-6 h-6 text-[#FF5A7A]" />
              )}
            </div>
            <div>
              <span className="text-xs text-[#64748B] uppercase tracking-wider font-medium block mb-1">Daily Change</span>
              <div className="flex items-baseline gap-3">
                <span className={cn(
                  "text-2xl font-bold font-mono",
                  isPositive ? "text-[#00E5A8]" : "text-[#FF5A7A]"
                )}>
                  {isPositive ? "+" : ""}{change.toLocaleString("id-ID")}
                </span>
                <span className={cn(
                  "text-lg font-semibold",
                  isPositive ? "text-[#00E5A8]" : "text-[#FF5A7A]"
                )}>
                  ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid - AI Signal, Risk, Update Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* AI Signal Card - Premium Glowing */}
          <div className={cn(
            "relative rounded-2xl p-6 border transition-all duration-500",
            signalConfig[signal].bg,
            signalConfig[signal].border,
            signalConfig[signal].glow
          )}>
            {/* Animated glow effect */}
            <div 
              className={cn(
                "absolute inset-0 rounded-2xl opacity-50 blur-xl transition-opacity duration-1000",
                signalConfig[signal].bg,
                isPulsing ? "opacity-30" : "opacity-60"
              )} 
            />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#00D4FF]" />
                  <span className="text-xs text-[#64748B] uppercase tracking-wider font-medium">AI Signal</span>
                </div>
                <Sparkles className="w-4 h-4" style={{ color: signalConfig[signal].color }} />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div 
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center",
                    signalConfig[signal].bg
                  )}
                  style={{ boxShadow: `0 0 20px ${signalConfig[signal].color}30` }}
                >
                  <SignalIcon className="w-7 h-7" style={{ color: signalConfig[signal].color }} />
                </div>
                <div>
                  <span 
                    className="text-2xl font-bold tracking-wide"
                    style={{ 
                      color: signalConfig[signal].color,
                      textShadow: `0 0 20px ${signalConfig[signal].color}50`
                    }}
                  >
                    {signalConfig[signal].label}
                  </span>
                  <p className="text-sm text-[#64748B]">{strengthConfig[signalStrength].label}</p>
                </div>
              </div>

              {/* Confidence Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#64748B]">Confidence Score</span>
                  <span 
                    className="text-sm font-bold font-mono"
                    style={{ color: signalConfig[signal].color }}
                  >
                    {confidence}%
                  </span>
                </div>
                <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${confidence}%`, 
                      backgroundColor: signalConfig[signal].color,
                      boxShadow: `0 0 10px ${signalConfig[signal].color}`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Risk Level Card */}
          <div className={cn(
            "rounded-2xl p-6 border",
            riskConfig[riskLevel].bg,
            riskConfig[riskLevel].border
          )}>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4" style={{ color: riskConfig[riskLevel].color }} />
              <span className="text-xs text-[#64748B] uppercase tracking-wider font-medium">Risk Assessment</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div 
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center",
                  riskConfig[riskLevel].bg
                )}
              >
                <Shield className="w-7 h-7" style={{ color: riskConfig[riskLevel].color }} />
              </div>
              <div>
                <span 
                  className="text-xl font-bold"
                  style={{ color: riskConfig[riskLevel].color }}
                >
                  {riskConfig[riskLevel].label}
                </span>
                <p className="text-sm text-[#64748B]">Portfolio Impact</p>
              </div>
            </div>

            {/* Risk Meter */}
            <div className="flex items-center gap-1">
              {["low", "medium", "high"].map((level, index) => (
                <div 
                  key={level}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-all duration-300",
                    index === 0 && riskLevel === "low" ? "bg-[#00E5A8]" : "",
                    index <= 1 && riskLevel === "medium" ? "bg-[#FFB547]" : "",
                    riskLevel === "high" ? "bg-[#FF5A7A]" : "",
                    !(
                      (index === 0 && riskLevel === "low") ||
                      (index <= 1 && riskLevel === "medium") ||
                      riskLevel === "high"
                    ) && "bg-[rgba(255,255,255,0.08)]"
                  )}
                  style={{
                    opacity: (
                      (index === 0 && riskLevel === "low") ||
                      (index <= 1 && riskLevel === "medium") ||
                      riskLevel === "high"
                    ) ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          </div>

          {/* Live Update & Data Sources Card */}
          <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00D4FF]" />
                <span className="text-xs text-[#64748B] uppercase tracking-wider font-medium">Data Feed</span>
              </div>
              <LiveIndicator status="live" size="sm" />
            </div>

            {/* Last Update */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#00D4FF]" />
              </div>
              <div>
                <span className="text-xs text-[#64748B] block">Last Updated</span>
                <span className="text-base font-mono text-white font-medium">{lastUpdate}</span>
              </div>
            </div>

            {/* Source Badges */}
            <div>
              <span className="text-xs text-[#64748B] uppercase tracking-wider font-medium block mb-3">Data Sources</span>
              <div className="flex flex-wrap gap-2">
                {dataSources.map((source) => (
                  <div
                    key={source.name}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg",
                      "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]",
                      "hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/5 transition-all duration-200"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isPulsing ? "bg-[#00E5A8]" : "bg-[#00E5A8]/50"
                    )} />
                    <span className="text-sm text-[#94A3B8] font-medium">{source.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FintechCard>
  )
}
