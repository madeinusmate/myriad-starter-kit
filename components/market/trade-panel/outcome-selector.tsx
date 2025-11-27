"use client";

/**
 * Outcome Selector Component
 *
 * Displays a list of market outcomes for selection in the trade panel.
 * Shows outcome name, current price, and visual color indicator.
 */

import { cn } from "@/lib/utils";
import { getOutcomeColor } from "@/lib/outcome-colors";
import { formatPricePercent } from "@/lib/formatters";
import type { Outcome } from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

interface OutcomeSelectorProps {
  outcomes: Outcome[];
  selectedOutcomeId: number;
  onSelect: (outcomeId: number) => void;
}

// =============================================================================
// Component
// =============================================================================

export function OutcomeSelector({
  outcomes,
  selectedOutcomeId,
  onSelect,
}: OutcomeSelectorProps) {
  // Sort outcomes by price (highest first)
  const sortedOutcomes = [...outcomes].sort((a, b) => b.price - a.price);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Select outcome</span>
        <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
      </div>
      <div className="space-y-1">
        {sortedOutcomes.map((outcome) => {
          const originalIndex = outcomes.findIndex((o) => o.id === outcome.id);
          const isSelected = selectedOutcomeId === outcome.id;
          const color = getOutcomeColor(outcome.title, originalIndex);

          return (
            <button
              key={outcome.id}
              onClick={() => onSelect(outcome.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                isSelected ? "bg-accent" : "hover:bg-accent/50"
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span
                  className={cn(
                    "truncate max-w-[180px]",
                    isSelected && "font-medium"
                  )}
                >
                  {outcome.title}
                </span>
              </div>
              <span
                className={cn(
                  "font-medium tabular-nums",
                  isSelected && "text-foreground"
                )}
              >
                {formatPricePercent(outcome.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

