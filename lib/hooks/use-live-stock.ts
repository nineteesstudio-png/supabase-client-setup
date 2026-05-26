import * as React from "react"

// TODO: Implement actual live stock data fetching
export function useLiveStock(ticker: string) {
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    // Stub implementation
    setLoading(false)
    setData({
      ticker,
      price: 0,
      change: 0,
      changePercent: 0,
    })
  }, [ticker])

  return { data, loading, error, refetch: () => {} }
}
