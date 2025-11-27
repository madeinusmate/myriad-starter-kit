"use client";

/**
 * Portfolio Skeleton Components
 *
 * Loading skeleton states for portfolio-related components.
 * Provides visual feedback while data is being fetched.
 */

import { Skeleton } from "@/components/ui/skeleton";

// =============================================================================
// Portfolio Page Skeleton
// =============================================================================

/**
 * Full-page skeleton for the portfolio view.
 * Shows placeholders for header, summary cards, and content area.
 */
export function PortfolioSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-6 p-6 border rounded-xl">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Summary Skeleton */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Activity Feed Skeleton
// =============================================================================

/**
 * Skeleton for the activity feed loading state.
 */
export function ActivityFeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

