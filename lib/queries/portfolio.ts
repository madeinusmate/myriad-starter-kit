/**
 * Portfolio Query Options
 *
 * TanStack Query options for fetching user portfolio data.
 * Portfolio queries require a connected wallet address.
 */

import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { getUserPortfolio, getUserEvents } from "@/lib/myriad-api";
import { getMockPortfolio, getMockUserEvents } from "@/lib/mock-data";
import { USE_MOCK_DATA } from "@/lib/config";
import type { PortfolioQueryParams, UserEventsQueryParams
 } from "@/lib/types";

// =============================================================================
// Query Keys
// =============================================================================

/**
 * Query key factory for portfolio queries.
 */
export const portfolioKeys = {
  /** Base key for all portfolio queries */
  all: ["portfolio"] as const,
  /** Key for a user's portfolio */
  user: (baseUrl: string, address: string) => [...portfolioKeys.all, baseUrl, address] as const,
  /** Key for filtered portfolio query */
  filtered: (baseUrl: string, address: string, params: PortfolioQueryParams) =>
    [...portfolioKeys.user(baseUrl, address), params] as const,
  /** Key for user events */
  events: (baseUrl: string, address: string, params: UserEventsQueryParams) =>
    [...portfolioKeys.user(baseUrl, address), "events", params] as const,
};

// =============================================================================
// Query Options
// =============================================================================

/**
 * Query options for fetching a user's portfolio positions.
 *
 * @param baseUrl - API base URL
 * @param address - User's wallet address
 * @param params - Filter parameters (networkId, tokenAddress, etc.)
 */
export function portfolioQueryOptions(
  baseUrl: string,
  address: string,
  params: PortfolioQueryParams = {}
) {
  return queryOptions({
    queryKey: portfolioKeys.filtered(USE_MOCK_DATA ? "mock" : baseUrl, address, params),
    queryFn: () => {
      if (USE_MOCK_DATA) {
        return Promise.resolve(getMockPortfolio());
      }
      return getUserPortfolio(baseUrl, address, params);
    },
    // Portfolio data changes with trades, keep it fresh
    staleTime: 15 * 1000,
    // Refetch on window focus to catch external changes
    refetchOnWindowFocus: true,
    // Only fetch when we have both baseUrl and address (or mock mode)
    enabled: Boolean((baseUrl && address) || USE_MOCK_DATA),
  });
}

/**
 * Query options for fetching a user's activity feed (infinite scroll).
 *
 * @param baseUrl - API base URL
 * @param address - User's wallet address
 * @param params - Filter parameters
 */
export function userEventsInfiniteQueryOptions(
  baseUrl: string,
  address: string,
  params: UserEventsQueryParams = {}
) {
  return infiniteQueryOptions({
    queryKey: portfolioKeys.events(USE_MOCK_DATA ? "mock" : baseUrl, address, { ...params, page: undefined }),
    queryFn: ({ pageParam }) => {
      if (USE_MOCK_DATA) {
        return Promise.resolve(getMockUserEvents());
      }
      return getUserEvents(baseUrl, address, { ...params, page: pageParam as number });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
    },
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
    enabled: Boolean((baseUrl && address) || USE_MOCK_DATA),
  });
}

