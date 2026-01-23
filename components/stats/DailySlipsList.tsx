// ============================================================================
// SLIP - DailySlipsList COMPONENT
// ============================================================================
// Shows a text-based list of daily slip counts for the selected range.
//
// WHY THIS COMPONENT?
//   - Users want to see the breakdown: "How many slips did I have each day?"
//   - Shows patterns at a glance (which days were bad?)
//   - "Over limit" highlighting provides subtle accountability
//
// DESIGN:
//   - Most recent day first (users care about recent data)
//   - Over-limit days get a warning color
//   - Simple, scannable format
//
// FILE LOCATION: components/stats/DailySlipsList.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DayCount } from "@/hooks/useStats";
import React from "react";
import { StyleSheet, View } from "react-native";

// =============================================================================
// PROPS
// =============================================================================

interface DailySlipsListProps {
  dailyCounts: DayCount[];
}

// =============================================================================
// THE COMPONENT
// =============================================================================

export function DailySlipsList({ dailyCounts }: DailySlipsListProps) {
  // Empty state
  if (dailyCounts.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyText}>
          No data for this period
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Section Header */}
      <ThemedText style={styles.sectionTitle}>Daily Breakdown</ThemedText>

      {/* The List */}
      <View style={styles.list}>
        {dailyCounts.map((day) => (
          <View
            key={day.date}
            style={[styles.row, day.isOverLimit && styles.rowOverLimit]}
          >
            {/* Date */}
            <ThemedText style={styles.date}>{day.displayDate}</ThemedText>

            {/* Count */}
            <ThemedText
              style={[styles.count, day.isOverLimit && styles.countOverLimit]}
            >
              {day.count} {day.count === 1 ? "slip" : "slips"}
            </ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.6,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  list: {
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  rowOverLimit: {
    backgroundColor: "rgba(239, 68, 68, 0.08)", // Light red tint
  },
  date: {
    fontSize: 15,
  },
  count: {
    fontSize: 15,
    fontWeight: "500",
  },
  countOverLimit: {
    color: "#ef4444", // Red
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.5,
    paddingVertical: 20,
  },
});

// =============================================================================
// USAGE
// =============================================================================
//
//   const stats = useStats(range);
//
//   <DailySlipsList dailyCounts={stats.dailyCounts} />
//
// =============================================================================
