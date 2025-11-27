"use client";

/**
 * Action Tabs Component
 *
 * Buy/Sell tab switcher for the trade panel.
 * Provides visual feedback for the current trade action.
 */

import { cn } from "@/lib/utils";
import type { TradeAction } from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

interface ActionTabsProps {
  action: TradeAction;
  onChange: (action: TradeAction) => void;
}

// =============================================================================
// Component
// =============================================================================

export function ActionTabs({ action, onChange }: ActionTabsProps) {
  return (
    <div className="flex border-b border-border">
      <button
        onClick={() => onChange("buy")}
        className={cn(
          "flex-1 py-3 text-sm font-medium transition-colors",
          action === "buy"
            ? "text-foreground border-b-2 border-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Buy
      </button>
      <button
        onClick={() => onChange("sell")}
        className={cn(
          "flex-1 py-3 text-sm font-medium transition-colors",
          action === "sell"
            ? "text-foreground border-b-2 border-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Sell
      </button>
    </div>
  );
}

