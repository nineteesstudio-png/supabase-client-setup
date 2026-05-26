"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Search,
  TrendingUp,
  PieChart,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wallet,
  History,
  Star,
} from "lucide-react"

interface SidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string
  active?: boolean
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", active: true },
  { icon: Search, label: "Screener", href: "/screener" },
  { icon: TrendingUp, label: "Watchlist", href: "/watchlist", badge: "12" },
  { icon: PieChart, label: "Portfolio", href: "/portfolio" },
  { icon: BarChart3, label: "Analysis", href: "/analysis" },
  { icon: Sparkles, label: "AI Signals", href: "/signals", badge: "New" },
]

const secondaryNavItems: NavItem[] = [
  { icon: Wallet, label: "Broker", href: "/broker" },
  { icon: History, label: "History", href: "/history" },
  { icon: Star, label: "Favorites", href: "/favorites" },
]

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-[#0B1220] border-r border-[rgba(255,255,255,0.06)] transition-all duration-300 flex flex-col",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#00E5A8] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#050816]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight">QuantumAI</span>
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider">Terminal</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="mb-4">
          {!collapsed && (
            <span className="px-3 text-[10px] font-medium text-[#475569] uppercase tracking-wider">
              Main
            </span>
          )}
          <div className="mt-2 space-y-1">
            {mainNavItems.map((item) => (
              <NavButton key={item.label} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
          {!collapsed && (
            <span className="px-3 text-[10px] font-medium text-[#475569] uppercase tracking-wider">
              Tools
            </span>
          )}
          <div className="mt-2 space-y-1">
            {secondaryNavItems.map((item) => (
              <NavButton key={item.label} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.06)] space-y-1">
        <NavButton item={{ icon: Bell, label: "Alerts", href: "/alerts", badge: "3" }} collapsed={collapsed} />
        <NavButton item={{ icon: Settings, label: "Settings", href: "/settings" }} collapsed={collapsed} />
        <NavButton item={{ icon: HelpCircle, label: "Help", href: "/help" }} collapsed={collapsed} />
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapsedChange?.(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0B1220] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#64748B] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-all"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  )
}

function NavButton({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon

  return (
    <a
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
        item.active
          ? "bg-[rgba(0,212,255,0.1)] text-[#00D4FF]"
          : "text-[#64748B] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0", item.active && "text-[#00D4FF]")} />
      {!collapsed && (
        <>
          <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                "px-1.5 py-0.5 text-[10px] font-semibold rounded",
                item.badge === "New"
                  ? "bg-[#00E5A8]/20 text-[#00E5A8]"
                  : "bg-[rgba(255,255,255,0.1)] text-[#94A3B8]"
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </a>
  )
}
