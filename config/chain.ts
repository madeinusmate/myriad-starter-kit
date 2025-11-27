/**
 * Chain Configuration
 *
 * Determines which Abstract chain to use based on the network config.
 * Currently supports Abstract mainnet (2741) and Abstract testnet (11124).
 *
 * The chain is used by both wagmi and the Abstract Global Wallet provider.
 */

import { abstract, abstractTestnet } from "viem/chains";
import { NETWORK } from "@/lib/config";

export const chain = NETWORK.id === abstract.id ? abstract : abstractTestnet;

