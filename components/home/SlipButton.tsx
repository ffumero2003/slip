// ============================================================================
// SLIP - SlipButton COMPONENT
// ============================================================================
// The BIG "I Slipped" button - the main action of the entire app.
//
// REQUIREMENTS (from spec):
//   - Big primary button (one-handed use)
//   - Immediate feedback (haptic + animation)
//   - Must be the most prominent thing on screen
//
// FILE LOCATION: components/home/SlipButton.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { useHaptics } from "@/hooks/useHaptics";
import { useToday } from "@/hooks/useToday";
import { useHabitName } from "@/stores/settingsStore";
import { useSlipStore } from "@/stores/slipStore";
import React, { useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * SlipButton - The main "I Slipped" button
 *
 * FEATURES:
 *   - Big, easy to tap
 *   - Haptic feedback on press
 *   - Scale animation on press
 *   - Changes color when over limit
 */
export function SlipButton() {
  // -------------------------------------------------------------------------
  // Get data and actions from stores/hooks
  // -------------------------------------------------------------------------

  // The function to add a slip
  const addSlip = useSlipStore((state) => state.addSlip);

  // Today's status (to know if over limit)
  const { isUnderLimit } = useToday();

  // Habit name for button text
  const habitName = useHabitName();

  // Haptic functions
  const { mediumImpact, warningNotification } = useHaptics();

  // -------------------------------------------------------------------------
  // Animation setup
  // -------------------------------------------------------------------------
  // We'll scale the button down slightly when pressed, then back up.
  // This gives tactile feedback that "something happened".

  // useRef persists the Animated.Value across re-renders
  // without causing re-renders itself (unlike useState)
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // -------------------------------------------------------------------------
  // Handle button press
  // -------------------------------------------------------------------------

  const handlePressIn = () => {
    // Scale down to 95% size
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true, // Better performance
    }).start();
  };

  const handlePressOut = () => {
    // Scale back to 100%
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3, // How bouncy (lower = more bounce)
      tension: 40, // How fast
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    // 1. Haptic feedback
    // Different feedback if over limit (warning) vs normal (medium)
    if (isUnderLimit) {
      mediumImpact();
    } else {
      warningNotification(); // Stronger buzz when over limit
    }

    // 2. Add the slip to storage
    await addSlip();

    // That's it! The store updates, which triggers re-renders,
    // which updates TodayStatus automatically.
  };

  // -------------------------------------------------------------------------
  // Button colors
  // -------------------------------------------------------------------------

  // Normal: nice primary color
  // Over limit: warning red
  const buttonColor = isUnderLimit ? "#3B82F6" : "#EF4444";

  // Pressed state is slightly darker
  const pressedColor = isUnderLimit ? "#2563EB" : "#DC2626";

  // -------------------------------------------------------------------------
  // Button text
  // -------------------------------------------------------------------------

  // If habit name is set: "I Slipped (vaping)"
  // If not set: just "I Slipped"
  const buttonText = habitName ? `I Slipped` : "I Slipped";

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      {/* Animated.View wraps the button to apply scale animation */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1} // We handle opacity ourselves via animation
        >
          <ThemedText style={styles.buttonText}>{buttonText}</ThemedText>

          {/* Show habit name below if set */}
          {habitName ? (
            <ThemedText style={styles.habitText}>({habitName})</ThemedText>
          ) : null}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    // Give the button area some breathing room
    paddingVertical: 10,
    alignItems: "center",
  },

  button: {
    // Make it BIG and easy to tap with one hand
    width: 200,
    height: 200,
    borderRadius: 100, // Perfect circle

    // Center the text inside
    justifyContent: "center",
    alignItems: "center",

    // Shadow for depth (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,

    // Shadow for depth (Android)
    elevation: 8,
  },

  buttonText: {
    color: "#FFFFFF", // White text on colored button
    fontSize: 24,
    fontWeight: "700",
  },

  habitText: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
});

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
//   import { SlipButton } from '@/components/home/SlipButton';
//
//   function HomeScreen() {
//     return (
//       <View>
//         <SlipButton />
//       </View>
//     );
//   }
//
// =============================================================================
