/**
 * Myriad SDK Integration
 *
 * Wrapper around polkamarkets-js SDK for on-chain operations.
 * The SDK handles:
 * - ERC20 approvals
 * - Buying/selling outcome shares
 * - Claiming winnings and voided shares
 *
 * Note: This module is client-side only due to polkamarkets-js dependencies.
 * Always import dynamically or use in client components.
 */

import { CONTRACTS, NETWORK } from "./config";

// =============================================================================
// Types
// =============================================================================

// We use `any` here because polkamarkets-js types aren't exported properly
// and we need to handle dynamic imports
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Initialized SDK instance with prediction market contract.
 */
export interface MyriadSdk {
  /** The polkamarkets application instance */
  app: any;
  /** The prediction market contract instance */
  pm: any;
}

// =============================================================================
// SDK Initialization
// =============================================================================

/**
 * Dynamically import polkamarkets-js to avoid SSR issues.
 * The library has Node.js-only dependencies that break SSR.
 */
async function getPolkamarketsJs() {
  const polkamarketsjs = await import("polkamarkets-js");
  return polkamarketsjs;
}

/**
 * Initialize the Myriad SDK with an EIP-1193 provider.
 *
 * The SDK requires an EIP-1193 provider (e.g., from wagmi's connector.getProvider()) to:
 * - Sign transactions
 * - Read contract state
 * - Execute trades
 *
 * Note: polkamarkets-js uses web3.js internally, which expects EIP-1193 providers.
 * The viem transport objects from wagmi are NOT compatible - use connector.getProvider() instead.
 *
 * @param provider - EIP-1193 provider from wallet connector
 * @returns Initialized SDK instance
 *
 * @example
 * ```ts
 * const provider = await connector.getProvider();
 * const sdk = await initializeSdk(provider);
 *
 * // Now use sdk.pm.buy(), sdk.pm.sell(), etc.
 * ```
 */
/**
 * Clean transaction parameters for AGW compatibility.
 * Removes or fixes null values that polkamarkets-js sends but AGW/viem can't handle.
 */
function cleanTransactionParams(params: any[]): any[] {
  return params.map(param => {
    if (typeof param === 'object' && param !== null) {
      const cleaned = { ...param };
      
      // Remove null gas parameters - AGW will estimate these
      if (cleaned.gasPrice === null) delete cleaned.gasPrice;
      if (cleaned.maxFeePerGas === null) delete cleaned.maxFeePerGas;
      if (cleaned.maxPriorityFeePerGas === null) delete cleaned.maxPriorityFeePerGas;
      if (cleaned.gas === null) delete cleaned.gas;
      if (cleaned.gasLimit === null) delete cleaned.gasLimit;
      if (cleaned.nonce === null) delete cleaned.nonce;
      
      // Handle null value - set to 0 for contract calls
      if (cleaned.value === null || cleaned.value === undefined) {
        cleaned.value = "0x0";
      }
      
      return cleaned;
    }
    return param;
  });
}

/**
 * Wrap an EIP-1193 provider to be compatible with web3.js v1.x
 * Web3.js expects certain properties that may not exist on all EIP-1193 providers
 */
function wrapProviderForWeb3(eip1193Provider: any) {
  // Store event handlers locally since the AGW provider's on/removeListener may not work
  const eventHandlers: Record<string, Array<(...args: any[]) => void>> = {};
  
  // Methods that involve transactions and may have null gas params
  const TX_METHODS = ['eth_sendTransaction', 'eth_signTransaction', 'eth_call', 'eth_estimateGas'];
  
  const wrappedProvider = {
    // Tell web3.js this provider doesn't support subscriptions
    // This prevents subscription-related initialization that causes errors
    supportsSubscriptions: () => false,
    
    // The send method that web3.js v1.x uses internally (callback-based)
    send: (payload: any, callback: any) => {
      // Handle batch requests
      if (Array.isArray(payload)) {
        Promise.all(
          payload.map((p: any) => {
            const params = TX_METHODS.includes(p.method) 
              ? cleanTransactionParams(p.params || [])
              : (p.params || []);
            return eip1193Provider.request({
              method: p.method,
              params,
            }).then((result: any) => ({ id: p.id, jsonrpc: "2.0", result }))
              .catch((error: any) => ({ id: p.id, jsonrpc: "2.0", error }));
          })
        ).then((results) => callback(null, results))
          .catch((error) => callback(error, null));
        return;
      }
      
      // Clean transaction params if this is a transaction-related method
      const params = TX_METHODS.includes(payload.method)
        ? cleanTransactionParams(payload.params || [])
        : (payload.params || []);
      
      // Handle single request
      eip1193Provider
        .request({
          method: payload.method,
          params,
        })
        .then((result: any) => {
          callback(null, { id: payload.id, jsonrpc: "2.0", result });
        })
        .catch((error: any) => {
          callback(error, null);
        });
    },
    
    // sendAsync is an alias for send in web3.js v1.x
    sendAsync: function(payload: any, callback: any) {
      return wrappedProvider.send(payload, callback);
    },
    
    // EIP-1193 request method (modern interface)
    request: (args: { method: string; params?: any[] }) => {
      // Clean transaction params if this is a transaction-related method
      const params = TX_METHODS.includes(args.method)
        ? cleanTransactionParams(args.params || [])
        : args.params;
      
      return eip1193Provider.request({ method: args.method, params });
    },
    
    // Connection status
    connected: true,
    isConnected: () => true,
    
    // Event emitter interface - implement locally, don't delegate to AGW provider
    // AGW provider's event methods have internal issues
    on: (event: string, handler: (...args: any[]) => void) => {
      if (!eventHandlers[event]) {
        eventHandlers[event] = [];
      }
      eventHandlers[event].push(handler);
      return wrappedProvider;
    },
    removeListener: (event: string, handler: (...args: any[]) => void) => {
      if (eventHandlers[event]) {
        const idx = eventHandlers[event].indexOf(handler);
        if (idx > -1) {
          eventHandlers[event].splice(idx, 1);
        }
      }
      return wrappedProvider;
    },
    removeAllListeners: (event?: string) => {
      if (event) {
        delete eventHandlers[event];
      } else {
        Object.keys(eventHandlers).forEach(k => delete eventHandlers[k]);
      }
      return wrappedProvider;
    },
    emit: (event: string, ...args: any[]) => {
      if (eventHandlers[event]) {
        eventHandlers[event].forEach(handler => handler(...args));
      }
      return true;
    },
    listeners: (event: string) => eventHandlers[event] || [],
    listenerCount: (event: string) => (eventHandlers[event] || []).length,
    
    // Host property that web3.js may check
    host: "abstract-global-wallet",
  };
  
  return wrappedProvider;
}

export async function initializeSdk(provider: unknown): Promise<MyriadSdk> {
  const polkamarketsjs = await getPolkamarketsJs();

  // Wrap the AGW-transformed EIP-1193 provider for web3.js v1.x compatibility
  const wrappedProvider = wrapProviderForWeb3(provider);

  // Initialize the polkamarkets application with RPC URL for initial setup
  const app = new polkamarketsjs.Application({
    web3Provider: NETWORK.rpcUrl,
    web3EventsProvider: NETWORK.rpcUrl,
  });

  // Start the application to initialize the web3 instance with HTTP provider
  app.start();

  // Store the current provider for use in contracts
  // Instead of creating a new Web3 instance (which causes subscription issues),
  // we set the provider on the existing web3 instance
  try {
    // Try using setProvider which is the proper way to change providers
    if (app.web3.setProvider) {
      app.web3.setProvider(wrappedProvider);
    } else if (app.web3.currentProvider) {
      // Fallback: directly replace the currentProvider
      app.web3.currentProvider = wrappedProvider;
    }
  } catch (e) {
    console.warn("Failed to set provider via setProvider, using direct assignment:", e);
    // Last resort: try direct provider assignment on eth module
    if (app.web3.eth && app.web3.eth.currentProvider !== undefined) {
      app.web3.eth.currentProvider = wrappedProvider;
    }
  }

  // Also set window.web3 for compatibility with some web3.js operations
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).web3 = app.web3;
  }

  // Get the prediction market contract instance
  const pm = app.getPredictionMarketV3PlusContract({
    contractAddress: CONTRACTS.predictionMarket,
    querierContractAddress: CONTRACTS.predictionMarketQuerier,
  });

  return { app, pm };
}

/**
 * Get an ERC20 contract instance for token operations.
 *
 * @param app - Polkamarkets application instance
 * @param tokenAddress - ERC20 token contract address
 * @returns ERC20 contract instance
 */
export async function getErc20Contract(app: any, tokenAddress: string) {
  const erc20 = app.getERC20Contract({
    contractAddress: tokenAddress,
  });
  
  // Initialize the contract (sets up web3 contract instance with address)
  if (erc20.__init__) {
    await erc20.__init__();
  }
  
  return erc20;
}

// =============================================================================
// Trade Operations
// =============================================================================

/**
 * Parameters for buying outcome shares.
 */
export interface BuyParams {
  /** Market ID */
  marketId: number;
  /** Outcome ID to buy */
  outcomeId: number;
  /** Amount of tokens to spend */
  value: number;
  /** Minimum shares to accept (slippage protection) */
  minOutcomeSharesToBuy: number;
  /** Whether to use wrapped native token */
  wrapped?: boolean;
}

/**
 * Parameters for selling outcome shares.
 */
export interface SellParams {
  /** Market ID */
  marketId: number;
  /** Outcome ID to sell */
  outcomeId: number;
  /** Amount of tokens to receive */
  value: number;
  /** Maximum shares to sell (slippage protection) */
  maxOutcomeSharesToSell: number;
  /** Whether to use wrapped native token */
  wrapped?: boolean;
}

/**
 * Execute a buy trade using the SDK.
 *
 * For revenue sharing, use `referralBuy` instead of regular `buy`.
 *
 * @param pm - Prediction market contract instance
 * @param params - Buy parameters
 * @param referralCode - Optional referral code for revenue sharing
 */
export async function executeBuy(
  pm: any,
  params: BuyParams,
  referralCode?: string
) {
  if (referralCode) {
    // Use referral buy for revenue sharing
    return pm.referralBuy({
      marketId: params.marketId,
      outcomeId: params.outcomeId,
      value: params.value,
      minOutcomeSharesToBuy: params.minOutcomeSharesToBuy,
      code: referralCode,
    });
  }

  // Regular buy without referral
  return pm.buy({
    marketId: params.marketId,
    outcomeId: params.outcomeId,
    value: params.value,
    minOutcomeSharesToBuy: params.minOutcomeSharesToBuy,
    wrapped: params.wrapped,
  });
}

/**
 * Execute a sell trade using the SDK.
 *
 * @param pm - Prediction market contract instance
 * @param params - Sell parameters
 * @param referralCode - Optional referral code
 */
export async function executeSell(
  pm: any,
  params: SellParams,
  referralCode?: string
) {
  if (referralCode) {
    return pm.referralSell({
      marketId: params.marketId,
      outcomeId: params.outcomeId,
      value: params.value,
      maxOutcomeSharesToSell: params.maxOutcomeSharesToSell,
      code: referralCode,
    });
  }

  return pm.sell({
    marketId: params.marketId,
    outcomeId: params.outcomeId,
    value: params.value,
    maxOutcomeSharesToSell: params.maxOutcomeSharesToSell,
    wrapped: params.wrapped,
  });
}

// =============================================================================
// Claim Operations
// =============================================================================

/**
 * Claim winnings from a resolved market.
 *
 * @param pm - Prediction market contract instance
 * @param marketId - Market ID
 * @param wrapped - Whether to unwrap to native token
 */
export async function claimWinnings(pm: any, marketId: number, wrapped?: boolean) {
  return pm.claimWinnings({
    marketId,
    wrapped,
  });
}

/**
 * Claim voided shares from a cancelled market.
 *
 * @param pm - Prediction market contract instance
 * @param marketId - Market ID
 * @param outcomeId - Outcome ID to claim
 * @param wrapped - Whether to unwrap to native token
 */
export async function claimVoided(
  pm: any,
  marketId: number,
  outcomeId: number,
  wrapped?: boolean
) {
  return pm.claimVoidedOutcomeShares({
    marketId,
    outcomeId,
    wrapped,
  });
}

// =============================================================================
// Approval Operations
// =============================================================================

/**
 * Check if token spending is approved for the prediction market contract.
 *
 * @param erc20 - ERC20 contract instance
 * @param userAddress - User's wallet address
 * @param amount - Amount to check approval for
 * @param spenderAddress - Prediction market contract address
 */
export async function checkApproval(
  erc20: any,
  userAddress: string,
  amount: string,
  spenderAddress: string
): Promise<boolean> {
  return erc20.isApproved({
    address: userAddress,
    amount,
    spenderAddress,
  });
}

/**
 * Approve token spending for the prediction market contract.
 *
 * @param erc20 - ERC20 contract instance
 * @param amount - Amount to approve (use large value for unlimited)
 * @param spenderAddress - Prediction market contract address
 */
export async function approveToken(
  erc20: any,
  amount: string,
  spenderAddress: string
) {
  return erc20.approve({
    amount,
    address: spenderAddress,
  });
}
