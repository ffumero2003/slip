// ============================================================================
// SLIP - HISTORY DATA HOOK
// ============================================================================
// Transforms the flat events array into a format SectionList can use.
//
// WHY A HOOK?
//   1. Keeps screen component clean (no data logic there)
//   2. Memoizes the transformation (don't recalculate every render)
//   3. Reusable if we ever need history data elsewhere
//
// FILE LOCATION: hooks/useHistoryData.ts
// ============================================================================

import { useAllEvents, useSlipStore } from "@/stores/slipStore";
import { SlipEvent } from "@/types";
import { formatDateForDisplay, getDateFromTimestamp } from "@/utils/date";
import { useMemo } from "react";

// =============================================================================
// TYPES
// =============================================================================

/**
 * One section for the SectionList
 *
 * EXAMPLE:
 *   { title: "Today", date: "2025-01-16", data: [SlipEvent, SlipEvent] }
 */
export interface HistorySection {
  // What to display as the header (e.g., "Today", "Yesterday", "Jan 14")
  title: string;

  // The raw date string for sorting/keying (e.g., "2025-01-16")
  date: string;

  // The slips that happened on this date
  data: SlipEvent[];
}

// =============================================================================
// THE HOOK
// =============================================================================

/**
 * useHistoryData - Get events formatted for SectionList
 *
 * RETURNS:
 *   sections: HistorySection[] - ready for SectionList
 *   isEmpty: boolean - true if no events at all
 *   isLoading: boolean - true while loading from storage
 *
 * WHY USEMEMO?
 *   The transformation (grouping by date) is "expensive" - we don't want
 *   to redo it on every render. useMemo caches the result and only
 *   recalculates when `events` changes.
 */
export function useHistoryData() {
  // -------------------------------------------------------------------------
  // Get raw data from store
  // -------------------------------------------------------------------------
  const events = useAllEvents();
  const isLoading = useSlipStore((state) => state.isLoading);

  // -------------------------------------------------------------------------
  // Transform events into sections
  // -------------------------------------------------------------------------
  const sections = useMemo(() => {
    // Step 1: Group events by date
    // --------------------------------
    // We'll build a Map where:
    //   key = date string ("2025-01-16")
    //   value = array of events on that date
    const groupedByDate = new Map<string, SlipEvent[]>();

    for (const event of events) {
      const dateKey = getDateFromTimestamp(event.timestamp);

      // If this date doesn't exist in the map yet, create an empty array
      if (!groupedByDate.has(dateKey)) {
        groupedByDate.set(dateKey, []);
      }

      // Add this event to the date's array
      groupedByDate.get(dateKey)!.push(event);
    }

    // Step 2: Convert Map to array of sections
    // ----------------------------------------
    const sectionsArray: HistorySection[] = [];

    // Map.entries() gives us [key, value] pairs
    for (const [date, dateEvents] of groupedByDate.entries()) {
      sectionsArray.push({
        date: date,
        title: formatDateForDisplay(date), // "Today", "Yesterday", "Jan 14"
        data: dateEvents.sort((a, b) => {
          // Sort events within a day: NEWEST first
          // Why? Users care about recent events more
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        }),
      });
    }

    // Step 3: Sort sections by date (NEWEST first)
    // --------------------------------------------
    sectionsArray.sort((a, b) => {
      // String comparison works for "YYYY-MM-DD" format!
      // "2025-01-16" > "2025-01-15" is true
      return b.date.localeCompare(a.date);
    });

    return sectionsArray;
  }, [events]); // Only recalculate when events change

  // -------------------------------------------------------------------------
  // Return everything the screen needs
  // -------------------------------------------------------------------------
  return {
    sections,
    isEmpty: events.length === 0,
    isLoading,
  };
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
//   const { sections, isEmpty, isLoading } = useHistoryData();
//
//   // sections is ready for SectionList:
//   <SectionList
//     sections={sections}
//     keyExtractor={(item) => item.id}
//     renderItem={...}
//     renderSectionHeader={...}
//   />
//
// =============================================================================
