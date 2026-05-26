import { YahooStockCard } from "@/components/yahoo-stock-card"

export const metadata = {
  title: "Yahoo Finance - IDX Stock Data",
  description: "Fetch realtime Indonesian stock data from Yahoo Finance",
}

export default function YahooFinancePage() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Yahoo Finance Integration
          </h1>
          <p className="text-sm text-muted-foreground">
            Fetch realtime Indonesian stock data with .JK suffix support
          </p>
        </div>

        {/* Stock Card */}
        <YahooStockCard />

        {/* Info Section */}
        <div className="max-w-lg mx-auto p-4 bg-muted/30 rounded-lg border border-border">
          <h2 className="text-sm font-semibold text-foreground mb-2">
            How it works
          </h2>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              <span>Enter a ticker symbol (e.g., BBCA, MDKA, TLKM)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              <span>The .JK suffix is automatically added for IDX stocks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              <span>Data is fetched via API route from Yahoo Finance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">4.</span>
              <span>Responses are cached for 5 seconds to reduce API calls</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
