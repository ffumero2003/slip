// ============================================================================
// SLIP - SETTINGS SCREEN
// ============================================================================
// Where users configure their rules. Set once, obey everywhere.
//
// PURPOSE (from spec):
//   "Users set the rules once; app obeys."
//
// LAYOUT (top to bottom):
//   1. HabitInput      - What are you controlling?
//   2. LimitSetting    - Daily slip limit
//   3. ReminderSetting - Daily notification
//   4. DataActions     - Reset data (danger zone)
//
// DESIGN DECISIONS:
//   1. ScrollView (not FlatList) - Few items, static layout
//   2. No "Save" button - Changes auto-save (modern mobile UX)
//   3. DataActions at bottom - Harder to accidentally find
//
// FILE LOCATION: app/(tabs)/settings.tsx
// ============================================================================

import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

// Themed components
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

// Settings components
import { DataActions } from "@/components/settings/DataActions";
import { HabitInput } from "@/components/settings/HabitInput";
import { LimitSetting } from "@/components/settings/LimitSetting";
import { ReminderSetting } from "@/components/settings/ReminderSetting";

// Stores
import { useSettingsStore } from "@/stores/settingsStore";

// =============================================================================
// THE SCREEN COMPONENT
// =============================================================================

export default function SettingsScreen() {
  // -------------------------------------------------------------------------
  // Load settings on mount
  // -------------------------------------------------------------------------
  const isLoading = useSettingsStore((state) => state.isLoading);
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading settings...</ThemedText>
      </ThemedView>
    );
  }

  // -------------------------------------------------------------------------
  // Main UI
  // -------------------------------------------------------------------------
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        // Dismiss keyboard when scrolling
        keyboardShouldPersistTaps="handled"
      >
        {/* ============================================================= */}
        {/* SECTION 1: Habit Name                                         */}
        {/* What bad habit are they tracking?                            */}
        {/* ============================================================= */}
        <HabitInput />

        {/* ============================================================= */}
        {/* SECTION 2: Daily Limit                                        */}
        {/* How many slips before "over limit"?                          */}
        {/* ============================================================= */}
        <LimitSetting />

        {/* ============================================================= */}
        {/* SECTION 3: Reminder                                           */}
        {/* Daily notification settings                                   */}
        {/* ============================================================= */}
        <ReminderSetting />

        {/* ============================================================= */}
        {/* SECTION 4: Data Actions (Danger Zone)                         */}
        {/* Reset all data - intentionally at bottom                     */}
        {/* ============================================================= */}
        <DataActions />

        {/* ============================================================= */}
        {/* Footer spacer                                                 */}
        {/* Extra space at bottom for comfortable scrolling              */}
        {/* ============================================================= */}
        <ThemedView style={styles.footer} />
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
    paddingBottom: 40,
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
  footer: {
    height: 100, // Extra space at bottom for tab bar
  },
});

// =============================================================================
// HOW IT ALL WORKS TOGETHER
// =============================================================================
//
// 1. User opens Settings tab
// 2. SettingsScreen mounts
// 3. useEffect calls loadSettings()
// 4. While loading → show spinner
// 5. Settings load → isLoading becomes false
// 6. Main UI renders with 4 setting components
//
// When user changes a setting:
// 1. Component (e.g., HabitInput) updates local state
// 2. On blur/change, calls updateSettings()
// 3. Store saves to AsyncStorage
// 4. Other screens using that setting auto-update
//
// Example: User changes daily limit from 3 to 5
// 1. LimitSetting calls updateSettings({ dailyLimit: 5 })
// 2. settingsStore updates settings.dailyLimit = 5
// 3. Home screen's TodayStatus re-renders with new limit
// 4. Stats calculations use new limit
// 5. All in sync, no manual refresh needed!
//
// =============================================================================
