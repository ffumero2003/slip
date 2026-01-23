// ============================================================================
// SLIP - HISTORY SCREEN
// ============================================================================
// The accountability and audit log for all slip events.
//
// PURPOSE (from spec):
//   "Accountability + editing mistakes + building trust"
//
// WHAT IT SHOWS:
//   - All slips grouped by date
//   - Most recent dates first
//   - Delete functionality for each slip
//   - Empty state when no slips logged
//
// KEY DECISIONS:
//   1. SectionList over FlatList (better for grouped data)
//   2. Sticky headers (date stays visible while scrolling)
//   3. Simple delete with confirmation (no swipe-to-delete for MVP)
//
// FILE LOCATION: app/(tabs)/history.tsx
// ============================================================================

import React from "react";
import { ActivityIndicator, SectionList, StyleSheet } from "react-native";

// Themed components
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

// History components
import { DayGroup } from "@/components/history/DayGroup";
import { EmptyHistory } from "@/components/history/EmptyHistory";
import { SlipEventItem } from "@/components/history/SlipEventItem";

// Hooks
import { HistorySection, useHistoryData } from "@/hooks/useHistoryData";

// =============================================================================
// THE SCREEN COMPONENT
// =============================================================================

export default function HistoryScreen() {
  // -------------------------------------------------------------------------
  // Get data from our custom hook
  // -------------------------------------------------------------------------
  const { sections, isEmpty, isLoading } = useHistoryData();

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading history...</ThemedText>
      </ThemedView>
    );
  }

  // -------------------------------------------------------------------------
  // Empty state
  // -------------------------------------------------------------------------
  if (isEmpty) {
    return <EmptyHistory />;
  }

  // -------------------------------------------------------------------------
  // Main list
  // -------------------------------------------------------------------------
  return (
    <ThemedView style={styles.container}>
      {/*
        SECTIONLIST EXPLAINED:
        ----------------------
        - sections: Array of { title, data } objects
        - keyExtractor: How to uniquely identify each item (for React optimization)
        - renderItem: How to render each slip event
        - renderSectionHeader: How to render each date header
        - stickySectionHeadersEnabled: Headers stick to top while scrolling
      */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SlipEventItem event={item} />}
        renderSectionHeader={({ section }) => (
          <DayGroup section={section as HistorySection} />
        )}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    paddingBottom: 100, // Space for tab bar
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
// 1. Screen mounts
// 2. useHistoryData() gets events from store and transforms to sections
// 3. If loading → show spinner
// 4. If empty → show EmptyHistory component
// 5. Otherwise → render SectionList with sections
//
// When user deletes a slip:
// 1. SlipEventItem calls deleteSlip(id) on the store
// 2. Store removes the event and saves to storage
// 3. useHistoryData() sees events changed, recalculates sections
// 4. SectionList re-renders with updated data
// 5. If last slip deleted → isEmpty becomes true → EmptyHistory shows
//
// The beauty of React + Zustand: everything stays in sync automatically!
//
// =============================================================================
