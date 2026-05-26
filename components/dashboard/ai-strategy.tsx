"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Lock, ChevronRight, TrendingUp, Target, Zap } from "lucide-react"
import { FintechCard, FintechCardHeader, FintechCardTitle, FintechBadge, FintechButton } from "@/components/fintech"

interface AIStrategyProps {
  strategyName: string
  strategyType: "swing" | "position" | "momentum" | "value"
  confidence: number
  probabilityWin: number
  expectedReturn: number
  timeHorizon: string
  isPremium?: boolean
}

export function AIStrategy({
  strategyName = "Swing Accumulation",
  strategyType = "swing",
  confidence = 85,
  probabilityWin = 72,
  expectedReturn = 15.5,
  timeHorizon = "2-4 weeks",
  isPremium = true
}: Partial<AIStrategyProps>) {
  const strategyTypeConfig = {
    swing: { color: "#00D4FF", label: "Swing Trade" },
    position: { color: "#00E5A8", label: "Position Trade" },
    momentum: { color: "#FFB547", label: "Momentum" },
    value: { color: "#A78BFA", label: "Value Play" },
  }

  const config = strategyTypeConfig[strategyType]

  return (
    <FintechCard variant="accent" padding="lg" className="relative overflow-hidden">
      {/* Premium blur overlay */}
      {isPremium && (
        <div className="absolute inset-0 z-10 backdrop-blur-[2px] bg-[#050816]/60 flex items-center justify-center">
          <div className="text-center max-w-xs px-6">
            <div className="w-14 h-14 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-[#00D4FF]" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Premium Strategy</h4>
            <p className="text-sm text-[#64748B] mb-4">
              Unlock AI-powered trading strategies with detailed entry, exit, and risk management
            </p>
            <FintechButton variant="primary" className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </FintechButton>
          </div>
        </div>
      )}

      <FintechCardHeader className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <FintechCardTitle>AI Strategy</FintechCardTitle>
              <p className="text-sm text-[#64748B]">Recommended Approach</p>
            </div>
          </div>
          <FintechBadge variant="accent" size="sm" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
            {config.label}
          </FintechBadge>
        </div>
      </FintechCardHeader>

      <div className="space-y-6">
        {/* Strategy Name */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#00D4FF]/10 to-transparent border border-[#00D4FF]/20">
          <span className="text-xs text-[#475569] uppercase tracking-wider">Active Strategy</span>
          <h3 className="text-xl font-bold text-white mt-1">{strategyName}</h3>
          <p className="text-sm text-[#64748B] mt-1">Time Horizon: {timeHorizon}</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-center">
            <Zap className="w-4 h-4 text-[#00D4FF] mx-auto mb-1" />
            <span className="text-xs text-[#475569]">AI Confidence</span>
            <p className="text-lg font-bold text-[#00D4FF] mt-0.5">{confidence}%</p>
          </div>
          <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-center">
            <Target className="w-4 h-4 text-[#00E5A8] mx-auto mb-1" />
            <span className="text-xs text-[#475569]">Win Probability</span>
            <p className="text-lg font-bold text-[#00E5A8] mt-0.5">{probabilityWin}%</p>
          </div>
          <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-center">
            <TrendingUp className="w-4 h-4 text-[#FFB547] mx-auto mb-1" />
            <span className="text-xs text-[#475569]">Expected Return</span>
            <p className="text-lg font-bold text-[#FFB547] mt-0.5">+{expectedReturn}%</p>
          </div>
        </div>

        {/* Strategy Preview (blurred for premium) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
            <span className="text-sm text-[#64748B]">Entry Trigger</span>
            <span className="text-sm text-[#94A3B8]">Price breaks above EMA20...</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
            <span className="text-sm text-[#64748B]">Exit Rules</span>
            <span className="text-sm text-[#94A3B8]">Trail stop at 2x ATR...</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
            <span className="text-sm text-[#64748B]">Risk Management</span>
            <span className="text-sm text-[#94A3B8]">Max 2% per trade...</span>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#00D4FF]/10 to-[#00E5A8]/10 border border-[#00D4FF]/20 hover:border-[#00D4FF]/40 transition-all group">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#00D4FF]" />
            <span className="text-sm font-medium text-white">View Full Strategy</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#00D4FF] group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </FintechCard>
  )
}
