// ============================================================================
// SLIP - HabitInput COMPONENT
// ============================================================================
// A text input for setting the habit name (e.g., "vaping", "cigarettes").
//
// DESIGN DECISIONS:
//   1. Auto-save on blur (no Save button needed)
//   2. Show placeholder examples to guide users
//   3. Limit character count to prevent UI issues
//   4. Trim whitespace before saving
//
// WHY NO SAVE BUTTON?
//   Modern mobile UX pattern. iOS Settings works this way.
//   Users expect changes to "just save" on mobile.
//
// FILE LOCATION: components/settings/HabitInput.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useHabitName, useSettingsStore } from "@/stores/settingsStore";
import { HABIT_NAME_MAX_LENGTH } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

// =============================================================================
// THE COMPONENT
// =============================================================================

/**
 * HabitInput - Text field for naming the habit
 *
 * HOW IT WORKS:
 *   1. Load current habit name from store
 *   2. User types in the input
 *   3. When they tap away (blur), we save to store
 *   4. Store saves to AsyncStorage automatically
 */
export function HabitInput() {
  // -------------------------------------------------------------------------
  // Get data and actions from store
  // -------------------------------------------------------------------------
  const currentHabitName = useHabitName();
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  // Get color scheme for styling
  const colorScheme = useColorScheme() ?? "light";

  // -------------------------------------------------------------------------
  // Local state for the input
  // -------------------------------------------------------------------------
  // WHY LOCAL STATE?
  //   We don't want to save to storage on EVERY keystroke.
  //   That would be slow and wasteful.
  //   Instead, we track local changes and save on blur.
  const [inputValue, setInputValue] = useState(currentHabitName);

  // -------------------------------------------------------------------------
  // Sync local state when store changes
  // -------------------------------------------------------------------------
  // WHY THIS EFFECT?
  //   If settings are reset elsewhere (e.g., DataActions),
  //   we need to update our local state to reflect that.
  useEffect(() => {
    setInputValue(currentHabitName);
  }, [currentHabitName]);

  // -------------------------------------------------------------------------
  // Save when input loses focus
  // -------------------------------------------------------------------------
  const handleBlur = () => {
    // Trim whitespace from start and end
    const trimmedValue = inputValue.trim();

    // Only save if value actually changed
    if (trimmedValue !== currentHabitName) {
      updateSettings({ habitName: trimmedValue });
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <ThemedView style={styles.container}>
      {/* Section Label */}
      <ThemedText style={styles.label}>What are you controlling?</ThemedText>

      {/* The Input Field */}
      <TextInput
        style={[
          styles.input,
          {
            color: Colors[colorScheme].text,
            backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5",
          },
        ]}
        value={inputValue}
        onChangeText={setInputValue}
        onBlur={handleBlur}
        placeholder="e.g., vaping, cigarettes, junk food..."
        placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
        maxLength={HABIT_NAME_MAX_LENGTH}
        autoCapitalize="none" // User types lowercase, we capitalize in display
        autoCorrect={false}
        returnKeyType="done"
      />

      {/* Helper text */}
      <ThemedText style={styles.helperText}>
        This will appear in the app as "I slipped ({inputValue || "habit"})"
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
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  helperText: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 8,
    marginLeft: 4,
  },
});

// =============================================================================
// WHY THIS PATTERN?
// =============================================================================
//
// LOCAL STATE + SAVE ON BLUR is a common pattern for form inputs:
//
//   1. User types → local state updates (fast, no network/storage calls)
//   2. User taps away → blur fires → save to store
//   3. Store saves to AsyncStorage → persisted
//
// Alternative patterns and why we didn't use them:
//
//   - DEBOUNCE: Save after user stops typing for 500ms
//     Good for search, but confusing for settings (when did it save?)
//
//   - SAVE BUTTON: Explicit "Save" tap required
//     Old-school pattern, feels clunky on mobile
//
//   - SAVE ON EVERY KEYSTROKE: Immediate save
//     Wasteful, slow, bad UX
//
// =============================================================================
