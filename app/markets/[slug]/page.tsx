"use client";

/**
 * Market Detail Page
 *
 * Single-page market view with:
 * - Compact header with market info
 * - Price chart with legend
 * - Integrated trade panel with outcome selection
 * - Rules and Timeline sections
 *
 * This page uses extracted components for better maintainability:
 * - MarketHeader: Title, image, and stats
 * - OutcomeLegend: Color-coded outcome list
 * - PriceChart: Interactive price history
 * - TradePanel: Trading interface
 * - MarketRules: Expandable rules section
 * - MarketTimeline: Market lifecycle timeline
 */

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useNetwork } from "@/lib/network-context";
import { marketQueryOptions } from "@/lib/queries";
import { Button } from "@/components/ui/button";

// Market components
import { PriceChart } from "@/components/market/price-chart";
import { TradePanel } from "@/components/market/trade-panel";
import { MarketHeader } from "@/components/market/market-header";
import { OutcomeLegend } from "@/components/market/outcome-legend";
import { MarketRules } from "@/components/market/market-rules";
import { MarketTimeline } from "@/components/market/market-timeline";
import { MarketDetailSkeleton } from "@/components/market/skeletons";

// =============================================================================
// Error State
// =============================================================================

interface ErrorStateProps {
  isAuthError: boolean;
}

function ErrorState({ isAuthError }: ErrorStateProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {isAuthError ? "API Key Required" : "Market not found"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isAuthError
            ? "Please set NEXT_PUBLIC_MYRIAD_API_KEY in your .env.local file. Contact Myriad to obtain an API key."
            : "The market you're looking for doesn't exist or has been removed."}
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Back to Markets</Link>
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// Page Component
// =============================================================================

export default function MarketDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { apiBaseUrl } = useNetwork();

  // UI state
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<number | null>(
    null
  );

  // Fetch market data
  const {
    data: market,
    isPending,
    error,
  } = useQuery(marketQueryOptions(apiBaseUrl, slug));

  // Initialize to the highest probability outcome
  if (market && selectedOutcomeId === null && market.outcomes.length > 0) {
    const sortedOutcomes = [...market.outcomes].sort(
      (a, b) => b.price - a.price
    );
    setSelectedOutcomeId(sortedOutcomes[0].id);
  }

  if (isPending) {
    return <MarketDetailSkeleton />;
  }

  if (error || !market) {
    const isAuthError =
      error && "statusCode" in error && error.statusCode === 401;
    return <ErrorState isAuthError={!!isAuthError} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Markets
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Column - Chart and Info */}
        <div className="space-y-6">
          {/* Market Header */}
          <MarketHeader market={market} />

          {/* Outcome Legend */}
          <OutcomeLegend outcomes={market.outcomes} />

          {/* Price Chart */}
          <div className="rounded-xl border border-border bg-card p-4">
            <PriceChart
              outcomes={market.outcomes}
              selectedOutcomeId={selectedOutcomeId ?? undefined}
            />
          </div>

          {/* Rules Section */}
          <MarketRules
            description={market.description}
            resolutionSource={market.resolutionSource ?? undefined}
          />
        </div>

        {/* Right Column - Trade Panel and Timeline */}
        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          {selectedOutcomeId !== null && (
            <TradePanel
              market={market}
              selectedOutcomeId={selectedOutcomeId}
              onOutcomeChange={setSelectedOutcomeId}
            />
          )}

          {/* Timeline Section */}
          <MarketTimeline market={market} />
        </div>
      </div>
    </div>
  );
}
