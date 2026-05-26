"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, Bell, ChevronDown, Sparkles, Clock } from "lucide-react"
import { LiveIndicator } from "@/components/fintech"

interface TopBarProps {
  sidebarCollapsed?: boolean
}

const recentSearches = ["BBCA", "BBRI", "TLKM", "ASII", "BMRI"]

export function TopBar({ sidebarCollapsed }: TopBarProps) {
  const [searchFocused, setSearchFocused] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-[#050816]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] transition-all duration-300",
        sidebarCollapsed ? "left-[72px]" : "left-[240px]"
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <div
            className={cn(
              "relative flex items-center gap-3 h-10 px-4 rounded-xl border transition-all",
              searchFocused
                ? "bg-[#0B1220] border-[#00D4FF]/30 shadow-[0_0_0_3px_rgba(0,212,255,0.1)]"
                : "bg-[#0B1220]/60 border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)]"
            )}
          >
            <Search className="w-4 h-4 text-[#64748B] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search stocks, ETFs, or indices..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#475569] outline-none"
            />
            <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-[#475569] bg-[rgba(255,255,255,0.04)] rounded border border-[rgba(255,255,255,0.06)]">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </div>

          {/* Search Dropdown */}
          {searchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-[#0B1220] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-[#64748B]">
                <Clock className="w-3 h-3" />
                <span>Recent Searches</span>
              </div>
              <div className="mt-1 space-y-0.5">
                {recentSearches.map((ticker) => (
                  <button
                    key={ticker}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#00D4FF]">{ticker.slice(0, 2)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">{ticker}</span>
                      <span className="text-xs text-[#64748B] ml-2">IDX</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-6">
          {/* Live Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[rgba(255,255,255,0.06)]">
            <LiveIndicator status="live" size="sm" />
            <span className="text-xs text-[#64748B]">Market Open</span>
          </div>

          {/* AI Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span className="text-xs font-medium text-[#00D4FF]">AI Active</span>
          </div>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-lg bg-[#0B1220] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#64748B] hover:text-white hover:border-[rgba(255,255,255,0.1)] transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5A7A] text-[10px] font-semibold text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-[#0B1220] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-all">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#00E5A8] flex items-center justify-center">
              <span className="text-xs font-bold text-[#050816]">JD</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>
        </div>
      </div>
    </header>
  )
}
