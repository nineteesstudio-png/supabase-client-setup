import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/types"

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Creates a Supabase client for browser/client-side usage.
 * Uses singleton pattern to prevent multiple instances.
 */
export function createClient() {
  if (browserClient) {
    return browserClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

  return browserClient
}
