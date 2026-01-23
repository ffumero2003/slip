// ============================================================================
// SLIP - TodayStatus COMPONENT
// ============================================================================
// Shows the user's current status for today:
//   - "3 / 5" (3 slips out of 5 limit)
//   - "On track" or "Over limit" badge
//   - Color changes based on status
//
// FILE LOCATION: components/home/TodayStatus.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useToday } from "@/hooks/useToday";
import { useHabitName } from "@/stores/settingsStore";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * TodayStatus - Shows today's slip count and status
 *
 * DISPLAYS:
 *   - Big number: current count
 *   - Smaller text: "/ limit"
 *   - Status badge: "On track" or "Over limit"
 *   - Habit name if set
 */
export function TodayStatus() {
  // -------------------------------------------------------------------------
  // Get data from hooks
  // -------------------------------------------------------------------------

  // Today's status (count, limit, isUnderLimit, remaining)
  const { count, limit, isUnderLimit, remaining } = useToday();

  // The habit name (e.g., "vaping")
  const habitName = useHabitName();

  // Light or dark mode?
  const colorScheme = useColorScheme() ?? "light";

  // -------------------------------------------------------------------------
  // Determine colors based on status
  // -------------------------------------------------------------------------

  // When over limit, we use warning colors
  // When under limit, we use success/normal colors
  const statusColor = isUnderLimit
    ? "#22C55E" // Green for "on track"
    : "#EF4444"; // Red for "over limit"

  // The big count number color
  const countColor = isUnderLimit
    ? Colors[colorScheme].text // Normal text color
    : "#EF4444"; // Red when over

  // -------------------------------------------------------------------------
  // Render the component
  // -------------------------------------------------------------------------

  return (
    <ThemedView style={styles.container}>
      {/* Habit name (if set) */}
      {habitName ? (
        <ThemedText style={styles.habitName}>{habitName}</ThemedText>
      ) : null}

      {/* Big count display: "3 / 5" */}
      <View style={styles.countContainer}>
        {/* Current count - BIG */}
        <ThemedText style={[styles.count, { color: countColor }]}>
          {count}
        </ThemedText>

        {/* Separator and limit - smaller */}
        <ThemedText style={styles.limit}>
          {" / "}
          {limit}
        </ThemedText>
      </View>

      {/* Status badge */}
      <View style={[styles.badge, { backgroundColor: statusColor + "20" }]}>
        {/* '20' = 12% opacity (hex). Makes a subtle background. */}
        <ThemedText style={[styles.badgeText, { color: statusColor }]}>
          {isUnderLimit ? "On track" : "Over limit"}
        </ThemedText>
      </View>

      {/* Remaining slips message (only show if under limit and remaining > 0) */}
      {isUnderLimit && remaining > 0 && (
        <ThemedText style={styles.remainingText}>
          {remaining} {remaining === 1 ? "slip" : "slips"} remaining today
        </ThemedText>
      )}
    </ThemedView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    // Center everything
    alignItems: "center",
    // Add vertical padding
    paddingVertical: 20,
  },

  habitName: {
    // Smaller text above the count
    fontSize: 16,
    opacity: 1,
    marginBottom: 8,
    textTransform: "capitalize", // "vaping" → "Vaping"
  },

  countContainer: {
    // Horizontal layout for "3 / 5"
    flexDirection: "row",
    alignItems: "center", // Align text at the bottom
  },

  count: {
    // The big number
    fontSize: 72,
    fontWeight: "700",
    lineHeight: 86, // Prevent text clipping
  },

  limit: {
    // The "/ 5" part
    fontSize: 32,
    fontWeight: "400",
    opacity: 0.5,
    lineHeight: 40, // Prevent text clipping
  },

  badge: {
    // The status pill/badge
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20, // Pill shape
    marginTop: 16,
  },

  badgeText: {
    fontSize: 14,
    fontWeight: "600",
  },

  remainingText: {
    // "2 slips remaining today"
    fontSize: 14,
    opacity: 0.6,
    marginTop: 12,
  },
});

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
//   import { TodayStatus } from '@/components/home/TodayStatus';
//
//   function HomeScreen() {
//     return (
//       <View>
//         <TodayStatus />
//         {/* Other components */}
//       </View>
//     );
//   }
//
// =============================================================================
