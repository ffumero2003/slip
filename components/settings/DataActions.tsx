// ============================================================================
// SLIP - DataActions COMPONENT
// ============================================================================
// Dangerous data operations: reset all data.
//
// DESIGN PRINCIPLES:
//   1. FRICTION IS INTENTIONAL - We WANT it to be hard to reset
//   2. Visual warning (red) signals danger
//   3. Two-step confirmation prevents accidents
//   4. Clear language ("Delete All Data" not "Reset")
//
// WHY THIS COMPONENT?
//   - Isolates dangerous operations from other settings
//   - Makes it easy to add more data actions later (export, backup)
//   - Keeps the confirmation logic self-contained
//
// FILE LOCATION: components/settings/DataActions.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHaptics } from "@/hooks/useHaptics";
import { useSettingsStore } from "@/stores/settingsStore";
import { useSlipStore } from "@/stores/slipStore";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

// =============================================================================
// THE COMPONENT
// =============================================================================

/**
 * DataActions - Reset and export data controls
 *
 * WHAT IT DOES:
 *   - "Reset All Data" button with double confirmation
 *   - Clears both events AND settings
 *   - Future: Could add export functionality
 */
export function DataActions() {
  // -------------------------------------------------------------------------
  // Get store actions
  // -------------------------------------------------------------------------
  const clearAllEvents = useSlipStore((state) => state.clearAllEvents);
  const resetSettings = useSettingsStore((state) => state.resetSettings);

  // Haptics for feedback
  const { warningNotification } = useHaptics();

  // -------------------------------------------------------------------------
  // Handle reset with DOUBLE confirmation
  // -------------------------------------------------------------------------
  /**
   * WHY DOUBLE CONFIRMATION?
   *   This is the most destructive action in the app.
   *   All slip history will be lost FOREVER.
   *   We want users to be REALLY sure.
   *
   * FLOW:
   *   1. User taps "Reset All Data"
   *   2. First alert: "Are you sure?"
   *   3. User taps "Reset"
   *   4. Second alert: "This cannot be undone. Delete everything?"
   *   5. User taps "Delete Everything"
   *   6. Data is cleared
   *
   * ALTERNATIVE: Single confirmation with scary text
   *   Some apps do this. Our approach is safer for new users
   *   who might tap without reading.
   */
  const handleReset = () => {
    // First confirmation
    Alert.alert(
      "Reset All Data?",
      "This will permanently delete all your slips and reset settings to defaults.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: showSecondConfirmation,
        },
      ]
    );
  };

  const showSecondConfirmation = () => {
    // Second confirmation - even scarier
    Alert.alert(
      "Are you absolutely sure?",
      "All slip history will be lost forever. This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: performReset,
        },
      ]
    );
  };

  const performReset = async () => {
    // Give haptic warning feedback
    warningNotification();

    // Clear both stores
    await clearAllEvents();
    await resetSettings();

    // Show success message
    Alert.alert(
      "Data Reset",
      "All data has been cleared. You're starting fresh!",
      [{ text: "OK" }]
    );
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <ThemedView style={styles.container}>
      {/* Section Label */}
      <ThemedText style={styles.label}>Data</ThemedText>

      {/* Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleReset}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.resetButtonText}>Reset All Data</ThemedText>
      </TouchableOpacity>

      {/* Warning text */}
      <ThemedText style={styles.warningText}>
        This will delete all your slip history and reset settings.
      </ThemedText>
    </ThemedView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 48, // Extra space - separate from other settings
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  resetButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)", // Light red background
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    // Red border adds to the "danger" feel
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  resetButtonText: {
    color: "#EF4444", // Red text
    fontSize: 16,
    fontWeight: "600",
  },
  warningText: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 8,
    textAlign: "center",
  },
});

// =============================================================================
// FUTURE ENHANCEMENTS
// =============================================================================
//
// 1. EXPORT DATA:
//    Add a button to export all slip data as JSON or CSV.
//    Useful for users who want to analyze their data.
//
//    const handleExport = async () => {
//      const events = useSlipStore.getState().events;
//      const settings = useSettingsStore.getState().settings;
//      const data = JSON.stringify({ events, settings }, null, 2);
//
//      // Use expo-sharing or expo-file-system to save/share
//      await Sharing.shareAsync(dataUri);
//    };
//
// 2. IMPORT DATA:
//    Restore from a backup. Tricky because you need to validate
//    the imported data structure.
//
// 3. SELECTIVE RESET:
//    - "Clear history only" (keep settings)
//    - "Reset settings only" (keep history)
//
// For MVP, just "Reset All" is enough.
//
