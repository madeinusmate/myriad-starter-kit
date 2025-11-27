"use client";

/**
 * Market Timeline Component
 *
 * Displays a visual timeline of market lifecycle events:
 * - Market published date
 * - Market close date
 * - Resolution status
 */

import { useState } from "react";
import { ChevronUp, ChevronDown, CheckCircle, Circle } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import type { Market } from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

interface MarketTimelineProps {
  market: Market;
  defaultExpanded?: boolean;
}

interface TimelineEvent {
  title: string;
  date: string | null | undefined;
  description?: string;
  isCompleted: boolean;
}

// =============================================================================
// Helper Functions
// =============================================================================

function getTimelineEvents(market: Market): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      title: "Market published",
      date: market.publishedAt,
      isCompleted: true,
    },
    {
      title: "Market closes",
      date: market.expiresAt,
      isCompleted: market.state !== "open",
    },
  ];

  // Resolution event
  if (market.state === "resolved" && market.resolvedOutcomeId !== null) {
    const resolvedOutcome = market.outcomes.find(
      (o) => o.id === market.resolvedOutcomeId
    );
    events.push({
      title: "Resolution",
      date: null,
      description: `Resolved: ${resolvedOutcome?.title ?? "Unknown"}`,
      isCompleted: true,
    });
  } else {
    events.push({
      title: "Resolution",
      date: null,
      description:
        "The outcome will be validated by the team within 24 hours of its occurrence.",
      isCompleted: false,
    });
  }

  return events;
}

// =============================================================================
// Timeline Event Component
// =============================================================================

interface TimelineEventItemProps {
  event: TimelineEvent;
}

function TimelineEventItem({ event }: TimelineEventItemProps) {
  return (
    <div className="flex gap-3 items-start relative">
      {event.isCompleted ? (
        <CheckCircle className="h-6 w-6 text-emerald-500 bg-card shrink-0" />
      ) : (
        <Circle className="h-6 w-6 text-muted-foreground bg-card shrink-0" />
      )}
      <div>
        <p className="font-medium text-sm">{event.title}</p>
        <p className="text-xs text-muted-foreground">
          {event.description ? (
            <span
              className={
                event.isCompleted ? "font-medium text-foreground" : undefined
              }
            >
              {event.description}
            </span>
          ) : event.date ? (
            formatDate(event.date)
          ) : (
            "—"
          )}
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

export function MarketTimeline({
  market,
  defaultExpanded = true,
}: MarketTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const events = getTimelineEvents(market);

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="font-semibold">Timeline</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="relative space-y-4">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

            {events.map((event, index) => (
              <TimelineEventItem key={index} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

