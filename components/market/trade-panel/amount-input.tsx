"use client";

/**
 * Amount Input Component
 *
 * Trading amount input field with percentage shortcuts.
 * Shows available balance and allows quick percentage selections.
 */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";

// =============================================================================
// Types
// =============================================================================

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  availableBalance: number;
  isConnected: boolean;
  isDisabled: boolean;
}

// =============================================================================
// Constants
// =============================================================================

const PERCENTAGE_OPTIONS = [25, 50, 100] as const;

// =============================================================================
// Component
// =============================================================================

export function AmountInput({
  value,
  onChange,
  availableBalance,
  isConnected,
  isDisabled,
}: AmountInputProps) {
  const handlePercentageClick = (percent: number) => {
    const calculatedValue = availableBalance * (percent / 100);
    if (calculatedValue > 0) {
      onChange(calculatedValue.toFixed(2));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-muted-foreground">Amount</label>
        {isConnected && (
          <span className="text-sm text-muted-foreground">
            Available{" "}
            <span className="text-foreground font-medium">
              {formatCurrency(availableBalance)}
            </span>
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            type="number"
            placeholder="0.00"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            min="0"
            step="0.01"
            className="bg-background pl-7 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="flex gap-1">
          {PERCENTAGE_OPTIONS.map((percent) => (
            <Button
              key={percent}
              type="button"
              variant="outline"
              size="sm"
              className="px-2 h-9 text-xs"
              onClick={() => handlePercentageClick(percent)}
              disabled={isDisabled || !isConnected || availableBalance <= 0}
            >
              {percent}%
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

