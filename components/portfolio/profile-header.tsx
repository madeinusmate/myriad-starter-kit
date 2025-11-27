"use client";

/**
 * Profile Header Component
 *
 * Displays user profile information including avatar, name, and total P&L.
 * Fetches Abstract profile data when available.
 */

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, TrendingUp } from "lucide-react";
import { abstractProfileQueryOptions } from "@/lib/queries";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Position } from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

interface ProfileHeaderProps {
  address: string;
  positions: Position[];
}

// =============================================================================
// Component
// =============================================================================

export function ProfileHeader({ address, positions }: ProfileHeaderProps) {
  const { data: profile, isLoading } = useQuery(
    abstractProfileQueryOptions(address)
  );
  const totalProfit = positions.reduce((sum, p) => sum + p.profit, 0);

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-xl" />;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />

      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-purple-500 rounded-full opacity-20 blur" />
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-background relative shadow-xl">
          {profile?.profilePictureUrl && (
            <AvatarImage
              src={profile.profilePictureUrl}
              alt={profile.name}
              className="object-cover"
            />
          )}
          <AvatarImage
            src={`https://avatar.vercel.sh/${address}`}
            alt="Gradient fallback"
          />
          <AvatarFallback>
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center sm:justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {profile?.name || "Abstract User"}
          </h1>
        </div>

        {/* Total P&L */}
        <div className="flex flex-col items-end justify-center pl-6 border-l border-border/50 my-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Total P&L
            </span>
            <TrendingUp
              className={cn(
                "h-3 w-3",
                totalProfit >= 0
                  ? "text-emerald-500"
                  : "text-rose-500 rotate-180"
              )}
            />
          </div>
          <p
            className={cn(
              "text-2xl sm:text-3xl font-bold tabular-nums tracking-tight",
              totalProfit >= 0
                ? "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                : "text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.2)]"
            )}
          >
            {totalProfit >= 0 ? "+" : ""}
            {formatCurrency(totalProfit)}
          </p>
        </div>
      </div>
    </div>
  );
}

