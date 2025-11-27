"use client";

/**
 * Quote Stats Component
 *
 * Displays trading quote statistics including price change,
 * shares, average price, profit estimates, and fees.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Quote, TradeAction } from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

interface QuoteStatsProps {
  quote: Quote | null;
  action: TradeAction;
  amount: string;
  isLoading: boolean;
}

// =============================================================================
// Helper Functions
// =============================================================================

function calculateProfitMetrics(
  quote: Quote,
  action: TradeAction,
  amount: string
) {
  // Max profit: (buy) potential payout - cost - fees, (sell) USDC received - fees
  const maxProfit =
    action === "buy"
      ? quote.shares - quote.value - quote.fees.fee
      : quote.value - quote.fees.fee;

  const maxProfitPercent =
    action === "buy" && quote.value > 0
      ? (maxProfit / quote.value) * 100
      : action === "sell" && parseFloat(amount) > 0
        ? ((quote.value - quote.fees.fee) / parseFloat(amount) - 1) * 100
        : 0;

  return { maxProfit, maxProfitPercent };
}

// =============================================================================
// Component
// =============================================================================

export function QuoteStats({ quote, action, amount, isLoading }: QuoteStatsProps) {
  const { maxProfit, maxProfitPercent } = quote
    ? calculateProfitMetrics(quote, action, amount)
    : { maxProfit: 0, maxProfitPercent: 0 };

  return (
    <div className="pt-2 space-y-2 text-sm">
      {/* Price Change */}
      <div className="flex justify-between text-muted-foreground">
        <span>Price change</span>
        {isLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <span className="text-foreground tabular-nums">
            {quote
              ? `${(quote.priceBefore * 100).toFixed(1)}¢ → ${(quote.priceAfter * 100).toFixed(1)}¢`
              : "—"}
          </span>
        )}
      </div>

      {/* Shares */}
      <div className="flex justify-between text-muted-foreground">
        <span>{action === "buy" ? "Shares" : "Shares to sell"}</span>
        {isLoading ? (
          <Skeleton className="h-4 w-12" />
        ) : (
          <span className="text-foreground tabular-nums">
            {quote?.shares.toFixed(2) ?? "—"}
          </span>
        )}
      </div>

      {/* Average Price */}
      <div className="flex justify-between text-muted-foreground">
        <span>Avg. price</span>
        {isLoading ? (
          <Skeleton className="h-4 w-16" />
        ) : (
          <span className="text-foreground tabular-nums">
            {quote ? `$${quote.priceAverage.toFixed(3)}/share` : "—"}
          </span>
        )}
      </div>

      {/* Max Profit / Est. Return */}
      <div className="flex justify-between text-muted-foreground">
        <span>{action === "buy" ? "Max profit" : "Est. return"}</span>
        {isLoading ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <span
            className={cn(
              "tabular-nums",
              maxProfit > 0
                ? "text-emerald-500"
                : maxProfit < 0
                  ? "text-rose-500"
                  : "text-foreground"
            )}
          >
            {quote
              ? action === "buy"
                ? `${maxProfit >= 0 ? "+$" : "-$"}${Math.abs(maxProfit).toFixed(2)} (${maxProfitPercent >= 0 ? "+" : ""}${maxProfitPercent.toFixed(0)}%)`
                : `$${(quote.value - quote.fees.fee).toFixed(2)}`
              : "—"}
          </span>
        )}
      </div>

      {/* Max Payout / Fees */}
      <div className="flex justify-between text-muted-foreground">
        <span>{action === "buy" ? "Max payout" : "Fees"}</span>
        {isLoading ? (
          <Skeleton className="h-4 w-16" />
        ) : (
          <span className="text-foreground tabular-nums">
            {quote
              ? action === "buy"
                ? `$${quote.shares.toFixed(2)}`
                : `$${quote.fees.fee.toFixed(2)}`
              : "—"}
          </span>
        )}
      </div>
    </div>
  );
}

