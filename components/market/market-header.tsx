"use client";

/**
 * Market Header Component
 *
 * Displays the market title, image, volume, and expiry information.
 * Used at the top of the market detail page.
 */

import Image from "next/image";
import { formatPoints, formatDate } from "@/lib/formatters";
import type { Market } from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

interface MarketHeaderProps {
  market: Market;
}

// =============================================================================
// Component
// =============================================================================

export function MarketHeader({ market }: MarketHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      {market.imageUrl && (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={market.imageUrl}
            alt={market.title}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-semibold leading-tight">{market.title}</h1>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="font-medium text-foreground">
              {formatPoints(market.volume)}
            </span>
          </span>
          <span>|</span>
          <span>{formatDate(market.expiresAt)}</span>
        </div>
      </div>
    </div>
  );
}

