// ============================================================================
// SLIP - useToday HOOK
// ============================================================================
// This hook gives you everything the Home screen needs about "today":
//   - How many slips today?
//   - What's the limit?
//   - Are we under or over?
//   - How many remaining before limit?
//
// WHAT IS A CUSTOM HOOK?
// A custom hook is a function that uses other hooks (useState, useEffect, etc.)
// and packages them up for reuse. The name must start with "use".
//
// WHY A SEPARATE HOOK?
//   - Keeps the Home screen component simple
//   - Can reuse this logic elsewhere if needed
//   - Easy to test and modify
//
// FILE LOCATION: hooks/useToday.ts
// ============================================================================

import { useDailyLimit } from "@/stores/settingsStore";
import { useTodayCount } from "@/stores/slipStore";
import { TodayStatus } from "@/types";
import { useMemo } from "react";

/**
 * useToday - Get today's status for the Home screen
 *
 * RETURNS: TodayStatus object with count, limit, isUnderLimit, remaining
 *
 * USAGE:
 *   const { count, limit, isUnderLimit, remaining } = useToday();
 */
export function useToday(): TodayStatus {
  // Get today's slip count from the events store
  const count = useTodayCount();

  // Get the daily limit from settings store
  const limit = useDailyLimit();

  // useMemo = "remember this calculation until count or limit changes"
  // Without useMemo, we'd recalculate on every render (wasteful)
  const status = useMemo(() => {
    // Are we under the limit?
    // "Under" means we haven't exceeded it yet
    // count = 2, limit = 3 → isUnderLimit = true (2 <= 3)
    // count = 3, limit = 3 → isUnderLimit = true (3 <= 3, AT limit is OK)
    // count = 4, limit = 3 → isUnderLimit = false (4 > 3, OVER limit)
    const isUnderLimit = count <= limit;

    // How many slips left before hitting the limit?
    // If already at or over, remaining = 0
    // count = 1, limit = 3 → remaining = 2 (can slip 2 more times)
    // count = 3, limit = 3 → remaining = 0 (at limit)
    // count = 5, limit = 3 → remaining = 0 (over limit, can't go negative)
    const remaining = Math.max(0, limit - count);

    return {
      count,
      limit,
      isUnderLimit,
      remaining,
    };
  }, [count, limit]); // Only recalculate when count or limit changes

  return status;
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
//   import { useToday } from '@/hooks/useToday';
//
//   function HomeScreen() {
//     const { count, limit, isUnderLimit, remaining } = useToday();
//
//     return (
//       <View>
//         <Text>Today: {count} / {limit}</Text>
//         <Text>{isUnderLimit ? 'On track!' : 'Over limit'}</Text>
//         <Text>{remaining} slips remaining</Text>
//       </View>
//     );
//   }
//
// =============================================================================
