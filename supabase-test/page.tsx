import { RealtimeStockTest } from "@/components/realtime-stock-test"
import { AmbientGlow } from "@/components/fintech"

export default function SupabaseTestPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <AmbientGlow />
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Supabase Client Test
          </h1>
          <p className="text-muted-foreground max-w-md">
            Testing the Supabase client setup with realtime stock subscriptions.
            Add stocks to your database to see them appear here.
          </p>
        </div>
        
        <RealtimeStockTest />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Connection uses <code className="text-primary font-mono text-xs">@supabase/ssr</code> with proper cookie handling
          </p>
        </div>
      </main>
    </div>
  )
}
