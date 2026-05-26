/**
 * Supabase Database Types
 * 
 * This file contains TypeScript types for your Supabase database schema.
 * Update this file when you add or modify tables in your database.
 */

export interface Stock {
  id: number
  ticker: string | null
  price: number | null
  updated_at: string
}

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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
