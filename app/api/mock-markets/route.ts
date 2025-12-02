/**
 * Mock Markets API Endpoint
 *
 * Returns mock market data for development and testing.
 * Only active when NEXT_PUBLIC_USE_MOCK_DATA=true
 */

import { NextRequest, NextResponse } from "next/server";
import { getMockMarkets } from "@/lib/mock-data";
import { USE_MOCK_DATA } from "@/lib/config";

export const GET = async (request: NextRequest) => {
  if (!USE_MOCK_DATA) {
    return NextResponse.json(
      { error: "Mock data is disabled" },
      { status: 403 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const topics = searchParams.get("topics") || undefined;
  const sort = searchParams.get("sort") || "volume_24h";

  const markets = getMockMarkets({ topics, sort });

  return NextResponse.json({
    data: markets,
    pagination: {
      page: 1,
      limit: markets.length,
      total: markets.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  });
};

