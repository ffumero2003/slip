// ============================================================================
// SLIP - PatternInsights COMPONENT
// ============================================================================
// Shows detected patterns in the user's slip behavior.
//
// WHY THIS COMPONENT?
//   - The REAL value of tracking: discovering patterns
//   - "You slip most at 9-10 PM" → user can prepare for that time
//   - "Fridays are worst" → user knows to be extra careful on Fridays
//
// EDGE CASES:
//   - Not enough data → show "Need 3+ days to detect patterns"
//   - No clear pattern → show "Keep logging to reveal patterns"
//   - Has patterns → show the insights
//
// FILE LOCATION: components/stats/PatternInsights.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { StyleSheet, View } from "react-native";

// =============================================================================
// PROPS
// =============================================================================

interface PatternInsightsProps {
  peakHour: string | null; // "9–10 PM" or null
  peakDayOfWeek: string | null; // "Friday" or null
  hasEnoughData: boolean; // At least 3 days of data
  hasAnyData: boolean; // Any events at all
}

// =============================================================================
// THE COMPONENT
// =============================================================================

export function PatternInsights({
  peakHour,
  peakDayOfWeek,
  hasEnoughData,
  hasAnyData,
}: PatternInsightsProps) {
  // -------------------------------------------------------------------------
  // CASE 1: No data at all
  // -------------------------------------------------------------------------
  if (!hasAnyData) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.sectionTitle}>Patterns</ThemedText>
        <ThemedView style={styles.emptyCard}>
          <ThemedText style={styles.emptyText}>
            Start logging to discover your patterns
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  // -------------------------------------------------------------------------
  // CASE 2: Not enough data for patterns
  // -------------------------------------------------------------------------
  if (!hasEnoughData) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.sectionTitle}>Patterns</ThemedText>
        <ThemedView style={styles.emptyCard}>
          <ThemedText style={styles.emptyText}>
            Need 3+ days of data to detect patterns
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Keep logging to unlock insights
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  // -------------------------------------------------------------------------
  // CASE 3: Has data but no clear patterns
  // -------------------------------------------------------------------------
  if (!peakHour && !peakDayOfWeek) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.sectionTitle}>Patterns</ThemedText>
        <ThemedView style={styles.emptyCard}>
          <ThemedText style={styles.emptyText}>
            No clear patterns yet
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Keep logging to reveal trends
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  // -------------------------------------------------------------------------
  // CASE 4: Show detected patterns
  // -------------------------------------------------------------------------
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Patterns</ThemedText>

      <View style={styles.insightsContainer}>
        {/* Peak Hour Insight */}
        {peakHour && (
          <ThemedView
            style={styles.insightCard}
            lightColor="rgba(0, 0, 0, 0.03)"
            darkColor="rgba(255, 255, 255, 0.05)"
          >
            <ThemedText style={styles.insightLabel}>
              ⏰ Most common slip time
            </ThemedText>
            <ThemedText style={styles.insightValue}>{peakHour}</ThemedText>
          </ThemedView>
        )}

        {/* Peak Day Insight */}
        {peakDayOfWeek && (
          <ThemedView
            style={styles.insightCard}
            lightColor="rgba(0, 0, 0, 0.03)"
            darkColor="rgba(255, 255, 255, 0.05)"
          >
            <ThemedText style={styles.insightLabel}>
              📅 Most common slip day
            </ThemedText>
            <ThemedText style={styles.insightValue}>
              {peakDayOfWeek}s
            </ThemedText>
          </ThemedView>
        )}
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.6,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  insightLabel: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  emptyCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  emptyText: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 13,
    opacity: 0.4,
    marginTop: 4,
    textAlign: "center",
  },
});

// =============================================================================
// USAGE
// =============================================================================
//
//   const stats = useStats(range);
//
//   <PatternInsights
//     peakHour={stats.peakHour}
//     peakDayOfWeek={stats.peakDayOfWeek}
//     hasEnoughData={stats.hasEnoughDataForPatterns}
//     hasAnyData={stats.hasAnyData}
//   />
//
// =============================================================================
