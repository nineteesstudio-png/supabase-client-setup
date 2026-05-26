/*
  # Fix Security Issues in AI Signals Schema

  1. Security Fixes
    - Replace SECURITY DEFINER view with regular view (security invoker is default)
    - Set immutable search_path for all functions
    - Revoke EXECUTE permissions from anon and authenticated roles for internal functions
    - Change get_signal_performance_stats to SECURITY INVOKER with explicit search_path
  
  2. Functions Modified
    - `update_updated_at_column` - Add search_path setting
    - `close_expired_signals` - Add search_path setting and revoke public access
    - `get_signal_performance_stats` - Change to SECURITY INVOKER, add search_path, keep authenticated access
  
  3. View Modified
    - `active_signals_view` - Recreate as regular view (security invoker is default)
  
  4. Important Security Notes
    - SECURITY DEFINER functions run with the function owner's privileges
    - Without proper search_path, malicious users can create objects that shadow system functions
    - Views should use SECURITY INVOKER (default) to respect RLS policies
    - Internal maintenance functions should not be publicly executable
*/

-- Fix 1: Recreate view without SECURITY DEFINER (default is SECURITY INVOKER)
DROP VIEW IF EXISTS active_signals_view CASCADE;

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

-- Fix 2: Update trigger function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Fix 3: Update close_expired_signals with secure search_path and revoke public access
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- This is an internal maintenance function, should not be publicly accessible
REVOKE EXECUTE ON FUNCTION close_expired_signals() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION close_expired_signals() FROM anon;
REVOKE EXECUTE ON FUNCTION close_expired_signals() FROM authenticated;

-- Fix 4: Change get_signal_performance_stats to SECURITY INVOKER with secure search_path
-- This function should respect RLS and only allow users to query their own data
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
  -- Only allow authenticated users to call this function
  -- and they can only query their own data
  IF p_user_id IS NOT NULL AND p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied: can only query own signal statistics';
  END IF;
  
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
$$ LANGUAGE plpgsql SECURITY INVOKER
SET search_path = '';

-- Revoke access from anon (unauthenticated users should not access this)
REVOKE EXECUTE ON FUNCTION get_signal_performance_stats(uuid, text, integer) FROM anon;

-- Grant access to authenticated users (they can only see their own data via the function logic)
GRANT EXECUTE ON FUNCTION get_signal_performance_stats(uuid, text, integer) TO authenticated;

-- Re-grant permissions on view
GRANT SELECT ON active_signals_view TO authenticated;