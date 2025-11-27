"use client";

/**
 * Outcome Legend Component
 *
 * Displays a horizontal legend of market outcomes with color indicators
 * and current prices. Used above the price chart.
 */

import { getOutcomeColor } from "@/lib/outcome-colors";
import { formatPricePercent } from "@/lib/formatters";
import type { Outcome } from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

interface OutcomeLegendProps {
  outcomes: Outcome[];
}

// =============================================================================
// Component
// =============================================================================

export function OutcomeLegend({ outcomes }: OutcomeLegendProps) {
  // Sort outcomes by price (highest first)
  const sortedOutcomes = [...outcomes].sort((a, b) => b.price - a.price);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      {sortedOutcomes.map((outcome) => {
        const originalIndex = outcomes.findIndex((o) => o.id === outcome.id);
        const color = getOutcomeColor(outcome.title, originalIndex);

        return (
          <div key={outcome.id} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span>{outcome.title}</span>
            <span className="font-medium">{formatPricePercent(outcome.price)}</span>
          </div>
        );
      })}
    </div>
  );
}

