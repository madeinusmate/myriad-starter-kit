"use client";

/**
 * Portfolio Page
 *
 * Displays the connected user's positions across all markets.
 *
 * Features:
 * - Portfolio summary (total value, P&L)
 * - Tabbed interface for positions and activity
 * - Connect wallet prompt when not connected
 *
 * This page uses extracted components for better maintainability:
 * - ProfileHeader: User profile with P&L summary
 * - PositionsTable: Sortable positions list
 * - ActivityFeed: Trade history
 * - ConnectWalletPrompt: Wallet connection CTA
 * - EmptyState: No data placeholder
 */

import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { LayoutList, Activity as ActivityIcon } from "lucide-react";
import { useNetwork } from "@/lib/network-context";
import { portfolioQueryOptions } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Portfolio components
import { ProfileHeader } from "@/components/portfolio/profile-header";
import { PositionsTable } from "@/components/portfolio/positions-table";
import { ActivityFeed } from "@/components/portfolio/activity-feed";
import { PortfolioSkeleton } from "@/components/portfolio/skeletons";

// Shared components
import { ConnectWalletPrompt } from "@/components/ui/connect-wallet-prompt";
import { EmptyState } from "@/components/ui/empty-state";

// =============================================================================
// Page Component
// =============================================================================

export default function PortfolioPage() {
  const { status, address } = useAccount();
  const isConnected = status === "connected";
  const { apiBaseUrl, networkConfig } = useNetwork();

  // Fetch portfolio data
  const { data, isPending, error } = useQuery({
    ...portfolioQueryOptions(apiBaseUrl, address ?? "", {
      networkId: networkConfig.id,
    }),
    enabled: Boolean(address),
  });

  // Not connected
  if (!isConnected) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="mt-2 text-muted-foreground">
            Track your positions and claim winnings.
          </p>
        </div>
        <ConnectWalletPrompt />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      {/* Loading State */}
      {isPending && <PortfolioSkeleton />}

      {/* Error State */}
      {error && (
        <Card className="mt-8 border-destructive/50">
          <CardContent className="p-6 text-center">
            <p className="text-destructive font-medium">
              Failed to load portfolio data. Please try again later.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Content */}
      {data && address && (
        <div className="space-y-8">
          {/* 1. Profile Header with P&L */}
          <ProfileHeader address={address} positions={data.data} />

          {/* 2. Main Content - Tabs */}
          <Tabs
            defaultValue="positions"
            className="w-full rounded-xl border border-border/50 bg-card overflow-hidden gap-0"
          >
            <div className="border-b border-border/50 bg-muted/30 px-4 py-3 flex items-center">
              <TabsList className="bg-muted/50 h-9 p-1">
                <TabsTrigger
                  value="positions"
                  className="gap-2 px-3 text-xs font-medium"
                >
                  <LayoutList className="h-3.5 w-3.5" />
                  Positions
                  <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full leading-none">
                    {data.data.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="gap-2 px-3 text-xs font-medium"
                >
                  <ActivityIcon className="h-3.5 w-3.5" />
                  Activity
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="positions" className="m-0 outline-none">
              {data.data.length === 0 ? (
                <div className="p-6 sm:p-12">
                  <EmptyState
                    icon={<LayoutList className="h-8 w-8 text-muted-foreground" />}
                    title="No Positions Yet"
                    description="You don't have any positions. Start trading on prediction markets to build your portfolio."
                    action={
                      <Button asChild>
                        <Link href="/">Browse Markets</Link>
                      </Button>
                    }
                  />
                </div>
              ) : (
                <PositionsTable
                  positions={data.data}
                  className="border-0 rounded-none"
                />
              )}
            </TabsContent>

            <TabsContent value="activity" className="m-0 outline-none">
              <ActivityFeed className="border-0 rounded-none" />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
