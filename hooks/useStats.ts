// ============================================================================
// SLIP - useStats HOOK
// ============================================================================
// This hook computes ALL statistics for the Stats screen.
//
// WHY A HOOK?
//   - Calculations are complex (filtering, grouping, counting)
//   - Multiple components need the same data
//   - useMemo ensures we only recalculate when events/range change
//
// WHAT IT COMPUTES:
//   - Total slips in the selected range
//   - Average slips per day
//   - Best day (lowest slips)
//   - Worst day (highest slips)
//   - Percentage of days under the daily limit
//   - Daily breakdown (for the list)
//   - Pattern insights (peak hour, peak day of week)
//
// FILE LOCATION: hooks/useStats.ts
// ============================================================================

import { useDailyLimit } from "@/stores/settingsStore";
import { useSlipStore } from "@/stores/slipStore";
import { MIN_DAYS_FOR_PATTERNS } from "@/utils/constants";
import {
  formatDateForDisplay,
  formatHourRange,
  getDateFromTimestamp,
  getDayName,
  getDayOfWeekFromTimestamp,
  getHourFromTimestamp,
  getLastNDays,
} from "@/utils/date";
import { useMemo } from "react";

// =============================================================================
// TYPES - What the hook returns
// =============================================================================

export interface DayCount {
  date: string; // "2025-01-16"
  displayDate: string; // "Today" or "Jan 16"
  count: number; // Number of slips
  isOverLimit: boolean; // count > dailyLimit
}

export interface StatsData {
  // Summary metrics
  totalSlips: number;
  avgPerDay: number;
  bestDay: DayCount | null; // Day with lowest slips (null if no data)
  worstDay: DayCount | null; // Day with highest slips (null if no data)
  daysUnderLimitPercent: number;

  // Daily breakdown for the list
  dailyCounts: DayCount[];

  // Pattern insights (null if not enough data)
  peakHour: string | null; // "9–10 PM" or null
  peakDayOfWeek: string | null; // "Friday" or null

  // Flags
  hasEnoughDataForPatterns: boolean;
  hasAnyData: boolean;
}

// =============================================================================
// THE HOOK
// =============================================================================

export function useStats(range: number): StatsData {
  // Get raw data from stores
  const events = useSlipStore((state) => state.events);
  const dailyLimit = useDailyLimit();

  // Compute everything with useMemo (only recalculates when dependencies change)
  const stats = useMemo(() => {
    // -------------------------------------------------------------------------
    // STEP 1: Get the dates in our range
    // -------------------------------------------------------------------------
    // getLastNDays(7) returns ["2025-01-10", "2025-01-11", ..., "2025-01-16"]
    const datesInRange = getLastNDays(range);
    const dateSet = new Set(datesInRange);

    // -------------------------------------------------------------------------
    // STEP 2: Filter events to only those in our range
    // -------------------------------------------------------------------------
    const eventsInRange = events.filter((event) => {
      const eventDate = getDateFromTimestamp(event.timestamp);
      return dateSet.has(eventDate);
    });

    // -------------------------------------------------------------------------
    // STEP 3: Count slips per day
    // -------------------------------------------------------------------------
    // Create a map: { "2025-01-16": 3, "2025-01-15": 2, ... }
    const countsByDate: Record<string, number> = {};

    // Initialize all days in range with 0
    datesInRange.forEach((date) => {
      countsByDate[date] = 0;
    });

    // Count events
    eventsInRange.forEach((event) => {
      const date = getDateFromTimestamp(event.timestamp);
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    });

    // -------------------------------------------------------------------------
    // STEP 4: Build daily counts array (for the list component)
    // -------------------------------------------------------------------------
    // Most recent day first
    const dailyCounts: DayCount[] = datesInRange
      .slice()
      .reverse()
      .map((date) => ({
        date,
        displayDate: formatDateForDisplay(date),
        count: countsByDate[date],
        isOverLimit: countsByDate[date] > dailyLimit,
      }));

    // -------------------------------------------------------------------------
    // STEP 5: Calculate summary metrics
    // -------------------------------------------------------------------------
    const totalSlips = eventsInRange.length;
    const avgPerDay = range > 0 ? totalSlips / range : 0;

    // Find best and worst days
    let bestDay: DayCount | null = null;
    let worstDay: DayCount | null = null;

    dailyCounts.forEach((day) => {
      if (!bestDay || day.count < bestDay.count) {
        bestDay = day;
      }
      if (!worstDay || day.count > worstDay.count) {
        worstDay = day;
      }
    });

    // Days under limit percentage
    const daysUnderLimit = dailyCounts.filter(
      (d) => d.count <= dailyLimit
    ).length;
    const daysUnderLimitPercent =
      range > 0 ? (daysUnderLimit / range) * 100 : 0;

    // -------------------------------------------------------------------------
    // STEP 6: Pattern detection (only if enough data)
    // -------------------------------------------------------------------------
    // We need events from at least MIN_DAYS_FOR_PATTERNS different days
    const uniqueDaysWithEvents = new Set(
      eventsInRange.map((e) => getDateFromTimestamp(e.timestamp))
    ).size;

    const hasEnoughDataForPatterns =
      uniqueDaysWithEvents >= MIN_DAYS_FOR_PATTERNS;

    let peakHour: string | null = null;
    let peakDayOfWeek: string | null = null;

    if (hasEnoughDataForPatterns && eventsInRange.length >= 3) {
      // Find peak hour
      const hourCounts: Record<number, number> = {};
      eventsInRange.forEach((event) => {
        const hour = getHourFromTimestamp(event.timestamp);
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      let maxHourCount = 0;
      let maxHour = 0;
      Object.entries(hourCounts).forEach(([hour, count]) => {
        if (count > maxHourCount) {
          maxHourCount = count;
          maxHour = parseInt(hour, 10);
        }
      });

      if (maxHourCount >= 2) {
        peakHour = formatHourRange(maxHour);
      }

      // Find peak day of week
      const dayOfWeekCounts: Record<number, number> = {};
      eventsInRange.forEach((event) => {
        const dow = getDayOfWeekFromTimestamp(event.timestamp);
        dayOfWeekCounts[dow] = (dayOfWeekCounts[dow] || 0) + 1;
      });

      let maxDowCount = 0;
      let maxDow = 0;
      Object.entries(dayOfWeekCounts).forEach(([dow, count]) => {
        if (count > maxDowCount) {
          maxDowCount = count;
          maxDow = parseInt(dow, 10);
        }
      });

      if (maxDowCount >= 2) {
        peakDayOfWeek = getDayName(maxDow);
      }
    }

    // -------------------------------------------------------------------------
    // RETURN ALL COMPUTED DATA
    // -------------------------------------------------------------------------
    return {
      totalSlips,
      avgPerDay,
      bestDay,
      worstDay,
      daysUnderLimitPercent,
      dailyCounts,
      peakHour,
      peakDayOfWeek,
      hasEnoughDataForPatterns,
      hasAnyData: events.length > 0,
    };
  }, [events, range, dailyLimit]);

  return stats;
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
//   import { useStats } from '@/hooks/useStats';
//
//   function StatsScreen() {
//     const [range, setRange] = useState(7);
//     const stats = useStats(range);
//
//     return (
//       <View>
//         <Text>Total: {stats.totalSlips}</Text>
//         <Text>Avg: {stats.avgPerDay.toFixed(1)}/day</Text>
//         <Text>Best: {stats.bestDay?.displayDate}</Text>
//         {stats.peakHour && <Text>Peak time: {stats.peakHour}</Text>}
//       </View>
//     );
//   }
//
// =============================================================================
