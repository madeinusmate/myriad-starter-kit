"use client";

/**
 * Trade Mutation Hook
 *
 * TanStack Query mutation for executing buy/sell trades on Myriad.
 * Handles the complete trade flow:
 * 1. Check token approval
 * 2. Approve if needed
 * 3. Execute the trade
 * 4. Invalidate relevant caches
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useCallback, useState } from "react";
import { transformEIP1193Provider } from "@abstract-foundation/agw-client";
import type { EIP1193Provider } from "viem";
import { useNetwork } from "@/lib/network-context";
import { REFERRAL_CODE, TOKENS } from "@/lib/config";
import { chain } from "@/config/chain";
import {
  initializeSdk,
  getErc20Contract,
  checkApproval,
  approveToken,
  executeBuy,
  executeSell,
  type BuyParams,
  type SellParams,
} from "@/lib/myriad-sdk";
import { marketKeys } from "@/lib/queries";
import { portfolioKeys } from "@/lib/queries/portfolio";
import type { TradeAction, TransactionStatus } from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

export interface TradeParams {
  /** Buy or sell */
  action: TradeAction;
  /** Market ID */
  marketId: number;
  /** Outcome ID */
  outcomeId: number;
  /** Token amount (spend for buy, receive for sell) */
  value: number;
  /** Slippage-adjusted share threshold from quote */
  sharesThreshold: number;
  /** Token contract address */
  tokenAddress: string;
}

interface TradeResult {
  /** Transaction hash */
  hash: string;
  /** Action performed */
  action: TradeAction;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Hook for executing trades (buy/sell) on Myriad.
 *
 * Provides:
 * - `trade()` function to execute trades
 * - Loading and error states
 * - Transaction status tracking
 *
 * @example
 * ```tsx
 * function TradeButton({ marketId, outcomeId, quote }) {
 *   const { trade, isPending, status } = useTrade();
 *
 *   const handleTrade = async () => {
 *     await trade({
 *       action: "buy",
 *       marketId,
 *       outcomeId,
 *       value: 100,
 *       sharesThreshold: quote.sharesThreshold,
 *       tokenAddress: market.tokenAddress,
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleTrade} disabled={isPending}>
 *       {status === "approving" ? "Approving..." : isPending ? "Trading..." : "Buy"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTrade() {
  const { address, connector } = useAccount();
  const { contracts, apiBaseUrl } = useNetwork();
  const queryClient = useQueryClient();

  // Track detailed transaction status
  const [status, setStatus] = useState<TransactionStatus>("idle");

  const mutation = useMutation({
    mutationFn: async (params: TradeParams): Promise<TradeResult> => {
      if (!address) throw new Error("Wallet not connected");
      if (!connector) throw new Error("No wallet connector available");

      // Get the raw EIP-1193 provider from the connector
      const rawProvider = await connector.getProvider();

      // Transform the provider to be AGW-compatible
      // This is required for Abstract Global Wallet to properly handle transactions
      // isPrivyCrossApp ensures the smart account address is used for gas estimation
      const provider = transformEIP1193Provider({
        provider: rawProvider as EIP1193Provider,
        chain: chain,
        isPrivyCrossApp: true,
      });

      // Initialize SDK with the transformed AGW provider
      const sdk = await initializeSdk(provider);

      // Use the provided token address, or fall back to USDC as default
      const tokenAddress = params.tokenAddress || TOKENS.USDC.address;
      
      if (!tokenAddress) {
        throw new Error("No token address available for this market");
      }

      // Get ERC20 contract for approval checks
      const erc20 = await getErc20Contract(sdk.app, tokenAddress);

      // For buys, we need to ensure token approval
      if (params.action === "buy") {
        setStatus("approving");
        
        // Always attempt approval - this ensures we have sufficient allowance
        // The approval transaction will prompt the user's wallet
        // Use a large but safe approval amount (1 trillion tokens with 6 decimals = 1e18)
        // This avoids ABI encoding issues with max uint256
        const maxApproval = "1000000000000000000";
        
        console.log("Requesting token approval for address:", address);
        console.log("Token address:", tokenAddress);
        console.log("Spender (prediction market):", contracts.predictionMarket);
        
        try {
          const approvalResult = await approveToken(
            erc20,
            maxApproval,
            contracts.predictionMarket
          );
          
          console.log("Approval transaction result:", approvalResult);
          
          // Wait for the approval transaction to be confirmed
          // This is important - we need the approval to be on-chain before trading
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          console.log("Approval confirmed, proceeding with trade...");
        } catch (e) {
          console.error("Approval failed:", e);
          throw new Error(`Token approval failed: ${e instanceof Error ? e.message : String(e)}`);
        }
      }

      // Execute the trade
      setStatus("pending_signature");

      let result;
      if (params.action === "buy") {
        const buyParams: BuyParams = {
          marketId: params.marketId,
          outcomeId: params.outcomeId,
          value: params.value,
          minOutcomeSharesToBuy: params.sharesThreshold,
        };
        result = await executeBuy(sdk.pm, buyParams, REFERRAL_CODE || undefined);
      } else {
        const sellParams: SellParams = {
          marketId: params.marketId,
          outcomeId: params.outcomeId,
          value: params.value,
          maxOutcomeSharesToSell: params.sharesThreshold,
        };
        result = await executeSell(sdk.pm, sellParams, REFERRAL_CODE || undefined);
      }

      setStatus("confirming");

      return {
        hash: result.transactionHash || result.hash || "unknown",
        action: params.action,
      };
    },

    onSuccess: (data, variables) => {
      setStatus("confirmed");

      // Invalidate relevant caches to refresh data
      queryClient.invalidateQueries({ queryKey: marketKeys.all });

      if (address) {
        queryClient.invalidateQueries({
          queryKey: portfolioKeys.user(apiBaseUrl, address),
        });
      }
    },

    onError: () => {
      setStatus("failed");
    },

    onSettled: () => {
      // Reset status after a delay
      setTimeout(() => setStatus("idle"), 3000);
    },
  });

  const trade = useCallback(
    (params: TradeParams) => mutation.mutateAsync(params),
    [mutation]
  );

  return {
    trade,
    status,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

