import { NextRequest, NextResponse } from "next/server"
import YahooFinance from "yahoo-finance2"

const yahooFinance = new YahooFinance()

// Simple in-memory cache
const cache = new Map<string, { data: StockResponse; timestamp: number }>()
const CACHE_TTL = 5000 // 5 seconds

interface StockResponse {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  previousClose: number
  volume: number
  marketTime: string
  marketState: string
  currency: string
  exchange: string
  isStale: boolean
  source: "yahoo-finance"
  fetchedAt: string
}

interface YahooQuoteResult {
  symbol?: string
  shortName?: string
  longName?: string
  regularMarketPrice?: number
  regularMarketChange?: number
  regularMarketChangePercent?: number
  regularMarketPreviousClose?: number
  regularMarketVolume?: number
  regularMarketTime?: Date
  marketState?: string
  currency?: string
  exchange?: string
}

function formatTicker(ticker: string): string {
  // Automatically add .JK suffix for Indonesian stocks if not present
  const upperTicker = ticker.toUpperCase()
  if (!upperTicker.includes(".")) {
    return `${upperTicker}.JK`
  }
  return upperTicker
}

function isStaleData(marketTime: Date | undefined, marketState: string | undefined): boolean {
  if (!marketTime) return true
  
  // If market is closed, data is not considered stale
  if (marketState === "CLOSED" || marketState === "PRE" || marketState === "POST") {
    return false
  }
  
  // For open markets, consider data stale if older than 15 minutes
  const now = new Date()
  const diffMs = now.getTime() - marketTime.getTime()
  const diffMinutes = diffMs / (1000 * 60)
  
  return diffMinutes > 15
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params
    const formattedTicker = formatTicker(ticker)
    
    // Check cache first
    const cached = cache.get(formattedTicker)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        ...cached.data,
        fromCache: true,
      })
    }
    
    // Fetch from Yahoo Finance
    const quote = await yahooFinance.quote(formattedTicker) as YahooQuoteResult
    
    if (!quote || !quote.regularMarketPrice) {
      return NextResponse.json(
        { error: "Stock not found", ticker: formattedTicker },
        { status: 404 }
      )
    }
    
    const marketTime = quote.regularMarketTime
    const marketState = quote.marketState || "UNKNOWN"
    
    const response: StockResponse = {
      ticker: quote.symbol || formattedTicker,
      name: quote.shortName || quote.longName || formattedTicker,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      previousClose: quote.regularMarketPreviousClose || 0,
      volume: quote.regularMarketVolume || 0,
      marketTime: marketTime?.toISOString() || new Date().toISOString(),
      marketState,
      currency: quote.currency || "IDR",
      exchange: quote.exchange || "JKT",
      isStale: isStaleData(marketTime, marketState),
      source: "yahoo-finance",
      fetchedAt: new Date().toISOString(),
    }
    
    // Update cache
    cache.set(formattedTicker, { data: response, timestamp: Date.now() })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("[Yahoo Finance API Error]", error)
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    return NextResponse.json(
      { 
        error: "Failed to fetch stock data", 
        message: errorMessage,
        source: "yahoo-finance" 
      },
      { status: 500 }
    )
  }
}
