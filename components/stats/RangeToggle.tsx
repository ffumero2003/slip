// ============================================================================
// SLIP - RangeToggle COMPONENT
// ============================================================================
// A toggle button group to switch between 7-day and 30-day stats views.
//
// WHY THIS COMPONENT?
//   - Clean separation: toggle doesn't know about stats, just renders buttons
//   - Reusable: could be used elsewhere if needed
//   - Controlled: parent owns the state, this just renders
//
// PROPS:
//   - selectedRange: 7 | 30 (which one is active)
//   - onRangeChange: (range) => void (called when user taps)
//
// FILE LOCATION: components/stats/RangeToggle.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { STATS_RANGES } from "@/utils/constants";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

// =============================================================================
// PROPS
// =============================================================================

interface RangeToggleProps {
  selectedRange: number;
  onRangeChange: (range: number) => void;
}

// =============================================================================
// THE COMPONENT
// =============================================================================

export function RangeToggle({
  selectedRange,
  onRangeChange,
}: RangeToggleProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      {/* 7 Days Button */}
      <Pressable
        style={[
          styles.button,
          selectedRange === STATS_RANGES.WEEK && {
            backgroundColor: colors.tint,
          },
        ]}
        onPress={() => onRangeChange(STATS_RANGES.WEEK)}
      >
        <ThemedText
          style={[
            styles.buttonText,
            selectedRange === STATS_RANGES.WEEK && styles.buttonTextActive,
          ]}
        >
          7 Days
        </ThemedText>
      </Pressable>

      {/* 30 Days Button */}
      <Pressable
        style={[
          styles.button,
          selectedRange === STATS_RANGES.MONTH && {
            backgroundColor: colors.tint,
          },
        ]}
        onPress={() => onRangeChange(STATS_RANGES.MONTH)}
      >
        <ThemedText
          style={[
            styles.buttonText,
            selectedRange === STATS_RANGES.MONTH && styles.buttonTextActive,
          ]}
        >
          30 Days
        </ThemedText>
      </Pressable>
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  buttonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});

// =============================================================================
// USAGE
// =============================================================================
//
//   const [range, setRange] = useState(7);
//
//   <RangeToggle
//     selectedRange={range}
//     onRangeChange={setRange}
//   />
//
// =============================================================================
