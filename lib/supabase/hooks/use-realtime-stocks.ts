"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Stock } from "@/lib/supabase/types"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface UseRealtimeStocksOptions {
  /** Enable/disable realtime subscription */
  enabled?: boolean
  /** Initial stocks data (optional, for SSR hydration) */
  initialData?: Stock[]
}

interface UseRealtimeStocksResult {
  stocks: Stock[]
  loading: boolean
  error: Error | null
  /** Manually refetch stocks */
  refetch: () => Promise<void>
  /** Connection status */
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
}

/**
 * Hook for subscribing to realtime stock updates
 * 
 * @example
 * ```tsx
 * const { stocks, loading, error, connectionStatus } = useRealtimeStocks()
 * ```
 */
export function useRealtimeStocks(
  options: UseRealtimeStocksOptions = {}
): UseRealtimeStocksResult {
  const { enabled = true, initialData = [] } = options

  const [stocks, setStocks] = useState<Stock[]>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected")

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("stocks")
        .select("*")
        .order("ticker", { ascending: true })

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setStocks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch stocks"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setConnectionStatus("disconnected")
      return
    }

    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      const supabase = createClient()

      // Initial fetch
      await fetchStocks()

      // Subscribe to realtime changes
      setConnectionStatus("connecting")

      channel = supabase
        .channel("stocks-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "stocks",
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setStocks((prev) => [...prev, payload.new as Stock])
            } else if (payload.eventType === "UPDATE") {
              setStocks((prev) =>
                prev.map((stock) =>
                  stock.id === (payload.new as Stock).id
                    ? (payload.new as Stock)
                    : stock
                )
              )
            } else if (payload.eventType === "DELETE") {
              setStocks((prev) =>
                prev.filter((stock) => stock.id !== (payload.old as Stock).id)
              )
            }
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setConnectionStatus("connected")
          } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
            setConnectionStatus("error")
          }
        })
    }

    setupRealtime()

    return () => {
      if (channel) {
        const supabase = createClient()
        supabase.removeChannel(channel)
      }
      setConnectionStatus("disconnected")
    }
  }, [enabled, fetchStocks])

  return {
    stocks,
    loading,
    error,
    refetch: fetchStocks,
    connectionStatus,
  }
}
