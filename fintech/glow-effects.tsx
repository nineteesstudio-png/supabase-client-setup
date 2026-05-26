"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Glow Container - Adds a subtle glow effect around content
export interface GlowContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "primary" | "success" | "destructive" | "warning" | "custom"
  customColor?: string
  intensity?: "subtle" | "medium" | "strong"
  animated?: boolean
}

const GlowContainer = React.forwardRef<HTMLDivElement, GlowContainerProps>(
  ({ className, color = "primary", customColor, intensity = "subtle", animated = false, children, ...props }, ref) => {
    const colors = {
      primary: "rgba(0, 212, 255, 0.15)",
      success: "rgba(0, 229, 168, 0.15)",
      destructive: "rgba(255, 90, 122, 0.15)",
      warning: "rgba(255, 181, 71, 0.15)",
      custom: customColor || "rgba(0, 212, 255, 0.15)",
    }

    const intensities = {
      subtle: { spread: 20, blur: 40 },
      medium: { spread: 30, blur: 60 },
      strong: { spread: 40, blur: 80 },
    }

    const glowColor = colors[color]
    const { spread, blur } = intensities[intensity]

    return (
      <div
        ref={ref}
        className={cn("relative", animated && "animate-pulse", className)}
        style={{
          boxShadow: `0 0 ${spread}px ${glowColor}, 0 0 ${blur}px ${glowColor}`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GlowContainer.displayName = "GlowContainer"

// Glow Border - Adds an animated gradient border
export interface GlowBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: "primary" | "success" | "rainbow"
  animated?: boolean
  borderRadius?: string
}

const GlowBorder = React.forwardRef<HTMLDivElement, GlowBorderProps>(
  ({ className, gradient = "primary", animated = true, borderRadius = "0.75rem", children, ...props }, ref) => {
    const gradients = {
      primary: "linear-gradient(135deg, #00D4FF, #00E5A8, #00D4FF)",
      success: "linear-gradient(135deg, #00E5A8, #00D4FF, #00E5A8)",
      rainbow: "linear-gradient(135deg, #00D4FF, #A78BFA, #FF5A7A, #FFB547, #00E5A8, #00D4FF)",
    }

    return (
      <div
        ref={ref}
        className={cn("relative p-[1px] overflow-hidden", className)}
        style={{ borderRadius }}
        {...props}
      >
        <div
          className={cn(
            "absolute inset-0 opacity-50",
            animated && "animate-spin"
          )}
          style={{
            background: gradients[gradient],
            backgroundSize: "200% 200%",
            animation: animated ? "gradient-rotate 3s linear infinite" : undefined,
          }}
        />
        <div
          className="relative bg-[#0B1220] h-full"
          style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
        >
          {children}
        </div>
        <style jsx>{`
          @keyframes gradient-rotate {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      </div>
    )
  }
)
GlowBorder.displayName = "GlowBorder"

// Glow Text - Adds a glow effect to text
export interface GlowTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "primary" | "success" | "destructive" | "warning"
  intensity?: "subtle" | "medium" | "strong"
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const GlowText = React.forwardRef<HTMLSpanElement, GlowTextProps>(
  ({ className, color = "primary", intensity = "subtle", as: Component = "span", children, ...props }, ref) => {
    const colors = {
      primary: "#00D4FF",
      success: "#00E5A8",
      destructive: "#FF5A7A",
      warning: "#FFB547",
    }

    const intensities = {
      subtle: { blur1: 10, blur2: 20 },
      medium: { blur1: 15, blur2: 30 },
      strong: { blur1: 20, blur2: 40 },
    }

    const glowColor = colors[color]
    const { blur1, blur2 } = intensities[intensity]

    return (
      <Component
        ref={ref}
        className={className}
        style={{
          color: glowColor,
          textShadow: `0 0 ${blur1}px ${glowColor}80, 0 0 ${blur2}px ${glowColor}40`,
        }}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
GlowText.displayName = "GlowText"

// Ambient Glow Background - Adds subtle ambient glow spots
export interface AmbientGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  colors?: string[]
  opacity?: number
}

const AmbientGlow = React.forwardRef<HTMLDivElement, AmbientGlowProps>(
  (
    {
      className,
      colors = ["rgba(0, 212, 255, 0.1)", "rgba(0, 229, 168, 0.1)"],
      opacity = 1,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
        style={{ opacity }}
        {...props}
      >
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] -top-64 -left-64"
          style={{ background: colors[0] }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] top-1/2 right-0 translate-x-1/2"
          style={{ background: colors[1] || colors[0] }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-[80px] bottom-0 left-1/3"
          style={{ background: colors[0] }}
        />
      </div>
    )
  }
)
AmbientGlow.displayName = "AmbientGlow"

export { GlowContainer, GlowBorder, GlowText, AmbientGlow }
