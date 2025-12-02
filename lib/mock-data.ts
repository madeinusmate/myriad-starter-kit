/**
 * Mock Market Data Generator
 *
 * Provides realistic mock markets for development and testing.
 * Enable with NEXT_PUBLIC_USE_MOCK_DATA=true
 */

import type { MarketSummary } from "./types";

// =============================================================================
// Mock Market Data
// =============================================================================

const mockMarkets: MarketSummary[] = [
  {
    id: 1,
    networkId: 2741,
    slug: "will-btc-reach-100k-by-end-of-2025",
    title: "Will Bitcoin reach $100,000 by end of 2025?",
    description:
      "This market resolves to YES if the price of Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange before December 31, 2025 11:59 PM UTC.",
    state: "open",
    expiresAt: "2025-12-31T23:59:59Z",
    imageUrl:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Crypto"],
    liquidity: 125000,
    volume: 890000,
    volume24h: 45000,
    outcomes: [
      { id: 0, title: "Yes", price: 0.72, shares: 150000 },
      { id: 1, title: "No", price: 0.28, shares: 58000 },
    ],
  },
  {
    id: 2,
    networkId: 2741,
    slug: "ethereum-etf-approval-q1-2025",
    title: "Will spot Ethereum ETF see $10B inflows in Q1 2025?",
    description:
      "Resolves YES if cumulative net inflows into all US spot Ethereum ETFs exceed $10 billion USD by March 31, 2025.",
    state: "open",
    expiresAt: "2025-03-31T23:59:59Z",
    imageUrl:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Crypto"],
    liquidity: 85000,
    volume: 320000,
    volume24h: 18500,
    outcomes: [
      { id: 0, title: "Yes", price: 0.45, shares: 72000 },
      { id: 1, title: "No", price: 0.55, shares: 88000 },
    ],
  },
  {
    id: 3,
    networkId: 2741,
    slug: "super-bowl-2025-winner",
    title: "Will the Kansas City Chiefs win Super Bowl LIX?",
    description:
      "This market resolves YES if the Kansas City Chiefs win Super Bowl LIX on February 9, 2025.",
    state: "open",
    expiresAt: "2025-02-10T06:00:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Sports"],
    liquidity: 200000,
    volume: 1250000,
    volume24h: 95000,
    outcomes: [
      { id: 0, title: "Yes", price: 0.35, shares: 175000 },
      { id: 1, title: "No", price: 0.65, shares: 325000 },
    ],
  },
  {
    id: 4,
    networkId: 2741,
    slug: "ai-agi-by-2027",
    title: "Will AGI be achieved by 2027?",
    description:
      "Resolves YES if a credible AI research organization publicly claims to have achieved Artificial General Intelligence by December 31, 2027.",
    state: "open",
    expiresAt: "2027-12-31T23:59:59Z",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Technology"],
    liquidity: 150000,
    volume: 520000,
    volume24h: 28000,
    outcomes: [
      { id: 0, title: "Yes", price: 0.18, shares: 54000 },
      { id: 1, title: "No", price: 0.82, shares: 246000 },
    ],
  },
  {
    id: 5,
    networkId: 2741,
    slug: "fed-rate-cut-march-2025",
    title: "Will the Fed cut rates in March 2025?",
    description:
      "Resolves YES if the Federal Reserve announces a rate cut at the March 2025 FOMC meeting.",
    state: "open",
    expiresAt: "2025-03-20T18:00:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Economics"],
    liquidity: 95000,
    volume: 410000,
    volume24h: 32000,
    outcomes: [
      { id: 0, title: "Yes", price: 0.62, shares: 124000 },
      { id: 1, title: "No", price: 0.38, shares: 76000 },
    ],
  },
  {
    id: 6,
    networkId: 2741,
    slug: "solana-flip-ethereum-marketcap",
    title: "Will Solana flip Ethereum in market cap by 2026?",
    description:
      "Resolves YES if Solana's market capitalization exceeds Ethereum's at any point before January 1, 2026.",
    state: "open",
    expiresAt: "2025-12-31T23:59:59Z",
    imageUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Crypto"],
    liquidity: 180000,
    volume: 750000,
    volume24h: 62000,
    outcomes: [
      { id: 0, title: "Yes", price: 0.15, shares: 45000 },
      { id: 1, title: "No", price: 0.85, shares: 255000 },
    ],
  },
  {
    id: 7,
    networkId: 2741,
    slug: "twitter-x-1-billion-users",
    title: "Will X (Twitter) reach 1 billion MAUs by end of 2025?",
    description:
      "Resolves YES if X officially reports or a credible third-party source confirms 1 billion monthly active users before December 31, 2025.",
    state: "open",
    expiresAt: "2025-12-31T23:59:59Z",
    imageUrl:
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Technology"],
    liquidity: 55000,
    volume: 180000,
    volume24h: 8500,
    outcomes: [
      { id: 0, title: "Yes", price: 0.22, shares: 33000 },
      { id: 1, title: "No", price: 0.78, shares: 117000 },
    ],
  },
  {
    id: 8,
    networkId: 2741,
    slug: "champions-league-2025-winner-real-madrid",
    title: "Will Real Madrid win Champions League 2025?",
    description:
      "Resolves YES if Real Madrid wins the 2024-25 UEFA Champions League final.",
    state: "open",
    expiresAt: "2025-06-01T22:00:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Sports"],
    liquidity: 120000,
    volume: 680000,
    volume24h: 41000,
    outcomes: [
      { id: 0, title: "Yes", price: 0.28, shares: 84000 },
      { id: 1, title: "No", price: 0.72, shares: 216000 },
    ],
  },
  {
    id: 9,
    networkId: 2741,
    slug: "nvidia-10-trillion-market-cap",
    title: "Will NVIDIA reach $10 trillion market cap by 2027?",
    description:
      "Resolves YES if NVIDIA's market capitalization reaches $10 trillion USD at any point before January 1, 2027.",
    state: "open",
    expiresAt: "2026-12-31T23:59:59Z",
    imageUrl:
      "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Stocks"],
    liquidity: 210000,
    volume: 920000,
    volume24h: 55000,
    outcomes: [
      { id: 0, title: "Yes", price: 0.31, shares: 93000 },
      { id: 1, title: "No", price: 0.69, shares: 207000 },
    ],
  },
  {
    id: 10,
    networkId: 2741,
    slug: "apple-ar-glasses-2025",
    title: "Will Apple release AR glasses in 2025?",
    description:
      "Resolves YES if Apple officially announces and begins shipping AR glasses (not Vision Pro) in 2025.",
    state: "open",
    expiresAt: "2025-12-31T23:59:59Z",
    imageUrl:
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Technology"],
    liquidity: 75000,
    volume: 290000,
    volume24h: 15000,
    outcomes: [
      { id: 0, title: "Yes", price: 0.12, shares: 24000 },
      { id: 1, title: "No", price: 0.88, shares: 176000 },
    ],
  },
  {
    id: 11,
    networkId: 2741,
    slug: "abstract-chain-top-10-tvl",
    title: "Will Abstract reach Top 10 in L2 TVL by Q2 2025?",
    description:
      "Resolves YES if Abstract chain reaches top 10 Layer 2 chains by Total Value Locked according to L2Beat by June 30, 2025.",
    state: "open",
    expiresAt: "2025-06-30T23:59:59Z",
    imageUrl:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Crypto"],
    liquidity: 165000,
    volume: 480000,
    volume24h: 38000,
    outcomes: [
      { id: 0, title: "Yes", price: 0.58, shares: 145000 },
      { id: 1, title: "No", price: 0.42, shares: 105000 },
    ],
  },
  {
    id: 12,
    networkId: 2741,
    slug: "openai-gpt5-release-2025",
    title: "Will OpenAI release GPT-5 in 2025?",
    description:
      "Resolves YES if OpenAI officially releases GPT-5 (not a preview or limited beta) before December 31, 2025.",
    state: "open",
    expiresAt: "2025-12-31T23:59:59Z",
    imageUrl:
      "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    topics: ["Technology"],
    liquidity: 195000,
    volume: 850000,
    volume24h: 72000,
    outcomes: [
      { id: 0, title: "Yes", price: 0.68, shares: 204000 },
      { id: 1, title: "No", price: 0.32, shares: 96000 },
    ],
  },
];

// =============================================================================
// Export Functions
// =============================================================================

export const getMockMarkets = (params?: {
  topics?: string;
  sort?: string;
}): MarketSummary[] => {
  let filtered = [...mockMarkets];

  // Filter by topic if provided
  if (params?.topics && params.topics !== "all") {
    const topic = params.topics.toLowerCase();
    filtered = filtered.filter((m) =>
      m.topics.some((t) => t.toLowerCase() === topic)
    );
  }

  // Sort
  if (params?.sort) {
    switch (params.sort) {
      case "volume_24h":
        filtered.sort((a, b) => b.volume24h - a.volume24h);
        break;
      case "volume":
        filtered.sort((a, b) => b.volume - a.volume);
        break;
      case "liquidity":
        filtered.sort((a, b) => b.liquidity - a.liquidity);
        break;
      case "published_at":
        // Simulate new markets
        filtered.reverse();
        break;
    }
  }

  return filtered;
};

export const getMockMarketBySlug = (slug: string): MarketSummary | undefined => {
  return mockMarkets.find((m) => m.slug === slug);
};

// =============================================================================
// Mock Portfolio Data
// =============================================================================

import type { Position, MarketEvent } from "./types";

export const mockPositions: Position[] = [
  {
    marketId: 1,
    outcomeId: 0,
    networkId: 2741,
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=600&fit=crop",
    marketTitle: "Will Bitcoin reach $100,000 by end of 2025?",
    marketSlug: "will-btc-reach-100k-by-end-of-2025",
    outcomeTitle: "Yes",
    marketState: "open",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    expiresAt: "2025-12-31T23:59:59Z",
    shares: 125.5,
    price: 0.68,
    value: 90.36,
    invested: 75.0,
    profit: 15.36,
    roi: 0.2048,
    winningsToClaim: false,
    winningsClaimed: false,
    status: "ongoing",
  },
  {
    marketId: 3,
    outcomeId: 1,
    networkId: 2741,
    imageUrl: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop",
    marketTitle: "Will the Kansas City Chiefs win Super Bowl LIX?",
    marketSlug: "super-bowl-2025-winner",
    outcomeTitle: "No",
    marketState: "open",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    expiresAt: "2025-02-10T06:00:00Z",
    shares: 50.0,
    price: 0.65,
    value: 32.5,
    invested: 25.0,
    profit: 7.5,
    roi: 0.3,
    winningsToClaim: false,
    winningsClaimed: false,
    status: "ongoing",
  },
  {
    marketId: 12,
    outcomeId: 0,
    networkId: 2741,
    imageUrl: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop",
    marketTitle: "Will OpenAI release GPT-5 in 2025?",
    marketSlug: "openai-gpt5-release-2025",
    outcomeTitle: "Yes",
    marketState: "open",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    expiresAt: "2025-12-31T23:59:59Z",
    shares: 200.0,
    price: 0.72,
    value: 144.0,
    invested: 160.0,
    profit: -16.0,
    roi: -0.1,
    winningsToClaim: false,
    winningsClaimed: false,
    status: "ongoing",
  },
  {
    marketId: 5,
    outcomeId: 0,
    networkId: 2741,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
    marketTitle: "Will the Fed cut rates in March 2025?",
    marketSlug: "fed-rate-cut-march-2025",
    outcomeTitle: "Yes",
    marketState: "open",
    tokenAddress: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
    expiresAt: "2025-03-20T18:00:00Z",
    shares: 75.0,
    price: 0.58,
    value: 43.5,
    invested: 35.0,
    profit: 8.5,
    roi: 0.243,
    winningsToClaim: false,
    winningsClaimed: false,
    status: "ongoing",
  },
];

export const mockEvents: MarketEvent[] = [
  {
    user: "0x1234567890123456789012345678901234567890",
    action: "buy",
    marketTitle: "Will Bitcoin reach $100,000 by end of 2025?",
    marketSlug: "will-btc-reach-100k-by-end-of-2025",
    marketId: 1,
    networkId: 2741,
    outcomeTitle: "Yes",
    outcomeId: 0,
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=600&fit=crop",
    shares: 125.5,
    value: 75.0,
    timestamp: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
    blockNumber: 1234567,
    token: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
  },
  {
    user: "0x1234567890123456789012345678901234567890",
    action: "buy",
    marketTitle: "Will the Kansas City Chiefs win Super Bowl LIX?",
    marketSlug: "super-bowl-2025-winner",
    marketId: 3,
    networkId: 2741,
    outcomeTitle: "No",
    outcomeId: 1,
    imageUrl: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop",
    shares: 50.0,
    value: 25.0,
    timestamp: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
    blockNumber: 1234500,
    token: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
  },
  {
    user: "0x1234567890123456789012345678901234567890",
    action: "buy",
    marketTitle: "Will OpenAI release GPT-5 in 2025?",
    marketSlug: "openai-gpt5-release-2025",
    marketId: 12,
    networkId: 2741,
    outcomeTitle: "Yes",
    outcomeId: 0,
    imageUrl: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=600&fit=crop",
    shares: 200.0,
    value: 160.0,
    timestamp: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
    blockNumber: 1234400,
    token: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
  },
  {
    user: "0x1234567890123456789012345678901234567890",
    action: "sell",
    marketTitle: "Will Solana flip Ethereum in market cap by 2026?",
    marketSlug: "solana-flip-ethereum-marketcap",
    marketId: 6,
    networkId: 2741,
    outcomeTitle: "Yes",
    outcomeId: 0,
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    shares: 100.0,
    value: 22.0,
    timestamp: Math.floor(Date.now() / 1000) - 345600, // 4 days ago
    blockNumber: 1234300,
    token: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
  },
  {
    user: "0x1234567890123456789012345678901234567890",
    action: "buy",
    marketTitle: "Will the Fed cut rates in March 2025?",
    marketSlug: "fed-rate-cut-march-2025",
    marketId: 5,
    networkId: 2741,
    outcomeTitle: "Yes",
    outcomeId: 0,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
    shares: 75.0,
    value: 35.0,
    timestamp: Math.floor(Date.now() / 1000) - 432000, // 5 days ago
    blockNumber: 1234200,
    token: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
  },
];

export const getMockPortfolio = () => {
  return {
    data: mockPositions,
    pagination: {
      page: 1,
      limit: mockPositions.length,
      total: mockPositions.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };
};

export const getMockUserEvents = () => {
  return {
    data: mockEvents,
    pagination: {
      page: 1,
      limit: mockEvents.length,
      total: mockEvents.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };
};

