import type { AISignal, SignalType, SignalStrength, StrategyType } from "@/lib/supabase/types"

/**
 * AI Signal query utilities for Supabase
 */

type SupabaseClient = ReturnType<typeof import("@supabase/ssr").createBrowserClient>

/**
 * Fetches all active signals for a user
 */
export async function fetchActiveSignals(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: AISignal[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("ai_signals")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error occurred"),
    }
  }
}

/**
 * Fetches signals for a specific ticker
 */
export async function fetchSignalsByTicker(
  supabase: SupabaseClient,
  userId: string,
  ticker: string
): Promise<{ data: AISignal[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("ai_signals")
      .select("*")
      .eq("user_id", userId)
      .eq("ticker", ticker.toUpperCase())
      .order("created_at", { ascending: false })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error occurred"),
    }
  }
}

/**
 * Creates a new AI signal
 */
export async function createSignal(
  supabase: SupabaseClient,
  signal: {
    user_id: string
    ticker: string
    ticker_full?: string
    signal_type: SignalType
    signal_strength: SignalStrength
    confidence_score: number
    entry_price?: number
    target_price?: number
    stop_loss?: number
    risk_reward_ratio?: number
    time_horizon?: string
    strategy_type?: StrategyType
    strategy_name?: string
    reasoning_bullish?: string[]
    reasoning_bearish?: string[]
    market_state?: string
    volume?: number
    ai_dimensions?: Record<string, any>
    source_data?: Record<string, any>
    expiry_date?: string
    notes?: string
  }
): Promise<{ data: AISignal | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("ai_signals")
      .insert(signal)
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error occurred"),
    }
  }
}

/**
 * Updates an existing signal
 */
export async function updateSignal(
  supabase: SupabaseClient,
  signalId: string,
  updates: Partial<AISignal>
): Promise<{ data: AISignal | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("ai_signals")
      .update(updates)
      .eq("id", signalId)
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error occurred"),
    }
  }
}

/**
 * Closes a signal with performance data
 */
export async function closeSignal(
  supabase: SupabaseClient,
  signalId: string,
  closeData: {
    actual_entry_price?: number
    actual_exit_price?: number
    actual_return_pct?: number
    notes?: string
  }
): Promise<{ data: AISignal | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("ai_signals")
      .update({
        is_active: false,
        signal_status: closeData.actual_return_pct && closeData.actual_return_pct > 0 ? 'hit_target' : closeData.actual_return_pct && closeData.actual_return_pct < 0 ? 'stopped_out' : 'expired',
        closed_at: new Date().toISOString(),
        ...closeData,
      })
      .eq("id", signalId)
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error occurred"),
    }
  }
}

/**
 * Fetches signal performance statistics
 */
export async function fetchSignalStats(
  supabase: SupabaseClient,
  userId?: string,
  ticker?: string,
  days: number = 30
): Promise<{ data: any | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.rpc('get_signal_performance_stats', {
      p_user_id: userId || null,
      p_ticker: ticker || null,
      p_days: days
    })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error occurred"),
    }
  }
}

/**
 * Fetches recent signals with pagination
 */
export async function fetchSignalsPaginated(
  supabase: SupabaseClient,
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  activeOnly: boolean = false
): Promise<{
  data: AISignal[] | null
  error: Error | null
  count: number | null
}> {
  try {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from("ai_signals")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to)

    if (activeOnly) {
      query = query.eq("is_active", true)
    }

    const { data, error, count } = await query

    if (error) {
      return { data: null, error: new Error(error.message), count: null }
    }

    return { data, error: null, count }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error occurred"),
      count: null,
    }
  }
}

/**
 * Deletes a signal
 */
export async function deleteSignal(
  supabase: SupabaseClient,
  signalId: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from("ai_signals")
      .delete()
      .eq("id", signalId)

    if (error) {
      return { error: new Error(error.message) }
    }

    return { error: null }
  } catch (err) {
    return {
      error: err instanceof Error ? err : new Error("Unknown error occurred"),
    }
  }
}
