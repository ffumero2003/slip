// ============================================================================
// SLIP - LimitSetting COMPONENT
// ============================================================================
// A number stepper for setting the daily slip limit.
//
// WHY STEPPER INSTEAD OF TEXT INPUT?
//   1. Can't enter invalid values (letters, symbols)
//   2. Easier to use with one thumb
//   3. Clear bounds (can't go below 1)
//   4. More "tappable" on mobile
//
// FILE LOCATION: components/settings/LimitSetting.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHaptics } from "@/hooks/useHaptics";
import { useDailyLimit, useSettingsStore } from "@/stores/settingsStore";
import { LIMIT_MAX, LIMIT_MIN } from "@/utils/constants";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// =============================================================================
// THE COMPONENT
// =============================================================================

/**
 * LimitSetting - Stepper for daily limit
 *
 * LAYOUT:
 *   ┌────────────────────────────────────┐
 *   │  Daily Limit                       │
 *   │  ┌───┐   ┌────────┐   ┌───┐       │
 *   │  │ - │   │   5    │   │ + │       │
 *   │  └───┘   └────────┘   └───┘       │
 *   │  Max slips per day before...      │
 *   └────────────────────────────────────┘
 */
export function LimitSetting() {
  // -------------------------------------------------------------------------
  // Get data and actions
  // -------------------------------------------------------------------------
  const currentLimit = useDailyLimit();
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const { selection } = useHaptics();

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  /**
   * Increment the limit by 1
   *
   * WHY CHECK MAX?
   *   Prevent going above LIMIT_MAX (99).
   *   Above that is unrealistic and could break UI.
   */
  const handleIncrement = () => {
    if (currentLimit < LIMIT_MAX) {
      selection(); // Haptic feedback
      updateSettings({ dailyLimit: currentLimit + 1 });
    }
  };

  /**
   * Decrement the limit by 1
   *
   * WHY CHECK MIN?
   *   Prevent going below LIMIT_MIN (1).
   *   A limit of 0 means they're already over limit with any slip.
   *   That's technically valid but discouraging for users.
   */
  const handleDecrement = () => {
    if (currentLimit > LIMIT_MIN) {
      selection(); // Haptic feedback
      updateSettings({ dailyLimit: currentLimit - 1 });
    }
  };

  // -------------------------------------------------------------------------
  // Determine button states
  // -------------------------------------------------------------------------
  const canDecrement = currentLimit > LIMIT_MIN;
  const canIncrement = currentLimit < LIMIT_MAX;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <ThemedView style={styles.container}>
      {/* Section Label */}
      <ThemedText style={styles.label}>Daily Limit</ThemedText>

      {/* Stepper Row */}
      <View style={styles.stepperRow}>
        {/* Decrement Button */}
        <TouchableOpacity
          onPress={handleDecrement}
          style={[styles.button, !canDecrement && styles.buttonDisabled]}
          disabled={!canDecrement}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[
              styles.buttonText,
              !canDecrement && styles.buttonTextDisabled,
            ]}
          >
            −
          </ThemedText>
        </TouchableOpacity>

        {/* Current Value Display */}
        <View style={styles.valueContainer}>
          <ThemedText style={styles.value}>{currentLimit}</ThemedText>
        </View>

        {/* Increment Button */}
        <TouchableOpacity
          onPress={handleIncrement}
          style={[styles.button, !canIncrement && styles.buttonDisabled]}
          disabled={!canIncrement}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[
              styles.buttonText,
              !canIncrement && styles.buttonTextDisabled,
            ]}
          >
            +
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Helper text */}
      <ThemedText style={styles.helperText}>
        Stay under {currentLimit} {currentLimit === 1 ? "slip" : "slips"} per
        day to keep your streak
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
    marginTop: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 32,
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
  valueContainer: {
    minWidth: 80,
    alignItems: "center",
    marginHorizontal: 20,
  },
  value: {
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 70,
  },
  helperText: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 12,
    textAlign: "center",
  },
});

// =============================================================================
// ALTERNATIVE: SLIDER
// =============================================================================
//
// You could use a Slider instead of +/- buttons:
//
//   <Slider
//     minimumValue={LIMIT_MIN}
//     maximumValue={LIMIT_MAX}
//     step={1}
//     value={currentLimit}
//     onValueChange={handleChange}
//   />
//
// WHY WE CHOSE STEPPER:
//   - More precise (easy to hit exact number)
//   - Clearer current value
//   - Better for small ranges (1-10 typical)
//   - Slider is better for large ranges (volume, brightness)
//
// =============================================================================
