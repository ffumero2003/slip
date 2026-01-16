// ============================================================================
// SLIP - HOME SCREEN
// ============================================================================
// This is the MAIN screen of SLIP - where users spend 90% of their time.
//
// WHAT IT DOES (from spec):
//   - Shows today's slip count + daily limit
//   - Big "I Slipped" button for fast logging
//   - Shows streak (days under limit)
//   - Quick insight about patterns
//   - Undo button (after slipping)
//
// LAYOUT (top to bottom):
//   1. TodayStatus - count and status
//   2. SlipButton - the main action
//   3. UndoButton - only shows when available
//   4. StreakCard - motivation
//   5. QuickInsight - pattern hint
//
// FILE LOCATION: app/(tabs)/index.tsx
// ============================================================================

import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

// Themed components (you already have these)
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

// Home screen components (the ones we just created)
import { QuickInsight } from "@/components/home/QuickInsight";
import { SlipButton } from "@/components/home/SlipButton";
import { StreakCard } from "@/components/home/StreakCard";
import { TodayStatus } from "@/components/home/TodayStatus";
import { UndoButton } from "@/components/home/UndoButton";

// Stores - to load data on mount
import { useSettingsStore } from "@/store/settingsStore";
import { useSlipStore } from "@/store/slipStore";

// =============================================================================
// THE HOME SCREEN COMPONENT
// =============================================================================

export default function HomeScreen() {
  // ---------------------------------------------------------------------------
  // Load data when screen mounts
  // ---------------------------------------------------------------------------

  // Get loading states and load functions from stores
  const isEventsLoading = useSlipStore((state) => state.isLoading);
  const loadEvents = useSlipStore((state) => state.loadEvents);

  const isSettingsLoading = useSettingsStore((state) => state.isLoading);
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  // useEffect runs ONCE when the component first mounts
  // This is where we load saved data from AsyncStorage
  useEffect(() => {
    // Load both events and settings when app starts
    loadEvents();
    loadSettings();
  }, []); // Empty array = only run once on mount

  // ---------------------------------------------------------------------------
  // Show loading spinner while data loads
  // ---------------------------------------------------------------------------

  // We need to wait for data to load before showing the UI
  // Otherwise we'd show "0 slips" then suddenly jump to the real number
  const isLoading = isEventsLoading || isSettingsLoading;

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        {/* ActivityIndicator = the spinning loading circle */}
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // ---------------------------------------------------------------------------
  // Main UI
  // ---------------------------------------------------------------------------

  return (
    // SafeAreaView = respects the notch/status bar on modern phones
    <ThemedView style={styles.container}>
      {/* ScrollView in case content is taller than screen */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================= */}
        {/* SECTION 1: Today's Status                                     */}
        {/* Shows: "3 / 5" and "On track" badge                          */}
        {/* ============================================================= */}
        <TodayStatus />

        {/* ============================================================= */}
        {/* SECTION 2: The Big Button                                     */}
        {/* This is THE main action of the entire app                    */}
        {/* ============================================================= */}
        <SlipButton />

        {/* ============================================================= */}
        {/* SECTION 3: Undo Button                                        */}
        {/* Only shows for 5 minutes after a slip                        */}
        {/* ============================================================= */}
        <UndoButton />

        {/* ============================================================= */}
        {/* SECTION 4: Streak Card                                        */}
        {/* Motivation: "🔥 5 days under limit"                          */}
        {/* ============================================================= */}
        <StreakCard />

        {/* ============================================================= */}
        {/* SECTION 5: Quick Insight                                      */}
        {/* Pattern hint: "Most common slip time: 9-10 PM"               */}
        {/* ============================================================= */}
        <QuickInsight />
      </ScrollView>
    </ThemedView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  // SafeAreaView needs to fill the screen
  safeArea: {
    flex: 1,
  },

  // Main container
  container: {
    flex: 1,
  },

  // ScrollView content
  scrollContent: {
    // Add padding at top and bottom
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Loading state
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
// 1. App opens → HomeScreen mounts
// 2. useEffect runs → loadEvents() and loadSettings() called
// 3. While loading → show spinner
// 4. Data loads → stores update → isLoading becomes false
// 5. Main UI renders with real data
//
// When user taps "I Slipped":
// 1. SlipButton's handlePress runs
// 2. addSlip() is called on the store
// 3. Store updates its events array
// 4. All components using store data re-render automatically
// 5. TodayStatus shows new count
// 6. UndoButton appears
// 7. StreakCard might update
//
// This is the magic of Zustand - change data in one place,
// all components watching that data update automatically!
//
// =============================================================================
