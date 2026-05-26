# AI Trading Signals Database Schema

## Overview

This database schema is designed to store AI-generated trading signals with comprehensive metadata and performance tracking capabilities. The system supports multi-tenant usage where authenticated users can create, manage, and analyze their own signals.

## Database Structure

### Enum Types

The schema uses PostgreSQL enum types for data integrity:

- **signal_type_enum**: `bullish`, `bearish`, `neutral`
- **signal_strength_enum**: `strong`, `moderate`, `weak`
- **signal_status_enum**: `active`, `hit_target`, `stopped_out`, `expired`, `cancelled`
- **strategy_type_enum**: `swing`, `position`, `momentum`, `value`, `scalp`, `hold`

### Main Table: `ai_signals`

#### Core Signal Information
- `id` (uuid) - Unique identifier
- `user_id` (uuid) - Reference to auth.users, with CASCADE delete
- `ticker` (text) - Stock ticker symbol (without .JK suffix)
- `ticker_full` (text) - Full ticker with exchange suffix
- `signal_type` (enum) - Type of signal
- `signal_strength` (enum) - Signal strength level
- `confidence_score` (integer) - AI confidence percentage (0-100, with check constraint)

#### Price Levels
- `entry_price` (numeric) - Recommended entry price
- `target_price` (numeric) - Target price for profit taking
- `stop_loss` (numeric) - Stop loss price for risk management
- `risk_reward_ratio` (numeric) - Calculated risk/reward ratio

#### Strategy Information
- `time_horizon` (text) - Expected holding period
- `strategy_type` (enum) - Type of trading strategy
- `strategy_name` (text) - Human-readable strategy name

#### Analysis Data (JSONB)
- `reasoning_bullish` (jsonb) - Array of bullish factors
- `reasoning_bearish` (jsonb) - Array of bearish/risk factors
- `ai_dimensions` (jsonb) - Multi-factor analysis scores
- `source_data` (jsonb) - Raw data used to generate signal

#### Market Context
- `market_state` (text) - Market state at signal generation
- `volume` (bigint) - Trading volume at signal time

#### Signal Lifecycle
- `is_active` (boolean) - Whether signal is still active
- `signal_status` (enum) - Current status
- `expiry_date` (timestamptz) - When signal expires

#### Performance Tracking
- `actual_entry_price` (numeric) - Actual entry price
- `actual_exit_price` (numeric) - Actual exit price
- `actual_return_pct` (numeric) - Actual return percentage

#### Metadata
- `notes` (text) - Additional notes
- `created_at` (timestamptz) - Signal generation timestamp
- `updated_at` (timestamptz) - Last update timestamp
- `closed_at` (timestamptz) - When signal was closed

## Indexes

Performance-optimized indexes:
- `idx_ai_signals_ticker` - Fast lookups by ticker
- `idx_ai_signals_user_id` - User-based queries
- `idx_ai_signals_signal_type` - Filter by signal type
- `idx_ai_signals_is_active` - Active signal queries
- `idx_ai_signals_created_at` - Chronological ordering
- `idx_ai_signals_signal_status` - Status-based filtering
- `idx_ai_signals_ticker_created` - Stock signal history
- `idx_ai_signals_user_active` - User's active signals

## Views

### `active_signals_view`

A pre-filtered view showing only active signals with calculated fields:
- `is_expired` - Computed boolean showing if signal has expired
- `potential_return_pct` - Calculated potential return percentage

**Security**: Uses SECURITY INVOKER (default) - respects RLS policies, users only see their own signals.

## Functions

### `get_signal_performance_stats()`

Calculates comprehensive performance metrics:
- Total signals count
- Active signals count
- Win/loss statistics (hit_target, stopped_out, expired counts)
- Average confidence score
- Average return percentage
- Win rate calculation
- Signal type distribution

Parameters:
- `p_ticker` (optional) - Filter by ticker
- `p_days` (default: 30) - Time period in days

**Security**:
- Uses SECURITY INVOKER - runs with caller's privileges
- Enforces RLS - users can only query their own data
- Only accessible to authenticated users
- Immutable search_path prevents SQL injection

### `close_expired_signals()`

Automatically closes expired signals:
- Updates `is_active` to false
- Sets `signal_status` to 'expired'
- Records `closed_at` timestamp

**Security**:
- Uses SECURITY DEFINER for elevated privileges (needed to update any expired signal)
- Immutable search_path prevents SQL injection
- Only accessible by database owner/service_role
- Not publicly executable (used by scheduled jobs only)

### `update_updated_at_column()`

Trigger function to automatically update the `updated_at` timestamp on any row modification.

## Security (Row Level Security)

### RLS Policies

All policies ensure users can only access their own data:

1. **SELECT**: Users can view their own signals
2. **INSERT**: Users can insert their own signals
3. **UPDATE**: Users can update their own signals
4. **DELETE**: Users can delete their own signals

All policies use `auth.uid()` to verify ownership.

## TypeScript Integration

### Type Definitions

Located in `lib/supabase/types.ts`:
- `AISignal` - Full signal interface
- `ActiveSignalView` - View interface
- `SignalPerformanceStats` - Performance stats interface
- Enum types: `SignalType`, `SignalStrength`, `SignalStatus`, `StrategyType`

### Query Utilities

Located in `lib/supabase/queries/ai-signals.ts`:

1. `fetchActiveSignals()` - Get all active signals for a user
2. `fetchSignalsByTicker()` - Get signals for a specific stock
3. `createSignal()` - Create a new signal
4. `updateSignal()` - Update an existing signal
5. `closeSignal()` - Close a signal with performance data
6. `fetchSignalStats()` - Get performance statistics
7. `fetchSignalsPaginated()` - Paginated signal query
8. `deleteSignal()` - Delete a signal

## Usage Examples

### Creating a Signal

```typescript
import { createSignal } from "@/lib/supabase/queries/ai-signals"

const { data, error } = await createSignal(supabase, {
  user_id: userId,
  ticker: "BBCA",
  ticker_full: "BBCA.JK",
  signal_type: "bullish",
  signal_strength: "strong",
  confidence_score: 87,
  entry_price: 9875,
  target_price: 10500,
  stop_loss: 9350,
  risk_reward_ratio: 1.2,
  strategy_type: "swing",
  strategy_name: "Swing Accumulation",
  reasoning_bullish: [
    "Strong fundamental metrics",
    "Positive momentum confirmed"
  ],
  reasoning_bearish: [
    "Market volatility risk"
  ],
  time_horizon: "2-4 weeks"
})
```

### Fetching Active Signals

```typescript
import { fetchActiveSignals } from "@/lib/supabase/queries/ai-signals"

const { data: signals, error } = await fetchActiveSignals(supabase, userId)
```

### Getting Performance Stats

```typescript
import { fetchSignalStats } from "@/lib/supabase/queries/ai-signals"

// Get stats for last 30 days (automatically uses current user's data)
const { data: stats, error } = await fetchSignalStats(supabase, null, 30)

// Get stats for specific ticker
const { data: stats, error } = await fetchSignalStats(supabase, "BBCA", 60)
```

### Closing a Signal

```typescript
import { closeSignal } from "@/lib/supabase/queries/ai-signals"

const { data, error } = await closeSignal(supabase, signalId, {
  actual_entry_price: 9900,
  actual_exit_price: 10350,
  actual_return_pct: 4.55,
  notes: "Target hit ahead of schedule"
})
```

## Benefits

1. **Performance Tracking**: Comprehensive field for tracking actual vs. predicted performance
2. **Multi-tenant**: User-based ownership with RLS for security
3. **Flexibility**: JSONB fields allow flexible storage of analysis data
4. **Analytics**: Built-in functions for performance statistics
5. **Type Safety**: Full TypeScript integration with auto-generated types
6. **Automation**: Automatic expiry handling and timestamp updates
7. **Query Optimization**: Multiple indexes for various query patterns

## Security Considerations

- **Row Level Security (RLS)**: Complete data isolation between users - enforced on all tables and views
- **SECURITY INVOKER Functions**: `get_signal_performance_stats()` runs with caller's privileges, respecting RLS
- **Immutable Search Paths**: All functions use `SET search_path = ''` to prevent SQL injection via search path manipulation
- **No Public Access**: `close_expired_signals()` is restricted to database owner/service_role only
- **Foreign Key Constraints**: Maintain referential integrity with CASCADE rules
- **Check Constraints**: Ensure data validity (e.g., confidence 0-100, valid enums)
- **Enum Types**: Prevent invalid values and ensure type safety
- **Cascading Deletes**: Keep data consistent when users are deleted
- **Function-Level Authorization**: Users can only access their own statistics, enforced in function logic
