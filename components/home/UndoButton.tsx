// ============================================================================
// SLIP - UndoButton COMPONENT
// ============================================================================
// Allows the user to undo their last slip (within 5 minutes).
//
// WHY UNDO?
//   - Accidental taps happen
//   - User might change their mind
//   - Builds trust (you can fix mistakes)
//
// RULES:
//   - Only shows if there's a recent slip to undo
//   - Disappears after 5 minutes (UNDO_WINDOW_MS)
//   - Can only undo ONCE (then it's gone)
//
// FILE LOCATION: components/home/UndoButton.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { useHaptics } from "@/hooks/useHaptics";
import { useSlipStore } from "@/stores/slipStore";
import { UNDO_WINDOW_MS } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

/**
 * UndoButton - Shows a button to undo the last slip
 *
 * Only appears when:
 *   1. There's a last slip to undo
 *   2. It's within the undo window (5 minutes)
 */
export function UndoButton() {
  // -------------------------------------------------------------------------
  // Store data
  // -------------------------------------------------------------------------

  // Get the last slip info and undo function
  const lastSlipId = useSlipStore((state) => state.lastSlipId);
  const lastSlipTime = useSlipStore((state) => state.lastSlipTime);
  const undoLastSlip = useSlipStore((state) => state.undoLastSlip);

  // Haptics
  const { lightImpact } = useHaptics();

  // -------------------------------------------------------------------------
  // Local state
  // -------------------------------------------------------------------------

  // Track if we're within the undo window
  const [canUndo, setCanUndo] = useState(false);

  // Track remaining time for display
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Animation for fading in/out
  const [fadeAnim] = useState(new Animated.Value(0));

  // -------------------------------------------------------------------------
  // Effect: Check if we can undo and update timer
  // -------------------------------------------------------------------------

  useEffect(() => {
    // If no last slip, can't undo
    if (!lastSlipId || !lastSlipTime) {
      setCanUndo(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return;
    }

    // Calculate time remaining
    const updateTimer = () => {
      const elapsed = Date.now() - lastSlipTime;
      const remaining = UNDO_WINDOW_MS - elapsed;

      if (remaining <= 0) {
        // Time's up! Can't undo anymore
        setCanUndo(false);
        setRemainingSeconds(0);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        // Still time left
        setCanUndo(true);
        setRemainingSeconds(Math.ceil(remaining / 1000));

        // Fade in if not already visible
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    };

    // Run immediately
    updateTimer();

    // Then update every second
    const interval = setInterval(updateTimer, 1000);

    // Cleanup: stop the interval when component unmounts or deps change
    return () => clearInterval(interval);
  }, [lastSlipId, lastSlipTime, fadeAnim]);

  // -------------------------------------------------------------------------
  // Handle undo press
  // -------------------------------------------------------------------------

  const handleUndo = async () => {
    // Haptic feedback
    lightImpact();

    // Try to undo
    const success = await undoLastSlip();

    if (success) {
      // Undo worked! The store will update and this button will disappear
      // (because lastSlipId will be null)
    } else {
      // Undo failed (probably time expired)
      setCanUndo(false);
    }
  };

  // -------------------------------------------------------------------------
  // Format remaining time
  // -------------------------------------------------------------------------

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return `${secs}s`;
  };

  // -------------------------------------------------------------------------
  // Don't render if can't undo
  // -------------------------------------------------------------------------

  if (!canUndo) {
    return null;
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleUndo}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.buttonText}>Undo</ThemedText>
        <ThemedText style={styles.timerText}>
          ({formatTime(remainingSeconds)})
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 8,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    gap: 4,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },

  timerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
//   import { UndoButton } from '@/components/home/UndoButton';
//
//   function HomeScreen() {
//     return (
//       <View>
//         <SlipButton />
//         <UndoButton />  {/* Shows below the slip button when available */}
//       </View>
//     );
//   }
//
// =============================================================================
