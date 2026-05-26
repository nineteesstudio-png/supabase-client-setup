/**
 * Supabase Database Types
 *
 * This file contains TypeScript types for your Supabase database schema.
 * Update this file when you add or modify tables in your database.
 */

// Enum Types
export type SignalType = 'bullish' | 'bearish' | 'neutral'
export type SignalStrength = 'strong' | 'moderate' | 'weak'
export type SignalStatus = 'active' | 'hit_target' | 'stopped_out' | 'expired' | 'cancelled'
export type StrategyType = 'swing' | 'position' | 'momentum' | 'value' | 'scalp' | 'hold'

// Stock Table
export interface Stock {
  id: number
  ticker: string | null
  price: number | null
  updated_at: string
}

// AI Signal Table
export interface AISignal {
  id: string
  user_id: string
  ticker: string
  ticker_full: string | null
  signal_type: SignalType
  signal_strength: SignalStrength
  confidence_score: number

  // Price levels
  entry_price: number | null
  target_price: number | null
  stop_loss: number | null
  risk_reward_ratio: number | null

  // Strategy information
  time_horizon: string | null
  strategy_type: StrategyType | null
  strategy_name: string | null

  // Analysis and reasoning
  reasoning_bullish: string[] | null
  reasoning_bearish: string[] | null

  // Market context
  market_state: string | null
  volume: number | null
  ai_dimensions: Record<string, any> | null
  source_data: Record<string, any> | null

  // Signal lifecycle
  is_active: boolean
  signal_status: SignalStatus
  expiry_date: string | null

  // Performance tracking
  actual_entry_price: number | null
  actual_exit_price: number | null
  actual_return_pct: number | null

  // Metadata
  notes: string | null
  created_at: string
  updated_at: string
  closed_at: string | null
}

// Active Signal View
export interface ActiveSignalView {
  id: string
  user_id: string
  ticker: string
  ticker_full: string | null
  signal_type: SignalType
  signal_strength: SignalStrength
  confidence_score: number
  entry_price: number | null
  target_price: number | null
  stop_loss: number | null
  risk_reward_ratio: number | null
  strategy_name: string | null
  time_horizon: string | null
  reasoning_bullish: string[] | null
  reasoning_bearish: string[] | null
  created_at: string
  expiry_date: string | null
  is_expired: boolean
  potential_return_pct: number | null
}

// Signal Performance Stats
export interface SignalPerformanceStats {
  total_signals: number
  active_signals: number
  hit_target_count: number
  stopped_out_count: number
  expired_count: number
  avg_confidence: number | null
  avg_return_pct: number | null
  win_rate: number | null
  bullish_count: number
  bearish_count: number
  neutral_count: number
}

// Database Schema
export interface Database {
  public: {
    Tables: {
      stocks: {
        Row: Stock
        Insert: Omit<Stock, "id" | "updated_at"> & {
          id?: number
          updated_at?: string
        }
        Update: Partial<Omit<Stock, "id">>
      }
      ai_signals: {
        Row: AISignal
        Insert: Omit<AISignal, "id" | "user_id" | "created_at" | "updated_at"> & {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<AISignal, "id" | "user_id">>
      }
    }
    Views: {
      active_signals_view: {
        Row: ActiveSignalView
      }
    }
    Functions: {
      get_signal_performance_stats: {
        Args: {
          p_user_id?: string | null
          p_ticker?: string | null
          p_days?: number
        }
        Returns: SignalPerformanceStats
      }
    }
    Enums: {
      signal_type_enum: SignalType
      signal_strength_enum: SignalStrength
      signal_status_enum: SignalStatus
      strategy_type_enum: StrategyType
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
