import type { Stock } from "@/lib/supabase/types"

/**
 * Stock query utilities for Supabase
 * These functions demonstrate common query patterns.
 */

type SupabaseClient = ReturnType<typeof import("@supabase/ssr").createBrowserClient>

export interface StockQueryResult {
  data: Stock[] | null
  error: Error | null
  loading: boolean
}

/**
 * Fetches all stocks from the database
 */
export async function fetchAllStocks(
  supabase: SupabaseClient
): Promise<{ data: Stock[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .order("ticker", { ascending: true })

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
 * Fetches a single stock by ticker
 */
export async function fetchStockByTicker(
  supabase: SupabaseClient,
  ticker: string
): Promise<{ data: Stock | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .eq("ticker", ticker.toUpperCase())
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
 * Fetches stocks with pagination
 */
export async function fetchStocksPaginated(
  supabase: SupabaseClient,
  page: number = 1,
  pageSize: number = 10
): Promise<{
  data: Stock[] | null
  error: Error | null
  count: number | null
}> {
  try {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
      .from("stocks")
      .select("*", { count: "exact" })
      .order("ticker", { ascending: true })
      .range(from, to)

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
 * Fetches stocks ordered by price (highest first)
 */
export async function fetchStocksByPrice(
  supabase: SupabaseClient,
  limit: number = 10,
  ascending: boolean = false
): Promise<{ data: Stock[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .order("price", { ascending })
      .limit(limit)

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
 * Search stocks by ticker
 */
export async function searchStocks(
  supabase: SupabaseClient,
  query: string
): Promise<{ data: Stock[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .ilike("ticker", `%${query}%`)
      .order("ticker", { ascending: true })
      .limit(20)

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
