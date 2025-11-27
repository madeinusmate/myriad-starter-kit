"use client";

/**
 * Market Rules Component
 *
 * Expandable section displaying market rules/description and resolution source.
 * Uses markdown rendering for formatted rule content.
 */

import { useState } from "react";
import { ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";

// =============================================================================
// Types
// =============================================================================

interface MarketRulesProps {
  description?: string;
  resolutionSource?: string;
  defaultExpanded?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function MarketRules({
  description,
  resolutionSource,
  defaultExpanded = true,
}: MarketRulesProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="font-semibold">Rules</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 text-sm">
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-medium prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-blue-500 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5">
            <ReactMarkdown>
              {description || "No rules specified for this market."}
            </ReactMarkdown>
          </div>

          {/* Resolution Source */}
          {resolutionSource && (
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Resolution Source</span>
              <a
                href={
                  resolutionSource.startsWith("http")
                    ? resolutionSource
                    : `https://${resolutionSource}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {resolutionSource}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

