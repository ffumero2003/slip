// ============================================================================
// SLIP - ReminderSetting COMPONENT
// ============================================================================
// Toggle switch for daily reminder + time picker.
//
// NOTIFICATION FLOW:
//   1. User enables reminder → schedule notification at reminderTime
//   2. User changes time → cancel old, schedule new
//   3. User disables → cancel notification
//
// MVP NOTE:
//   Full notification scheduling requires expo-notifications setup.
//   This component includes the structure; actual scheduling is simplified.
//   Enable full notifications after core app is working.
//
// FILE LOCATION: components/settings/ReminderSetting.tsx
// ============================================================================

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHaptics } from "@/hooks/useHaptics";
import {
  useReminderEnabled,
  useReminderTime,
  useSettingsStore,
} from "@/stores/settingsStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

// =============================================================================
// HELPER: Convert "HH:mm" to Date object
// =============================================================================

/**
 * WHY THIS FUNCTION?
 *   DateTimePicker works with Date objects, but we store time as "HH:mm" string.
 *   We need to convert between them.
 *
 * EXAMPLE: "20:30" → Date object for today at 8:30 PM
 */
function timeStringToDate(timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Convert Date to "HH:mm" string
 *
 * EXAMPLE: Date at 8:30 PM → "20:30"
 */
function dateToTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Format time for display
 *
 * EXAMPLE: "20:30" → "8:30 PM"
 */
function formatTimeForDisplay(timeString: string): string {
  const date = timeStringToDate(timeString);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// =============================================================================
// THE COMPONENT
// =============================================================================

export function ReminderSetting() {
  // -------------------------------------------------------------------------
  // Get data and actions
  // -------------------------------------------------------------------------
  const enabled = useReminderEnabled();
  const time = useReminderTime();
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const { selection, lightImpact } = useHaptics();

  // -------------------------------------------------------------------------
  // Local state for time picker visibility
  // -------------------------------------------------------------------------
  const [showTimePicker, setShowTimePicker] = useState(false);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  /**
   * Toggle reminder on/off
   */
  const handleToggle = (value: boolean) => {
    lightImpact();
    updateSettings({ reminderEnabled: value });

    // TODO: Schedule/cancel notification
    // if (value) {
    //   scheduleReminder(time);
    // } else {
    //   cancelReminder();
    // }
  };

  /**
   * Handle time change from picker
   */
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    // On Android, picker dismisses automatically
    // On iOS, we need to handle this manually
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }

    if (selectedDate) {
      selection();
      const newTime = dateToTimeString(selectedDate);
      updateSettings({ reminderItem: newTime });

      // TODO: Reschedule notification with new time
      // if (enabled) {
      //   cancelReminder();
      //   scheduleReminder(newTime);
      // }
    }
  };

  /**
   * Close picker (iOS only)
   */
  const handlePickerDone = () => {
    setShowTimePicker(false);
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <ThemedView style={styles.container}>
      {/* Section Label */}
      <ThemedText style={styles.label}>Daily Reminder</ThemedText>

      {/* Toggle Row */}
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <ThemedText style={styles.rowTitle}>Enable Reminder</ThemedText>
          <ThemedText style={styles.rowSubtitle}>
            Get a daily nudge to log honestly
          </ThemedText>
        </View>
        <Switch
          value={enabled}
          onValueChange={handleToggle}
          trackColor={{ false: "#767577", true: "#22C55E" }}
          thumbColor={enabled ? "#fff" : "#f4f3f4"}
        />
      </View>

      {/* Time Picker Row - only show if enabled */}
      {enabled && (
        <TouchableOpacity
          style={styles.row}
          onPress={() => setShowTimePicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.rowContent}>
            <ThemedText style={styles.rowTitle}>Reminder Time</ThemedText>
            <ThemedText style={styles.rowSubtitle}>
              Before your typical slip time
            </ThemedText>
          </View>
          <ThemedText style={styles.timeValue}>
            {formatTimeForDisplay(time)}
          </ThemedText>
        </TouchableOpacity>
      )}

      {/* Time Picker Modal/Inline */}
      {showTimePicker &&
        (Platform.OS === "ios" ? (
          // iOS: Show as modal
          <Modal
            transparent={true}
            animationType="slide"
            visible={showTimePicker}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handlePickerDone}>
                    <ThemedText style={styles.doneButton}>Done</ThemedText>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={timeStringToDate(time)}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                />
              </View>
            </View>
          </Modal>
        ) : (
          // Android: Inline picker
          <DateTimePicker
            value={timeStringToDate(time)}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        ))}
    </ThemedView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  rowContent: {
    flex: 1,
    marginRight: 16,
  },
  rowTitle: {
    fontSize: 16,
  },
  rowSubtitle: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0a7ea4", // Tint color - looks tappable
  },
  // iOS Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  doneButton: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0a7ea4",
  },
});

// =============================================================================
// NOTIFICATION SCHEDULING (Future Implementation)
// =============================================================================
//
// To fully implement notifications, you'll need:
//
// 1. INSTALL:
//    npx expo install expo-notifications
//
// 2. REQUEST PERMISSIONS:
//    import * as Notifications from 'expo-notifications';
//
//    async function requestPermissions() {
//      const { status } = await Notifications.requestPermissionsAsync();
//      return status === 'granted';
//    }
//
// 3. SCHEDULE DAILY NOTIFICATION:
//    async function scheduleReminder(time: string) {
//      const [hours, minutes] = time.split(':').map(Number);
//
//      await Notifications.scheduleNotificationAsync({
//        content: {
//          title: "Slip Reminder",
//          body: "Log honestly. Stay in control.",
//        },
//        trigger: {
//          hour: hours,
//          minute: minutes,
//          repeats: true,
//        },
//      });
//    }
//
// 4. CANCEL NOTIFICATION:
//    async function cancelReminder() {
//      await Notifications.cancelAllScheduledNotificationsAsync();
//    }
//
// =============================================================================
