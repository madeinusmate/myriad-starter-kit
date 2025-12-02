"use client";

/**
 * Bet Settings Context
 *
 * Provides quick bet amount configuration that persists to localStorage.
 * Used by the swipe UI for quick betting and configurable in the profile page.
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { QUICK_BET_AMOUNT } from "./config";

// =============================================================================
// Types
// =============================================================================

interface BetSettingsContextValue {
  /** Current quick bet amount in USD */
  quickBetAmount: number;
  /** Update the quick bet amount */
  setQuickBetAmount: (amount: number) => void;
}

// =============================================================================
// Context
// =============================================================================

const BetSettingsContext = createContext<BetSettingsContextValue | null>(null);

const STORAGE_KEY = "myriad-quick-bet-amount";

// =============================================================================
// Provider
// =============================================================================

export const BetSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [quickBetAmount, setQuickBetAmountState] = useState<number>(QUICK_BET_AMOUNT);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseFloat(stored);
      if (!isNaN(parsed) && parsed > 0) {
        setQuickBetAmountState(parsed);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when amount changes
  const setQuickBetAmount = useCallback((amount: number) => {
    if (amount > 0 && amount <= 1000) {
      setQuickBetAmountState(amount);
      localStorage.setItem(STORAGE_KEY, amount.toString());
    }
  }, []);

  // Don't render children until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <BetSettingsContext.Provider value={{ quickBetAmount, setQuickBetAmount }}>
      {children}
    </BetSettingsContext.Provider>
  );
};

// =============================================================================
// Hook
// =============================================================================

export const useBetSettings = (): BetSettingsContextValue => {
  const context = useContext(BetSettingsContext);
  if (!context) {
    throw new Error("useBetSettings must be used within a BetSettingsProvider");
  }
  return context;
};

