// ============================================================================
// SLIP - SummaryCards COMPONENT
// ============================================================================
// Displays the key summary statistics in a card grid.
//
// WHAT IT SHOWS:
//   - Total slips in the selected range
//   - Average slips per day
//   - Best day (lowest slips)
//   - Worst day (highest slips)
//   - Percentage of days under the daily limit
//
// WHY A GRID?
//   - Easy to scan at a glance
//   - Each metric is clearly separated
//   - Looks clean and professional
//
// FILE LOCATION: components/stats/SummaryCards.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DayCount } from "@/hooks/useStats";
import React from "react";
import { StyleSheet, View } from "react-native";

// =============================================================================
// PROPS
// =============================================================================

interface SummaryCardsProps {
  totalSlips: number;
  avgPerDay: number;
  bestDay: DayCount | null;
  worstDay: DayCount | null;
  daysUnderLimitPercent: number;
}

// =============================================================================
// THE COMPONENT
// =============================================================================

export function SummaryCards({
  totalSlips,
  avgPerDay,
  bestDay,
  worstDay,
  daysUnderLimitPercent,
}: SummaryCardsProps) {
  return (
    <View style={styles.container}>
      {/* Row 1: Total and Average */}
      <View style={styles.row}>
        <StatCard label="Total Slips" value={totalSlips.toString()} />
        <StatCard label="Avg / Day" value={avgPerDay.toFixed(1)} />
      </View>

      {/* Row 2: Best and Worst Day */}
      <View style={styles.row}>
        <StatCard
          label="Best Day"
          value={bestDay ? bestDay.count.toString() : "—"}
          subtitle={bestDay?.displayDate}
          variant="positive"
        />
        <StatCard
          label="Worst Day"
          value={worstDay ? worstDay.count.toString() : "—"}
          subtitle={worstDay?.displayDate}
          variant="negative"
        />
      </View>

      {/* Row 3: Days Under Limit (full width) */}
      <View style={styles.row}>
        <StatCard
          label="Days Under Limit"
          value={`${Math.round(daysUnderLimitPercent)}%`}
          fullWidth
        />
      </View>
    </View>
  );
}

// =============================================================================
// HELPER COMPONENT: Individual Stat Card
// =============================================================================

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  variant?: "default" | "positive" | "negative";
  fullWidth?: boolean;
}

function StatCard({
  label,
  value,
  subtitle,
  variant = "default",
  fullWidth = false,
}: StatCardProps) {
  return (
    <ThemedView
      style={[styles.card, fullWidth && styles.cardFullWidth]}
      lightColor="rgba(0, 0, 0, 0.03)"
      darkColor="rgba(255, 255, 255, 0.05)"
    >
      <ThemedText style={styles.cardLabel}>{label}</ThemedText>
      <ThemedText
        style={[
          styles.cardValue,
          variant === "positive" && styles.cardValuePositive,
          variant === "negative" && styles.cardValueNegative,
        ]}
      >
        {value}
      </ThemedText>
      {subtitle && (
        <ThemedText style={styles.cardSubtitle}>{subtitle}</ThemedText>
      )}
    </ThemedView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cardFullWidth: {
    flex: undefined,
    width: "100%",
  },
  cardLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
  },
  cardValuePositive: {
    color: "#22c55e", // Green
  },
  cardValueNegative: {
    color: "#ef4444", // Red
  },
  cardSubtitle: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 2,
  },
});

// =============================================================================
// USAGE
// =============================================================================
//
//   const stats = useStats(range);
//
//   <SummaryCards
//     totalSlips={stats.totalSlips}
//     avgPerDay={stats.avgPerDay}
//     bestDay={stats.bestDay}
//     worstDay={stats.worstDay}
//     daysUnderLimitPercent={stats.daysUnderLimitPercent}
//   />
//
// =============================================================================
