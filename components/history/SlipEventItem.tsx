// ============================================================================
// SLIP - SlipEventItem COMPONENT
// ============================================================================
// Displays one slip event in the history list.
//
// WHAT IT SHOWS:
//   - The time the slip happened ("9:14 PM")
//   - A delete button (trash icon or X)
//
// INTERACTIONS:
//   - Tap delete → removes the slip from storage
//   - Haptic feedback confirms the action
//
// FILE LOCATION: components/history/SlipEventItem.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHaptics } from "@/hooks/useHaptics";
import { useSlipStore } from "@/stores/slipStore";
import { SlipEvent } from "@/types";
import { formatTime } from "@/utils/date";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

// =============================================================================
// PROPS
// =============================================================================

interface SlipEventItemProps {
  // The slip event to display
  event: SlipEvent;
}

// =============================================================================
// THE COMPONENT
// =============================================================================

/**
 * SlipEventItem - One row in the history list
 *
 * WHY SEPARATE COMPONENT?
 *   1. Keeps the list code clean
 *   2. Each item manages its own delete logic
 *   3. React can optimize re-renders (only re-render changed items)
 */
export function SlipEventItem({ event }: SlipEventItemProps) {
  // -------------------------------------------------------------------------
  // Get the delete action from the store
  // -------------------------------------------------------------------------
  const deleteSlip = useSlipStore((state) => state.deleteSlip);

  // Haptic feedback hook
  const { lightImpact } = useHaptics();

  // -------------------------------------------------------------------------
  // Handle delete with confirmation
  // -------------------------------------------------------------------------
  /**
   * WHY CONFIRMATION?
   *   - Prevents accidental deletes
   *   - This is destructive (can't undo)
   *   - Follows mobile UX best practices
   *
   * OPTIONAL: You could skip the alert for a faster UX, but then
   * you'd want a way to undo (like a toast with "Undo" button).
   * For MVP, the alert is simpler and safer.
   */
  const handleDelete = () => {
    Alert.alert(
      "Delete Slip?",
      "This will permanently remove this slip from your history.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            lightImpact(); // Tactile confirmation
            deleteSlip(event.id);
          },
        },
      ]
    );
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <ThemedView style={styles.container}>
      {/* Time display */}
      <ThemedText style={styles.time}>{formatTime(event.timestamp)}</ThemedText>

      {/* Delete button */}
      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        // hitSlop expands the touchable area without changing visual size
        // Makes it easier to tap on small targets
      >
        <ThemedText style={styles.deleteText}>×</ThemedText>
      </TouchableOpacity>
    </ThemedView>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    // Subtle separator between items
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  time: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 24,
    color: "#EF4444", // Red - universal "delete" color
    fontWeight: "300",
    lineHeight: 24,
  },
});

// =============================================================================
// USAGE
// =============================================================================
//
//   <SlipEventItem event={slipEvent} />
//
// =============================================================================
