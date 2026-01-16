// ============================================================================
// SLIP - useHaptics HOOK
// ============================================================================
// Haptics = vibration feedback when you interact with the app.
// It makes the app feel more responsive and "real".
//
// WHEN TO USE:
//   - Tap "I Slipped" → medium impact (confirmation)
//   - Undo → light impact (subtle acknowledgment)
//   - Error/Over limit → notification warning
//   - Success → notification success
//
// FILE LOCATION: hooks/useHaptics.ts
// ============================================================================

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * useHaptics - Haptic feedback functions
 *
 * WHY A HOOK?
 *   - Centralizes all haptic logic
 *   - Handles platform check (only iOS has good haptics)
 *   - Easy to disable haptics globally if needed
 */
export function useHaptics() {
  // -------------------------------------------------------------------------
  // Check if haptics should run
  // -------------------------------------------------------------------------
  // Haptics work best on iOS. Android support varies by device.
  // We still try on Android, but it might not work on all devices.

  const isHapticsSupported = Platform.OS === "ios" || Platform.OS === "android";

  // -------------------------------------------------------------------------
  // LIGHT IMPACT - Subtle feedback
  // -------------------------------------------------------------------------
  // Use for: undo, toggle switches, minor actions

  const lightImpact = async () => {
    if (!isHapticsSupported) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently fail - haptics are nice but not critical
      console.log("Haptics not available");
    }
  };

  // -------------------------------------------------------------------------
  // MEDIUM IMPACT - Standard feedback
  // -------------------------------------------------------------------------
  // Use for: main button taps, confirmations

  const mediumImpact = async () => {
    if (!isHapticsSupported) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log("Haptics not available");
    }
  };

  // -------------------------------------------------------------------------
  // HEAVY IMPACT - Strong feedback
  // -------------------------------------------------------------------------
  // Use for: important actions, emphasis

  const heavyImpact = async () => {
    if (!isHapticsSupported) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.log("Haptics not available");
    }
  };

  // -------------------------------------------------------------------------
  // SUCCESS NOTIFICATION - Positive feedback
  // -------------------------------------------------------------------------
  // Use for: successful actions, achievements

  const successNotification = async () => {
    if (!isHapticsSupported) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log("Haptics not available");
    }
  };

  // -------------------------------------------------------------------------
  // WARNING NOTIFICATION - Alert feedback
  // -------------------------------------------------------------------------
  // Use for: over limit, warnings

  const warningNotification = async () => {
    if (!isHapticsSupported) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.log("Haptics not available");
    }
  };

  // -------------------------------------------------------------------------
  // ERROR NOTIFICATION - Negative feedback
  // -------------------------------------------------------------------------
  // Use for: errors, failures

  const errorNotification = async () => {
    if (!isHapticsSupported) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.log("Haptics not available");
    }
  };

  // -------------------------------------------------------------------------
  // SELECTION - Very light tap
  // -------------------------------------------------------------------------
  // Use for: selecting items, scrolling through lists

  const selection = async () => {
    if (!isHapticsSupported) return;

    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.log("Haptics not available");
    }
  };

  // Return all the functions
  return {
    lightImpact,
    mediumImpact,
    heavyImpact,
    successNotification,
    warningNotification,
    errorNotification,
    selection,
  };
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
//   import { useHaptics } from '@/hooks/useHaptics';
//
//   function SlipButton() {
//     const { mediumImpact, warningNotification } = useHaptics();
//
//     const handlePress = () => {
//       if (isOverLimit) {
//         warningNotification(); // Buzz! You're over limit
//       } else {
//         mediumImpact();        // Normal tap feedback
//       }
//       addSlip();
//     };
//
//     return <Button onPress={handlePress} title="I Slipped" />;
//   }
//
// =============================================================================
