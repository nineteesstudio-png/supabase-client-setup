"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Brain, Sparkles, TrendingUp, TrendingDown, Info } from "lucide-react"
import { FintechCard, FintechCardHeader, FintechCardTitle, FintechBadge } from "@/components/fintech"

interface RadarDimension {
  label: string
  value: number
  maxValue: number
}

interface AIMarketEngineProps {
  dimensions: RadarDimension[]
  signal: "bullish" | "bearish" | "neutral"
  confidence: number
  reasoning: {
    bullish: string[]
    bearish: string[]
  }
}

const defaultDimensions: RadarDimension[] = [
  { label: "Value", value: 78, maxValue: 100 },
  { label: "Growth", value: 85, maxValue: 100 },
  { label: "Quality", value: 92, maxValue: 100 },
  { label: "Momentum", value: 65, maxValue: 100 },
  { label: "Risk", value: 72, maxValue: 100 },
]

function PentagonRadar({ dimensions, signal }: { dimensions: RadarDimension[]; signal: string }) {
  const size = 280
  const center = size / 2
  const maxRadius = 110
  const levels = 5

  // Calculate points for each dimension
  const angleStep = (2 * Math.PI) / dimensions.length
  const startAngle = -Math.PI / 2 // Start from top

  const getPoint = (index: number, radius: number) => {
    const angle = startAngle + index * angleStep
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  }

  // Generate level polygons
  const levelPolygons = Array.from({ length: levels }, (_, level) => {
    const radius = (maxRadius / levels) * (level + 1)
    return dimensions
      .map((_, i) => {
        const point = getPoint(i, radius)
        return `${point.x},${point.y}`
      })
      .join(" ")
  })

  // Generate data polygon
  const dataPoints = dimensions.map((dim, i) => {
    const radius = (dim.value / dim.maxValue) * maxRadius
    return getPoint(i, radius)
  })
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ")

  // Signal colors
  const signalColors = {
    bullish: { fill: "rgba(0, 229, 168, 0.2)", stroke: "#00E5A8" },
    bearish: { fill: "rgba(255, 90, 122, 0.2)", stroke: "#FF5A7A" },
    neutral: { fill: "rgba(255, 181, 71, 0.2)", stroke: "#FFB547" },
  }

  const colors = signalColors[signal as keyof typeof signalColors]

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Level polygons */}
      {levelPolygons.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const end = getPoint(i, maxRadius)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
          />
        )
      })}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth="2"
        className="transition-all duration-500"
      />

      {/* Data points */}
      {dataPoints.map((point, i) => (
        <g key={i}>
          <circle
            cx={point.x}
            cy={point.y}
            r="4"
            fill={colors.stroke}
            className="transition-all duration-500"
          />
          <circle
            cx={point.x}
            cy={point.y}
            r="8"
            fill={colors.stroke}
            opacity="0.3"
            className="transition-all duration-500"
          />
        </g>
      ))}

      {/* Labels */}
      {dimensions.map((dim, i) => {
        const labelRadius = maxRadius + 30
        const point = getPoint(i, labelRadius)
        return (
          <g key={i}>
            <text
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#94A3B8] text-xs font-medium"
            >
              {dim.label}
            </text>
            <text
              x={point.x}
              y={point.y + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-sm font-semibold"
            >
              {dim.value}
            </text>
          </g>
        )
      })}

      {/* Center score */}
      <circle cx={center} cy={center} r="32" fill="rgba(0, 212, 255, 0.1)" />
      <text
        x={center}
        y={center - 4}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-[#00D4FF] text-xl font-bold"
      >
        {Math.round(dimensions.reduce((acc, d) => acc + d.value, 0) / dimensions.length)}
      </text>
      <text
        x={center}
        y={center + 12}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-[#64748B] text-[10px] uppercase tracking-wider"
      >
        Score
      </text>
    </svg>
  )
}

export function AIMarketEngine({
  dimensions = defaultDimensions,
  signal = "bullish",
  confidence = 87,
  reasoning = {
    bullish: [
      "Strong fundamental metrics with PE ratio below sector average",
      "Positive momentum with 3-month uptrend intact",
      "Smart money accumulation detected in last 10 sessions"
    ],
    bearish: [
      "Global risk-off sentiment may impact banking sector",
      "IDR weakness could pressure near-term performance"
    ]
  }
}: Partial<AIMarketEngineProps>) {
  const signalConfig = {
    bullish: { color: "#00E5A8", label: "Bullish", icon: TrendingUp },
    bearish: { color: "#FF5A7A", label: "Bearish", icon: TrendingDown },
    neutral: { color: "#FFB547", label: "Neutral", icon: Info },
  }

  const config = signalConfig[signal]
  const SignalIcon = config.icon

  return (
    <FintechCard variant="default" padding="lg">
      <FintechCardHeader className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <FintechCardTitle>AI Market Engine</FintechCardTitle>
              <p className="text-sm text-[#64748B]">Multi-factor Analysis</p>
            </div>
          </div>
          <FintechBadge variant="accent" size="sm">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </FintechBadge>
        </div>
      </FintechCardHeader>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Pentagon Radar */}
        <div className="flex items-center justify-center">
          <PentagonRadar dimensions={dimensions} signal={signal} />
        </div>

        {/* AI Explainability Panel */}
        <div className="space-y-6">
          {/* Confidence Score */}
          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#64748B]">AI Confidence Score</span>
              <div className="flex items-center gap-2" style={{ color: config.color }}>
                <SignalIcon className="w-4 h-4" />
                <span className="font-semibold">{config.label}</span>
              </div>
            </div>
            <div className="relative h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${confidence}%`,
                  backgroundColor: config.color,
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[#475569]">0%</span>
              <span className="text-lg font-bold" style={{ color: config.color }}>
                {confidence}%
              </span>
              <span className="text-xs text-[#475569]">100%</span>
            </div>
          </div>

          {/* Bullish Factors */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#00E5A8]" />
              <span className="text-sm font-medium text-[#00E5A8]">Bullish Factors</span>
            </div>
            <ul className="space-y-2">
              {reasoning.bullish.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5A8] mt-1.5 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Bearish Factors */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-[#FF5A7A]" />
              <span className="text-sm font-medium text-[#FF5A7A]">Risk Factors</span>
            </div>
            <ul className="space-y-2">
              {reasoning.bearish.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A7A] mt-1.5 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </FintechCard>
  )
}
