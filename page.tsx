"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  TopBar,
  HeroSummary,
  AIMarketEngine,
  SmartMoneyFlow,
  PriceStructure,
  RiskEngine,
  AIStrategy,
  MarketContext,
} from "@/components/dashboard"
import { AmbientGlow } from "@/components/fintech"
import { useLiveStock } from "@/lib/hooks/use-live-stock"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RefreshCw } from "lucide-react"

// Loading skeleton for HeroSummary
function HeroSummarySkeleton() {
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-8">
      <div className="flex items-center gap-5 mb-8">
        <Skeleton className="w-20 h-20 rounded-2xl bg-[rgba(255,255,255,0.06)]" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-32 bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-4 w-48 bg-[rgba(255,255,255,0.06)]" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-16 w-64 bg-[rgba(255,255,255,0.06)]" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-xl bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-32 rounded-xl bg-[rgba(255,255,255,0.06)]" />
          <Skeleton className="h-32 rounded-xl bg-[rgba(255,255,255,0.06)]" />
        </div>
      </div>
    </div>
  )
}

// Error state component
function ErrorState({ 
  message, 
  onRetry 
}: { 
  message: string
  onRetry: () => void 
}) {
  return (
    <div className="rounded-2xl border border-[#FF5A7A]/30 bg-[#FF5A7A]/5 p-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#FF5A7A]/20 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-[#FF5A7A]" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">Failed to load stock data</h3>
          <p className="text-sm text-[#64748B]">{message}</p>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF5A7A]/10 border border-[#FF5A7A]/30 text-[#FF5A7A] hover:bg-[#FF5A7A]/20 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  )
}

// Format time to WIB
function formatTimeWIB(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta"
  }) + " WIB"
}

// Format volume
function formatVolume(volume: number): string {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
  return volume.toString()
}

// Calculate AI signal based on price movement
function calculateSignal(changePercent: number): {
  signal: "bullish" | "bearish" | "neutral"
  strength: "strong" | "moderate" | "weak"
  confidence: number
} {
  const absChange = Math.abs(changePercent)
  
  if (changePercent > 2) {
    return { signal: "bullish", strength: "strong", confidence: 85 + Math.min(absChange, 10) }
  } else if (changePercent > 0.5) {
    return { signal: "bullish", strength: "moderate", confidence: 70 + absChange * 5 }
  } else if (changePercent > 0) {
    return { signal: "bullish", strength: "weak", confidence: 55 + absChange * 10 }
  } else if (changePercent < -2) {
    return { signal: "bearish", strength: "strong", confidence: 85 + Math.min(absChange, 10) }
  } else if (changePercent < -0.5) {
    return { signal: "bearish", strength: "moderate", confidence: 70 + absChange * 5 }
  } else if (changePercent < 0) {
    return { signal: "bearish", strength: "weak", confidence: 55 + absChange * 10 }
  }
  
  return { signal: "neutral", strength: "weak", confidence: 50 }
}

// Calculate risk level based on volatility
function calculateRiskLevel(changePercent: number): "low" | "medium" | "high" {
  const absChange = Math.abs(changePercent)
  if (absChange > 5) return "high"
  if (absChange > 2) return "medium"
  return "low"
}

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [selectedTicker] = React.useState("BBCA")

  // Live stock data with 5 second refresh
  const { 
    data: stockData, 
    isLoading, 
    isRefreshing,
    error, 
    priceChange,
    lastUpdate,
    refetch 
  } = useLiveStock(selectedTicker, { refreshInterval: 5000 })

  // Derive AI analysis from live data
  const aiAnalysis = React.useMemo(() => {
    if (!stockData) return null
    return calculateSignal(stockData.changePercent)
  }, [stockData])

  const riskLevel = React.useMemo(() => {
    if (!stockData) return "low"
    return calculateRiskLevel(stockData.changePercent)
  }, [stockData])

  // Generate data sources from live data
  const dataSources = React.useMemo(() => {
    if (!stockData) return []
    const sources = [{ name: stockData.source || "Yahoo Finance" }]
    if (stockData.exchange) sources.push({ name: stockData.exchange })
    return sources
  }, [stockData])

  return (
    <div className="min-h-screen bg-[#050816] relative">
      {/* Ambient background glow */}
      <AmbientGlow />

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Top Bar */}
      <TopBar sidebarCollapsed={sidebarCollapsed} />

      {/* Main Content */}
      <main
        className={cn(
          "relative z-10 pt-16 min-h-screen transition-all duration-300",
          sidebarCollapsed ? "ml-[72px]" : "ml-[240px]"
        )}
      >
        <div className="p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Hero Summary - Full Width */}
          <section>
            {isLoading ? (
              <HeroSummarySkeleton />
            ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : stockData && aiAnalysis ? (
              <div className={cn(
                "transition-all duration-300",
                priceChange?.direction === "up" && "ring-2 ring-[#00E5A8]/50 rounded-2xl",
                priceChange?.direction === "down" && "ring-2 ring-[#FF5A7A]/50 rounded-2xl"
              )}>
                <HeroSummary
                  ticker={stockData.ticker.replace(".JK", "")}
                  companyName={stockData.name}
                  price={stockData.price}
                  change={stockData.change}
                  changePercent={stockData.changePercent}
                  signal={aiAnalysis.signal}
                  signalStrength={aiAnalysis.strength}
                  confidence={Math.round(aiAnalysis.confidence)}
                  riskLevel={riskLevel}
                  lastUpdate={lastUpdate ? formatTimeWIB(lastUpdate) : formatTimeWIB(new Date())}
                  dataSources={dataSources}
                />
              </div>
            ) : null}
          </section>

          {/* Refreshing indicator */}
          {isRefreshing && (
            <div className="fixed top-20 right-8 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30">
              <RefreshCw className="w-3 h-3 text-[#00D4FF] animate-spin" />
              <span className="text-xs text-[#00D4FF]">Updating...</span>
            </div>
          )}

          {/* AI Market Engine - Full Width */}
          <section>
            <AIMarketEngine
              dimensions={[
                { label: "Value", value: stockData ? Math.min(100, 50 + stockData.changePercent * 10) : 78, maxValue: 100 },
                { label: "Growth", value: stockData ? Math.min(100, 60 + stockData.changePercent * 8) : 85, maxValue: 100 },
                { label: "Quality", value: 92, maxValue: 100 },
                { label: "Momentum", value: stockData ? Math.min(100, Math.max(0, 50 + stockData.changePercent * 15)) : 65, maxValue: 100 },
                { label: "Risk", value: stockData ? Math.min(100, 50 + Math.abs(stockData.changePercent) * 10) : 72, maxValue: 100 },
              ]}
              signal={aiAnalysis?.signal || "neutral"}
              confidence={aiAnalysis ? Math.round(aiAnalysis.confidence) : 50}
              reasoning={{
                bullish: stockData && stockData.changePercent > 0 ? [
                  `Positive price movement of ${stockData.changePercent.toFixed(2)}%`,
                  `Trading above previous close of ${stockData.previousClose.toLocaleString("id-ID")} IDR`,
                  `Volume at ${formatVolume(stockData.volume)} shares`,
                  stockData.marketState === "REGULAR" ? "Market is currently open" : "After hours trading"
                ] : [
                  "Monitor for reversal signals",
                  "Wait for positive momentum confirmation"
                ],
                bearish: stockData && stockData.changePercent < 0 ? [
                  `Negative price movement of ${stockData.changePercent.toFixed(2)}%`,
                  `Trading below previous close of ${stockData.previousClose.toLocaleString("id-ID")} IDR`
                ] : [
                  "No significant bearish signals detected"
                ],
              }}
            />
          </section>

          {/* Three Column Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Smart Money Flow */}
            <SmartMoneyFlow
              foreignInflow={stockData ? stockData.volume * stockData.price * 0.3 : 45.2e9}
              foreignOutflow={stockData ? stockData.volume * stockData.price * 0.2 : 32.8e9}
              brokerAccumulation={[
                { name: "Mirae Asset", netValue: 12.5e9, percentage: 28 },
                { name: "CGS CIMB", netValue: 8.3e9, percentage: 18 },
                { name: "Mandiri Sekuritas", netValue: 6.1e9, percentage: 14 },
                { name: "BNI Sekuritas", netValue: 4.2e9, percentage: 9 },
              ]}
              liquidityStrength={stockData ? Math.min(100, Math.round(stockData.volume / 1e6)) : 78}
              accumulationTrend={stockData?.changePercent && stockData.changePercent > 0 ? "accumulating" : "distributing"}
            />

            {/* Price Structure */}
            <PriceStructure
              currentPrice={stockData?.price || 9875}
              ema20={stockData ? stockData.price * 0.98 : 9650}
              ema50={stockData ? stockData.price * 0.95 : 9420}
              atr={stockData ? Math.round(stockData.price * 0.02) : 185}
              atrPercent={1.87}
              support={stockData ? Math.round(stockData.price * 0.95) : 9400}
              resistance={stockData ? Math.round(stockData.price * 1.05) : 10200}
              entryZone={{ 
                low: stockData ? Math.round(stockData.price * 0.98) : 9700, 
                high: stockData ? Math.round(stockData.price * 1.01) : 9900 
              }}
              stopLoss={stockData ? Math.round(stockData.price * 0.94) : 9350}
              targetPrice={stockData ? Math.round(stockData.price * 1.08) : 10500}
            />

            {/* Risk Engine */}
            <RiskEngine
              portfolioValue={500000000}
              riskPerTrade={2}
              positionSize={stockData ? Math.round(10000000 / stockData.price) : 1000}
              positionValue={stockData ? stockData.price * Math.round(10000000 / stockData.price) : 9875000}
              riskRewardRatio={2.5}
              volatilityClass={riskLevel === "high" ? "high" : riskLevel === "medium" ? "medium" : "low"}
              maxDrawdown={5.2}
            />
          </section>

          {/* Two Column Grid */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* AI Strategy */}
            <AIStrategy
              strategyName={aiAnalysis?.signal === "bullish" ? "Swing Accumulation" : aiAnalysis?.signal === "bearish" ? "Defensive Position" : "Wait & Watch"}
              strategyType={aiAnalysis?.signal === "bullish" ? "swing" : aiAnalysis?.signal === "bearish" ? "scalp" : "position"}
              confidence={aiAnalysis ? Math.round(aiAnalysis.confidence) : 50}
              probabilityWin={stockData ? Math.round(50 + stockData.changePercent * 5) : 72}
              expectedReturn={stockData ? Math.round(stockData.changePercent * 3 + 10) : 15.5}
              timeHorizon={aiAnalysis?.strength === "strong" ? "1-2 weeks" : "2-4 weeks"}
              isPremium={true}
            />

            {/* Market Context */}
            <MarketContext
              ihsg={{ 
                name: "IHSG", 
                value: "7,234.56", 
                change: 0.85, 
                trend: "up" 
              }}
              sectorRotation={[
                { 
                  sector: "Banking", 
                  momentum: stockData?.changePercent && stockData.changePercent > 1 ? "strong" : stockData?.changePercent && stockData.changePercent > 0 ? "moderate" : "weak", 
                  flow: stockData?.changePercent && stockData.changePercent > 0 ? "inflow" : "outflow" 
                },
                { sector: "Consumer", momentum: "moderate", flow: "neutral" },
                { sector: "Mining", momentum: "weak", flow: "outflow" },
                { sector: "Infrastructure", momentum: "moderate", flow: "inflow" },
              ]}
              commoditySentiment={[
                { name: "Coal", value: "$145.20", change: 2.3, trend: "up" },
                { name: "CPO", value: "MYR 3,850", change: -1.2, trend: "down" },
              ]}
              usdIdr={{ name: "USD/IDR", value: "15,425", change: -0.15, trend: "down" }}
            />
          </section>

          {/* Live Data Footer */}
          {stockData && (
            <section className="flex items-center justify-center gap-4 text-xs text-[#475569] py-4">
              <span>Data from {stockData.source}</span>
              <span className="w-1 h-1 rounded-full bg-[#475569]" />
              <span>Market: {stockData.marketState}</span>
              <span className="w-1 h-1 rounded-full bg-[#475569]" />
              <span>Volume: {formatVolume(stockData.volume)}</span>
              <span className="w-1 h-1 rounded-full bg-[#475569]" />
              <span>Previous Close: {stockData.previousClose.toLocaleString("id-ID")} {stockData.currency}</span>
            </section>
          )}

          {/* Footer Spacing */}
          <div className="h-8" />
        </div>
      </main>
    </div>
  )
}
