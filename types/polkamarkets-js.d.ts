/**
 * Type declarations for polkamarkets-js and web3
 *
 * These libraries don't ship with TypeScript types.
 * Add more specific types as needed based on usage.
 */

// Web3 is a transitive dependency of polkamarkets-js
declare module "web3" {
  class Web3 {
    constructor(provider: unknown);
    eth: {
      getAccounts(): Promise<string[]>;
      getBalance(address: string): Promise<string>;
    };
    utils: {
      fromWei(wei: string, unit: string): string;
      toWei(value: string, unit: string): string;
    };
  }
  export = Web3;
}

declare module "polkamarkets-js" {
  export class Application {
    constructor(options: { web3Provider: any; web3EventsProvider?: string });
    /** Web3 instance - can be set manually with EIP-1193 provider */
    web3: any;
    /** Initialize the web3 instance with HTTP provider */
    start(): void;
    /** Login with wallet provider (uses window.ethereum) */
    login(provider?: unknown, isConnectedWallet?: boolean): Promise<boolean>;
    getPredictionMarketV3PlusContract(options: {
      contractAddress: string;
      querierContractAddress: string;
    }): PredictionMarketContract;
    getERC20Contract(options: { contractAddress: string }): ERC20Contract;
  }

  export interface PredictionMarketContract {
    buy(params: {
      marketId: string | number;
      outcomeId: string | number;
      amount: string | number;
      minShares: string | number;
      referral?: string;
    }): Promise<any>;
    sell(params: {
      marketId: string | number;
      outcomeId: string | number;
      amount: string | number;
      maxShares: string | number;
    }): Promise<any>;
    claimWinnings(params: { marketId: string | number }): Promise<any>;
    claimVoided(params: { marketId: string | number }): Promise<any>;
  }

  export interface ERC20Contract {
    approve(params: {
      spenderAddress: string;
      amount: string | number;
    }): Promise<any>;
    allowance(params: {
      ownerAddress: string;
      spenderAddress: string;
    }): Promise<string>;
    balanceOf(address: string): Promise<string>;
  }
}

