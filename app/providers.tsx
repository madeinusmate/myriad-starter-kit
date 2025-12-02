"use client";

/**
 * App Providers
 *
 * This file wraps the application with all necessary providers:
 * - NextAbstractWalletProvider: Wraps Wagmi, QueryClient, and AbstractWalletProvider for wallet connection and blockchain interactions
 * - NetworkProvider: Network configuration
 * - BetSettingsProvider: Quick bet amount configuration
 *
 * The provider order matters - outer providers are available to inner ones.
 */

import { type ReactNode } from "react";
import { NextAbstractWalletProvider } from "@/components/agw-provider";
import { NetworkProvider } from "@/lib/network-context";
import { BetSettingsProvider } from "@/lib/bet-settings-context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextAbstractWalletProvider>
      <NetworkProvider>
        <BetSettingsProvider>
          {children}
        </BetSettingsProvider>
      </NetworkProvider>
    </NextAbstractWalletProvider>
  );
}

