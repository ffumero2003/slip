// ============================================================================
// SLIP - STATS SCREEN
// ============================================================================
// This screen shows trends and patterns in the user's slip behavior.
//
// PURPOSE (from spec):
//   "Show trends and patterns, not vanity metrics."
//
// WHAT IT SHOWS:
//   - Range toggle (7 days / 30 days)
//   - Summary cards (total, avg, best, worst, % under limit)
//   - Daily breakdown list
//   - Pattern insights (peak hour, peak day)
//
// DATA FLOW:
//   1. User selects range (7 or 30 days)
//   2. useStats(range) computes all metrics
//   3. Components receive data as props
//   4. Change range → everything updates automatically
//
// FILE LOCATION: app/(tabs)/stats.tsx
// ============================================================================

import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

// Themed components
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

// Stats components
import { DailySlipsList } from "@/components/stats/DailySlipsList";
import { PatternInsights } from "@/components/stats/PatternInsights";
import { RangeToggle } from "@/components/stats/RangeToggle";
import { SummaryCards } from "@/components/stats/SummaryCards";

// Hooks and stores
import { useStats } from "@/hooks/useStats";
import { useSlipStore } from "@/stores/slipStore";
import { STATS_RANGES } from "@/utils/constants";

// =============================================================================
// THE SCREEN COMPONENT
// =============================================================================

export default function StatsScreen() {
  // ---------------------------------------------------------------------------
  // STATE: Selected range (7 or 30 days)
  // ---------------------------------------------------------------------------
  const [selectedRange, setSelectedRange] = useState(STATS_RANGES.WEEK);

  // ---------------------------------------------------------------------------
  // DATA: Get computed stats from our hook
  // ---------------------------------------------------------------------------
  const stats = useStats(selectedRange);

  // ---------------------------------------------------------------------------
  // LOADING: Check if stores are still loading
  // ---------------------------------------------------------------------------
  const isLoading = useSlipStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading stats...</ThemedText>
      </ThemedView>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================= */}
        {/* SECTION 1: Range Toggle                                       */}
        {/* Switch between 7-day and 30-day views                        */}
        {/* ============================================================= */}
        <RangeToggle
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />

        {/* ============================================================= */}
        {/* SECTION 2: Summary Cards                                      */}
        {/* Key metrics at a glance                                       */}
        {/* ============================================================= */}
        <SummaryCards
          totalSlips={stats.totalSlips}
          avgPerDay={stats.avgPerDay}
          bestDay={stats.bestDay}
          worstDay={stats.worstDay}
          daysUnderLimitPercent={stats.daysUnderLimitPercent}
        />

        {/* ============================================================= */}
        {/* SECTION 3: Daily Breakdown                                    */}
        {/* Per-day slip counts                                          */}
        {/* ============================================================= */}
        <DailySlipsList dailyCounts={stats.dailyCounts} />

        {/* ============================================================= */}
        {/* SECTION 4: Pattern Insights                                   */}
        {/* Peak time and day patterns                                   */}
        {/* ============================================================= */}
        <PatternInsights
          peakHour={stats.peakHour}
          peakDayOfWeek={stats.peakDayOfWeek}
          hasEnoughData={stats.hasEnoughDataForPatterns}
          hasAnyData={stats.hasAnyData}
        />
      </ScrollView>
    </ThemedView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.6,
  },
});

// =============================================================================
// HOW IT ALL WORKS TOGETHER
// =============================================================================
//
// 1. Screen mounts with selectedRange = 7
// 2. useStats(7) computes stats for last 7 days
// 3. Components render with that data
//
// When user taps "30 Days":
// 1. setSelectedRange(30) is called
// 2. Component re-renders
// 3. useStats(30) runs (useMemo recalculates because range changed)
// 4. All components receive new data and update
//
// The beauty: changing one number (range) cascades through everything
// automatically thanks to React's reactivity and our useStats hook.
//
// =============================================================================
