// ============================================================================
// SLIP - QuickInsight COMPONENT
// ============================================================================
// Shows a quick insight about the user's patterns on the Home screen.
// Example: "Most common slip time: 9–10 PM"
//
// FILE LOCATION: components/home/QuickInsight.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSlipStore } from "@/stores/slipStore";
import { formatHourRange, getHourFromTimestamp } from "@/utils/date";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";

/**
 * QuickInsight - Shows pattern-based insight
 */
export function QuickInsight() {
  const events = useSlipStore((state) => state.events);

  // Calculate most common slip hour
  const insight = useMemo(() => {
    if (events.length < 3) return null;

    // Count slips by hour
    const hourCounts: Record<number, number> = {};
    events.forEach((event) => {
      const hour = getHourFromTimestamp(event.timestamp);
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Find hour with most slips
    let maxHour = 0;
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxHour = parseInt(hour, 10);
      }
    });

    if (maxCount < 2) return null;

    return { hour: maxHour, formatted: formatHourRange(maxHour) };
  }, [events]);

  // Not enough data
  if (events.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>
          Start logging to discover your patterns
        </ThemedText>
      </ThemedView>
    );
  }

  // No clear pattern yet
  if (!insight) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>
          Keep logging to reveal patterns
        </ThemedText>
      </ThemedView>
    );
  }

  // Show the insight
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>💡 Most common slip time</ThemedText>
      <ThemedText style={styles.insight}>{insight.formatted}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  text: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  insight: {
    fontSize: 18,
    fontWeight: "600",
  },
});
