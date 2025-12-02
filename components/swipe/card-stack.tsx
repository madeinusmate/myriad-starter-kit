"use client";

/**
 * Card Stack Component
 *
 * Tinder-style swipeable card stack with:
 * - Gesture-based swipe left/right
 * - Visual depth effect with stacked cards
 * - Smooth animations for card transitions
 */

import { useState, useCallback } from "react";
import { useDrag } from "@use-gesture/react";
import { cn } from "@/lib/utils";
import type { MarketSummary } from "@/lib/types";
import { SwipeCard } from "./swipe-card";

// =============================================================================
// Types
// =============================================================================

interface CardStackProps {
  markets: MarketSummary[];
  onBet: (market: MarketSummary, outcomeId: number) => void;
  isPending?: boolean;
}

// =============================================================================
// Constants
// =============================================================================

const SWIPE_THRESHOLD = 100; // Minimum distance to trigger swipe
const ROTATION_FACTOR = 0.1; // Degrees of rotation per pixel dragged
const VISIBLE_CARDS = 3; // Number of cards visible in stack

// =============================================================================
// Component
// =============================================================================

export const CardStack = ({ markets, onBet, isPending }: CardStackProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragState, setDragState] = useState({ x: 0, y: 0, isActive: false });
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      setExitDirection(direction);
      
      // After animation, move to next card
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % markets.length);
        setExitDirection(null);
        setDragState({ x: 0, y: 0, isActive: false });
      }, 300);
    },
    [markets.length]
  );

  const bind = useDrag(
    ({ active, movement: [mx, my], direction: [dx], velocity: [vx] }) => {
      if (isPending) return;
      
      if (active) {
        setDragState({ x: mx, y: my, isActive: true });
      } else {
        // Check if swipe threshold is met
        const shouldSwipe = Math.abs(mx) > SWIPE_THRESHOLD || (vx > 0.5 && Math.abs(mx) > 50);
        
        if (shouldSwipe) {
          handleSwipe(mx > 0 ? "right" : "left");
        } else {
          // Spring back
          setDragState({ x: 0, y: 0, isActive: false });
        }
      }
    },
    {
      axis: "x",
      filterTaps: true,
      rubberband: true,
    }
  );

  if (markets.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-white/60">
          <p className="text-lg font-medium">No markets found</p>
          <p className="text-sm mt-1">Try changing your filters</p>
        </div>
      </div>
    );
  }

  // Get visible cards (current + next few in stack)
  const visibleCards = [];
  for (let i = 0; i < VISIBLE_CARDS; i++) {
    const index = (currentIndex + i) % markets.length;
    visibleCards.push({ market: markets[index], stackIndex: i });
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Render cards in reverse order so top card is last (highest z-index) */}
      {visibleCards.reverse().map(({ market, stackIndex }) => {
        const isTop = stackIndex === 0;
        const isExiting = isTop && exitDirection !== null;

        // Calculate transforms
        let x = 0;
        let y = 0;
        let rotate = 0;
        let scale = 1 - stackIndex * 0.05;
        let translateY = stackIndex * 12;

        if (isTop && dragState.isActive) {
          x = dragState.x;
          y = dragState.y * 0.3; // Reduce vertical movement
          rotate = dragState.x * ROTATION_FACTOR;
        }

        if (isExiting) {
          x = exitDirection === "right" ? window.innerWidth : -window.innerWidth;
          rotate = exitDirection === "right" ? 30 : -30;
        }

        return (
          <div
            key={`${market.id}-${stackIndex}`}
            {...(isTop && !isExiting ? bind() : {})}
            className={cn(
              "absolute touch-none select-none",
              isTop && "cursor-grab active:cursor-grabbing",
              isExiting && "transition-all duration-300 ease-out"
            )}
            style={{
              transform: `
                translateX(${x}px) 
                translateY(${y + translateY}px) 
                rotate(${rotate}deg) 
                scale(${scale})
              `,
              zIndex: VISIBLE_CARDS - stackIndex,
              opacity: 1 - stackIndex * 0.15,
              transition: isExiting || (!dragState.isActive && isTop)
                ? "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                : "none",
            }}
          >
            <SwipeCard
              market={market}
              onBet={onBet}
              isPending={isPending}
              dragX={isTop ? dragState.x : 0}
            />
          </div>
        );
      })}

      {/* Swipe indicators */}
      <div
        className={cn(
          "absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none",
          "px-6 py-3 rounded-2xl font-bold text-xl uppercase tracking-wider",
          "border-4 border-rose-500 text-rose-500 bg-rose-500/10",
          "transition-opacity duration-200",
          dragState.x < -50 ? "opacity-100" : "opacity-0"
        )}
        style={{ transform: `translateY(-50%) rotate(-15deg)` }}
      >
        Skip
      </div>
      <div
        className={cn(
          "absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none",
          "px-6 py-3 rounded-2xl font-bold text-xl uppercase tracking-wider",
          "border-4 border-emerald-500 text-emerald-500 bg-emerald-500/10",
          "transition-opacity duration-200",
          dragState.x > 50 ? "opacity-100" : "opacity-0"
        )}
        style={{ transform: `translateY(-50%) rotate(15deg)` }}
      >
        Next
      </div>
    </div>
  );
};

