"use client";

/**
 * Market Skeleton Components
 *
 * Loading skeleton states for market-related components.
 * Provides visual feedback while data is being fetched.
 */

import { Skeleton } from "@/components/ui/skeleton";

// =============================================================================
// Market Detail Page Skeleton
// =============================================================================

/**
 * Full-page skeleton for the market detail view.
 * Shows placeholders for header, chart, and sidebar.
 */
export function MarketDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Skeleton className="mb-4 h-6 w-32" />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Skeleton className="h-[500px] w-full rounded-lg" />
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    </div>
  );
}

