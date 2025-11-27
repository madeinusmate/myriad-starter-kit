/**
 * Abstract Profile Query Options
 *
 * Fetches user profile data from the Abstract Portal API.
 * Abstract users may have a custom name and profile picture set on their portal.
 */

import { queryOptions } from "@tanstack/react-query";

const ABSTRACT_API_URL = "https://api.portal.abs.xyz/api/v1";

// =============================================================================
// Types
// =============================================================================

/**
 * User profile from the Abstract Portal.
 */
export interface AbstractProfile {
  address: string;
  name: string;
  description: string;
  profilePictureUrl: string;
  tier: string;
}

// =============================================================================
// Query Keys
// =============================================================================

export const profileKeys = {
  all: ["profile"] as const,
  address: (address: string) => [...profileKeys.all, address] as const,
};

// =============================================================================
// API Functions
// =============================================================================

/**
 * Fetch a user's Abstract Portal profile.
 * Returns null if the user hasn't set up their profile.
 */
async function fetchAbstractProfile(address: string): Promise<AbstractProfile | null> {
  try {
    const response = await fetch(`${ABSTRACT_API_URL}/user/profile/${address}/`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch abstract profile");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching abstract profile:", error);
    return null;
  }
}

// =============================================================================
// Query Options
// =============================================================================

/**
 * Query options for fetching an Abstract user profile.
 * Profiles are cached for 1 hour since they rarely change.
 */
export const abstractProfileQueryOptions = (address?: string) => queryOptions({
  queryKey: profileKeys.address(address || ""),
  queryFn: () => fetchAbstractProfile(address!),
  enabled: !!address,
  staleTime: 1000 * 60 * 60,
});

