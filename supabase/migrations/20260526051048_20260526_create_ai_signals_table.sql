/*
  # Create AI Trading Signals Table

  1. New Tables
    - `ai_signals` - Stores AI-generated trading signals with comprehensive metadata
      - `id` (uuid, primary key) - Unique identifier for each signal
      - `ticker` (text, not null) - Stock ticker symbol (without .JK suffix)
      - `ticker_full` (text) - Full ticker with exchange suffix (e.g., BBCA.JK)
      - `signal_type` (text, not null) - Signal type: 'bullish', 'bearish', 'neutral'
      - `signal_strength` (text, not null) - Signal strength: 'strong', 'moderate', 'weak'
      - `confidence_score` (integer, not null) - AI confidence percentage (0-100)
      - `entry_price` (numeric) - Recommended entry price
      - `target_price` (numeric) - Target price for the signal
      - `stop_loss` (numeric) - Stop loss price
      - `risk_reward_ratio` (numeric) - Risk/reward ratio
      - `time_horizon` (text) - Expected time frame: '1-2 weeks', '2-4 weeks', etc.
      - `strategy_type` (text) - Strategy type: 'swing', 'position', 'momentum', 'value'
      - `strategy_name` (text) - Human-readable strategy name
      - `reasoning_bullish` (jsonb) - Array of bullish reasoning factors
      - `reasoning_bearish` (jsonb) - Array of bearish/risk factors
      - `market_state` (text) - Market state when signal was generated
      - `volume` (bigint) - Trading volume at signal time
      - `ai_dimensions` (jsonb) - Multi-factor analysis dimensions
      - `source_data` (jsonb) - Raw source data used to generate signal
      - `is_active` (boolean) - Whether signal is still active
      - `signal_status` (text) - Status: 'active', 'hit_target', 'stopped_out', 'expired', 'cancelled'
      - `expiry_date` (timestamptz) - When signal expires
      - `actual_entry_price` (numeric) - Actual price when position was opened
      - `actual_exit_price` (numeric) - Actual price when position was closed
      - `actual_return_pct` (numeric) - Actual return percentage
      - `notes` (text) - Additional notes or comments
      - `created_at` (timestamptz) - Signal generation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `closed_at` (timestamptz) - When signal was closed/completed

  2. Indexes
    - Index on `ticker` for fast lookups by stock
    - Index on `signal_type` for filtering by signal type
    - Index on `is_active` for filtering active signals
    - Index on `created_at` for chronological queries
    - Composite index on `ticker` and `created_at` for stock signal history
    - Index on `signal_status` for filtering by status

  3. Security
    - Enable RLS on `ai_signals` table
    - Policy for authenticated users to read all signals
    - Policy for authenticated users to insert their own signals
    - Policy for authenticated users to update their own signals
    - Policy for authenticated users to delete their own signals

  4. Important Notes
    - Signals are tied to user ownership for multi-tenant support
    - Comprehensive metadata allows for performance tracking and analysis
    - JSON fields enable flexible storage of reasoning and analysis data
    - User ID is required for all signals to ensure proper ownership
*/

-- Create enum types for better data integrity
CREATE TYPE signal_type_enum AS ENUM ('bullish', 'bearish', 'neutral');
CREATE TYPE signal_strength_enum AS ENUM ('strong', 'moderate', 'weak');
CREATE TYPE signal_status_enum AS ENUM ('active', 'hit_target', 'stopped_out', 'expired', 'cancelled');
CREATE TYPE strategy_type_enum AS ENUM ('swing', 'position', 'momentum', 'value', 'scalp', 'hold');

-- Create ai_signals table
CREATE TABLE IF NOT EXISTS ai_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticker text NOT NULL,
  ticker_full text,
  signal_type signal_type_enum NOT NULL,
  signal_strength signal_strength_enum NOT NULL,
  confidence_score integer NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  
  -- Price levels
  entry_price numeric(15, 2),
  target_price numeric(15, 2),
  stop_loss numeric(15, 2),
  risk_reward_ratio numeric(6, 2),
  
  -- Strategy information
  time_horizon text,
  strategy_type strategy_type_enum,
  strategy_name text,
  
  -- Analysis and reasoning (stored as JSON for flexibility)
  reasoning_bullish jsonb DEFAULT '[]'::jsonb,
  reasoning_bearish jsonb DEFAULT '[]'::jsonb,
  
  -- Market context
  market_state text,
  volume bigint,
  ai_dimensions jsonb,
  source_data jsonb,
  
  -- Signal lifecycle
  is_active boolean DEFAULT true,
  signal_status signal_status_enum DEFAULT 'active',
  expiry_date timestamptz,
  
  -- Performance tracking (filled when signal is closed)
  actual_entry_price numeric(15, 2),
  actual_exit_price numeric(15, 2),
  actual_return_pct numeric(8, 4),
  
  -- Metadata
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_signals_ticker ON ai_signals(ticker);
CREATE INDEX IF NOT EXISTS idx_ai_signals_user_id ON ai_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_signals_signal_type ON ai_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_ai_signals_is_active ON ai_signals(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_signals_created_at ON ai_signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_signals_signal_status ON ai_signals(signal_status);
CREATE INDEX IF NOT EXISTS idx_ai_signals_ticker_created ON ai_signals(ticker, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_signals_user_active ON ai_signals(user_id, is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE ai_signals ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view all their own signals
CREATE POLICY "Users can view own signals"
  ON ai_signals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own signals
CREATE POLICY "Users can insert own signals"
  ON ai_signals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own signals
CREATE POLICY "Users can update own signals"
  ON ai_signals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own signals
CREATE POLICY "Users can delete own signals"
  ON ai_signals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_signals_updated_at
  BEFORE UPDATE ON ai_signals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically close expired signals
CREATE OR REPLACE FUNCTION close_expired_signals()
RETURNS void AS $$
BEGIN
  UPDATE ai_signals
  SET 
    is_active = false,
    signal_status = 'expired',
    closed_at = now()
  WHERE 
    is_active = true 
    AND expiry_date < now()
    AND signal_status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for active signals with computed fields
CREATE OR REPLACE VIEW active_signals_view AS
SELECT 
  id,
  user_id,
  ticker,
  ticker_full,
  signal_type,
  signal_strength,
  confidence_score,
  entry_price,
  target_price,
  stop_loss,
  risk_reward_ratio,
  strategy_name,
  time_horizon,
  reasoning_bullish,
  reasoning_bearish,
  created_at,
  expiry_date,
  CASE 
    WHEN expiry_date < now() THEN true
    ELSE false
  END as is_expired,
  CASE 
    WHEN entry_price IS NOT NULL AND target_price IS NOT NULL THEN
      ROUND(((target_price - entry_price) / entry_price * 100)::numeric, 2)
    ELSE NULL
  END as potential_return_pct
FROM ai_signals
WHERE is_active = true
ORDER BY created_at DESC;

-- Grant appropriate permissions
GRANT SELECT ON active_signals_view TO authenticated;

-- Create function to calculate signal performance stats
CREATE OR REPLACE FUNCTION get_signal_performance_stats(
  p_user_id uuid DEFAULT NULL,
  p_ticker text DEFAULT NULL,
  p_days integer DEFAULT 30
)
RETURNS TABLE (
  total_signals bigint,
  active_signals bigint,
  hit_target_count bigint,
  stopped_out_count bigint,
  expired_count bigint,
  avg_confidence numeric,
  avg_return_pct numeric,
  win_rate numeric,
  bullish_count bigint,
  bearish_count bigint,
  neutral_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_signals,
    COUNT(*) FILTER (WHERE is_active = true)::bigint as active_signals,
    COUNT(*) FILTER (WHERE signal_status = 'hit_target')::bigint as hit_target_count,
    COUNT(*) FILTER (WHERE signal_status = 'stopped_out')::bigint as stopped_out_count,
    COUNT(*) FILTER (WHERE signal_status = 'expired')::bigint as expired_count,
    ROUND(AVG(confidence_score)::numeric, 2) as avg_confidence,
    ROUND(AVG(actual_return_pct) FILTER (WHERE actual_return_pct IS NOT NULL)::numeric, 4) as avg_return_pct,
    ROUND(
      (COUNT(*) FILTER (WHERE actual_return_pct > 0)::numeric / 
       NULLIF(COUNT(*) FILTER (WHERE actual_return_pct IS NOT NULL), 0) * 100)::numeric, 
      2
    ) as win_rate,
    COUNT(*) FILTER (WHERE signal_type = 'bullish')::bigint as bullish_count,
    COUNT(*) FILTER (WHERE signal_type = 'bearish')::bigint as bearish_count,
    COUNT(*) FILTER (WHERE signal_type = 'neutral')::bigint as neutral_count
  FROM ai_signals
  WHERE 
    (p_user_id IS NULL OR user_id = p_user_id)
    AND (p_ticker IS NULL OR ticker = p_ticker)
    AND created_at >= now() - (p_days || ' days')::interval;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE ai_signals IS 'Stores AI-generated trading signals with comprehensive analysis and performance tracking';
COMMENT ON FUNCTION get_signal_performance_stats IS 'Calculates performance statistics for signals, optionally filtered by user, ticker, and time period';