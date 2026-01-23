// ============================================================================
// SLIP - EmptyHistory COMPONENT
// ============================================================================
// Shown when the history list has no events.
//
// DESIGN PHILOSOPHY (from spec):
//   "Honest empty states - Don't show fake graphs with zeros"
//   "Show 'Start logging to reveal patterns'"
//
// This should feel encouraging, not sad or empty.
//
// FILE LOCATION: components/history/EmptyHistory.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { StyleSheet } from "react-native";

// =============================================================================
// THE COMPONENT
// =============================================================================

/**
 * EmptyHistory - Empty state for history screen
 *
 * WHY THIS MATTERS:
 *   - First-time users will see this
 *   - Should be encouraging, not discouraging
 *   - Guides them to the primary action (logging a slip)
 */
export function EmptyHistory() {
  return (
    <ThemedView style={styles.container}>
      {/* Icon/Emoji - adds visual interest */}
      <ThemedText style={styles.emoji}>📋</ThemedText>

      {/* Main message */}
      <ThemedText style={styles.title}>No slips logged yet</ThemedText>

      {/* Helpful subtext */}
      <ThemedText style={styles.subtitle}>
        When you log a slip, it'll appear here.{"\n"}
        Tap "I Slipped" on the Home tab to start.
      </ThemedText>
    </ThemedView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 20,
  },
});

// =============================================================================
// USAGE
// =============================================================================
//
//   if (isEmpty) {
//     return <EmptyHistory />;
//   }
//
// =============================================================================
