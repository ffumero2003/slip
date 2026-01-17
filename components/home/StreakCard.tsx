// ============================================================================
// SLIP - StreakCard COMPONENT
// ============================================================================
// Shows the user's current streak in a nice card format.
//
// REMEMBER: Streak = consecutive days UNDER the limit (not days with 0 slips)
// This is important for keeping users motivated!
//
// FILE LOCATION: components/home/StreakCard.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useStreak } from "@/hooks/useStreak";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * StreakCard - Displays the current streak
 *
 * SHOWS:
 *   - 🔥 Fire emoji (motivation!)
 *   - Current streak number
 *   - "days under limit" label
 *   - Best streak (for extra motivation)
 */
export function StreakCard() {
  // Get streak data from our hook
  const { current, best } = useStreak();

  // For theming
  const colorScheme = useColorScheme() ?? "light";

  // Card background color based on theme
  const cardBackground =
    colorScheme === "dark"
      ? "rgba(255, 255, 255, 0.05)" // Subtle light on dark
      : "rgba(0, 0, 0, 0.03)"; // Subtle dark on light

  // Streak color - more green as streak gets higher
  const getStreakColor = (streak: number): string => {
    if (streak >= 7) return "#22C55E"; // Green for 7+ days
    if (streak >= 3) return "#84CC16"; // Light green for 3-6 days
    return "#EAB308"; // Yellow for 0-2 days
  };

  const streakColor = getStreakColor(current);

  return (
    <ThemedView style={[styles.card, { backgroundColor: cardBackground }]}>
      {/* Top row: emoji + streak number */}
      <View style={styles.mainRow}>
        {/* Fire emoji - gets bigger with longer streaks */}
        <ThemedText style={styles.emoji}>🔥</ThemedText>

        {/* Streak number */}
        <ThemedText style={[styles.streakNumber, { color: streakColor }]}>
          {current}
        </ThemedText>
      </View>

      {/* Label: "days under limit" */}
      <ThemedText style={styles.label}>
        {current === 1 ? "day" : "days"} under limit
      </ThemedText>

      {/* Best streak (only show if there is one and it's different from current) */}
      {best > 0 && best > current && (
        <ThemedText style={styles.bestStreak}>Best: {best} days</ThemedText>
      )}

      {/* Celebration message for milestones */}
      {current >= 7 && (
        <ThemedText style={styles.milestone}>🎉 One week strong!</ThemedText>
      )}
    </ThemedView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  card: {
    // Card container
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,

    // Center content
    alignItems: "center",
  },

  mainRow: {
    // Emoji and number side by side
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  emoji: {
    fontSize: 32,
  },

  streakNumber: {
    fontSize: 48,
    fontWeight: "700",
  },

  label: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },

  bestStreak: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 8,
  },

  milestone: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: "600",
  },
});

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
//   import { StreakCard } from '@/components/home/StreakCard';
//
//   function HomeScreen() {
//     return (
//       <View>
//         <StreakCard />
//       </View>
//     );
//   }
//
// =============================================================================
