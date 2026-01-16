// ============================================================================
// SLIP - useStreak HOOK
// ============================================================================
// This hook calculates the user's streak:
//   "How many CONSECUTIVE days have I stayed under my limit?"
//
// IMPORTANT: The streak is NOT "days with 0 slips"!
// That would be too harsh and demotivating.
// Instead, it's "days where slips <= daily limit"
//
// EXAMPLE:
//   Daily limit = 3
//   Jan 14: 2 slips → under limit ✓
//   Jan 15: 3 slips → under limit ✓ (at limit counts!)
//   Jan 16: 1 slip  → under limit ✓
//   Streak = 3 days
//
// FILE LOCATION: hooks/useStreak.ts
// ============================================================================

import { useDailyLimit } from "@/stores/settingsStore";
import { useSlipStore } from "@/stores/slipStore";
import { StreakInfo } from "@/types";
import {
  getDateFromTimestamp,
  getDaysAgoDateString,
  getTodayDateString,
} from "@/utils/date";
import { useMemo } from "react";

/**
 * useStreak - Calculate current and best streak
 *
 * RETURNS: StreakInfo with current and best streak counts
 */
export function useStreak(): StreakInfo {
  // Get all events from the store
  const events = useSlipStore((state) => state.events);

  // Get the daily limit
  const limit = useDailyLimit();

  // Calculate streaks using useMemo (only recalculate when events/limit change)
  const streakInfo = useMemo(() => {
    // -------------------------------------------------------------------------
    // STEP 1: Count slips per day
    // -------------------------------------------------------------------------
    // Create a map: { "2025-01-16": 3, "2025-01-15": 2, ... }

    const countsByDate: Record<string, number> = {};

    events.forEach((event) => {
      const date = getDateFromTimestamp(event.timestamp);
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    });

    // -------------------------------------------------------------------------
    // STEP 2: Calculate CURRENT streak (consecutive days up to today)
    // -------------------------------------------------------------------------
    // Start from today, go backwards. Count days under limit until we hit
    // a day that's over limit.

    let currentStreak = 0;
    let daysAgo = 0;

    // Keep checking previous days until we find one over limit
    while (true) {
      const dateToCheck = getDaysAgoDateString(daysAgo);
      const slipsOnDay = countsByDate[dateToCheck] || 0; // 0 if no slips logged

      // Is this day under (or at) the limit?
      if (slipsOnDay <= limit) {
        currentStreak++;
        daysAgo++;

        // Safety limit: don't go back more than 365 days
        if (daysAgo > 365) break;
      } else {
        // This day was over limit - streak broken!
        break;
      }
    }

    // -------------------------------------------------------------------------
    // STEP 3: Calculate BEST streak ever
    // -------------------------------------------------------------------------
    // This is more complex - we need to find the longest consecutive run
    // in all of history.

    // Get all dates we have data for, sorted
    const allDates = Object.keys(countsByDate).sort();

    if (allDates.length === 0) {
      // No data yet - current streak is based on "no slips = under limit"
      // But best streak should match current
      return { current: currentStreak, best: currentStreak };
    }

    // Find the longest streak in history
    let bestStreak = 0;
    let tempStreak = 0;

    // We need to check every day from the first logged day to today
    const firstDate = allDates[0];
    const today = getTodayDateString();

    // Convert dates to timestamps for iteration
    let checkDate = new Date(firstDate);
    const endDate = new Date(today);

    while (checkDate <= endDate) {
      const dateStr = formatDate(checkDate);
      const slipsOnDay = countsByDate[dateStr] || 0;

      if (slipsOnDay <= limit) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0; // Reset streak
      }

      // Move to next day
      checkDate.setDate(checkDate.getDate() + 1);
    }

    // Current streak might be the best
    bestStreak = Math.max(bestStreak, currentStreak);

    return { current: currentStreak, best: bestStreak };
  }, [events, limit]);

  return streakInfo;
}

// Helper function to format date (same as in date.ts, but local to avoid circular import)
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
//   import { useStreak } from '@/hooks/useStreak';
//
//   function HomeScreen() {
//     const { current, best } = useStreak();
//
//     return (
//       <View>
//         <Text>Current streak: {current} days</Text>
//         <Text>Best streak: {best} days</Text>
//       </View>
//     );
//   }
//
// =============================================================================
