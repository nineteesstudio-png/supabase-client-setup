"use client"

import { useRealtimeStocks } from "@/lib/supabase/hooks/use-realtime-stocks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wifi, WifiOff, Loader2, TrendingUp } from "lucide-react"

function ConnectionStatusBadge({
  status,
}: {
  status: "connecting" | "connected" | "disconnected" | "error"
}) {
  const variants: Record<typeof status, "default" | "secondary" | "destructive" | "outline"> = {
    connecting: "secondary",
    connected: "default",
    disconnected: "outline",
    error: "destructive",
  }

  const icons: Record<typeof status, React.ReactNode> = {
    connecting: <Loader2 className="h-3 w-3 animate-spin" />,
    connected: <Wifi className="h-3 w-3" />,
    disconnected: <WifiOff className="h-3 w-3" />,
    error: <WifiOff className="h-3 w-3" />,
  }

  return (
    <Badge variant={variants[status]} className="gap-1">
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function StockRow({ ticker, price, updated_at }: {
  ticker: string | null
  price: number | null
  updated_at: string
}) {
  const formattedDate = new Date(updated_at).toLocaleString()

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-foreground">{ticker ?? "N/A"}</span>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="font-mono font-medium text-foreground">
          {price !== null ? `$${price.toFixed(2)}` : "N/A"}
        </span>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-16 bg-muted animate-pulse rounded" />
            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-5 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <TrendingUp className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">No stocks found</h3>
      <p className="text-sm text-muted-foreground max-w-[250px]">
        Add stocks to your database to see them appear here with realtime updates.
      </p>
    </div>
  )
}

export function RealtimeStockTest() {
  const { stocks, loading, error, refetch, connectionStatus } = useRealtimeStocks()

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Realtime Stocks</CardTitle>
            <CardDescription>Live stock data with Supabase realtime</CardDescription>
          </div>
          <ConnectionStatusBadge status={connectionStatus} />
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">Error loading stocks</p>
            <p className="text-xs text-destructive/80 mt-1">{error.message}</p>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : stocks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-0">
            {stocks.map((stock) => (
              <StockRow
                key={stock.id}
                ticker={stock.ticker}
                price={stock.price}
                updated_at={stock.updated_at}
              />
            ))}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4"
          onClick={refetch}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </CardContent>
    </Card>
  )
}
