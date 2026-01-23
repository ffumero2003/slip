// ============================================================================
// SLIP - DayGroup COMPONENT
// ============================================================================
// The header for each date section in the history list.
//
// WHAT IT SHOWS:
//   - The date: "Today", "Yesterday", "Jan 14", etc.
//   - The count: "3 slips" (optional, adds context)
//
// WHY THIS COMPONENT?
//   - SectionList needs a `renderSectionHeader` function
//   - This component provides that header UI
//   - Keeps the section header logic separate from the main screen
//
// FILE LOCATION: components/history/DayGroup.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { HistorySection } from "@/hooks/useHistoryData";
import React from "react";
import { StyleSheet, View } from "react-native";

// =============================================================================
// PROPS
// =============================================================================

interface DayGroupProps {
  // The section data (title, date, data)
  section: HistorySection;
}

// =============================================================================
// THE COMPONENT
// =============================================================================

/**
 * DayGroup - Date header for a section
 *
 * DESIGN NOTES:
 *   - "Sticky" header effect comes from SectionList's `stickySectionHeadersEnabled`
 *   - Background color ensures text is readable when scrolling under it
 */
export function DayGroup({ section }: DayGroupProps) {
  const slipCount = section.data.length;

  return (
    <View style={styles.container}>
      {/* Date title */}
      <ThemedText style={styles.title}>{section.title}</ThemedText>

      {/* Slip count badge */}
      <ThemedText style={styles.count}>
        {slipCount} {slipCount === 1 ? "slip" : "slips"}
      </ThemedText>
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    // Opaque background is important for sticky headers
    // When the list scrolls, items pass "under" the header
    // Without an opaque background, you'd see the items through the header
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  count: {
    fontSize: 12,
    opacity: 0.5,
  },
});

// =============================================================================
// DARK MODE CONSIDERATION
// =============================================================================
//
// The hardcoded backgroundColor "#F5F5F5" won't look good in dark mode.
// For a quick fix, you could:
//
//   1. Use ThemedView instead of View
//   2. Or use useColorScheme() and set different colors:
//
//      const colorScheme = useColorScheme();
//      const bgColor = colorScheme === 'dark' ? '#222' : '#F5F5F5';
//
// For MVP, you can use the hardcoded color and improve later.
//
// =============================================================================
