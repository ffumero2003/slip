// ============================================================================
// SLIP - STORAGE SERVICE
// ============================================================================
// This file handles SAVING and LOADING data to the phone's storage.
//
// WHAT IS ASYNCSTORAGE?
// Think of it like a simple filing cabinet on the phone:
//   - You put things IN with a label (key)
//   - You get things OUT by asking for that label
//   - Data survives app restarts (persists)
//   - It's "async" because reading/writing takes time (not instant)
//
// WHY A SEPARATE SERVICE?
//   1. Keep storage logic in one place
//   2. Easy to swap storage method later (e.g., to SQLite)
//   3. Add error handling in one place
//   4. Add logging/debugging easily
//
// FILE LOCATION: services/storage.ts
// ==========================================================

import { SlipEvent, UserSettings } from "@/types";
import { DEFAULT_SETTINGS, STORAGE_KEYS } from "@/utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// =============================================================================
// SLIP EVENTS - Save and load the list of all slips
// =============================================================================

/**
 * GET ALL EVENTS - Load all slip events from storage
 *
 * WHAT IT DOES:
 *   1. Asks AsyncStorage for the events data
 *   2. If data exists, parse it from JSON string to array
 *   3. If no data (first time), return empty array
 *
 * RETURNS: Array of SlipEvent objects (or empty array)
 */

export async function getEvents(): Promise<SlipEvent[]> {
  try {
    // AsyncStorage.getItem returns a string (or null if nothing saved)
    const jsonString = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);

    // If nothing saved yet, return empty array
    if (jsonString === null) {
      return [];
    }

    // Parse the JSON string back into a JavaScript array
    // JSON.parse('["a","b"]') → ["a", "b"]
    const events: SlipEvent[] = JSON.parse(jsonString);
    return events;
  } catch (error) {
    // If something goes wrong (corrupted data, etc.), log it and return empty
    // This prevents the app from crashing
    console.error("Error loading events: ", error);
    return [];
  }
}

/**
 * SAVE ALL EVENTS - Save the entire events array to storage
 *
 * WHAT IT DOES:
 *   1. Convert the array to a JSON string
 *   2. Save that string to AsyncStorage
 *
 * WHY SAVE THE WHOLE ARRAY?
 *   AsyncStorage is simple - it doesn't do partial updates.
 *   We save everything each time. For small data (hundreds of events),
 *   this is totally fine and fast enough.
 */
export async function saveEvents(events: SlipEvent[]): Promise<void> {
  try {
    // Convert array to JSON string
    // [{id: "1", ...}, {id: "2", ...}] → '[{"id":"1",...},{"id":"2",...}]'
    const jsonString = JSON.stringify(events);

    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, jsonString);
  } catch (error) {
    console.error("Error saving events:", error);
    // In a production app, you might want to show an alert to the user
    throw error; // Re-throw so the caller knows it failed
  }
}

/**
 * ADD ONE EVENT - Add a single slip event (convenience function)
 *
 * WHAT IT DOES:
 *   1. Load all existing events
 *   2. Add the new event to the array
 *   3. Save the updated array
 *
 * RETURNS: The updated array (so caller has fresh data)
 */
export async function addEvent(event: SlipEvent): Promise<SlipEvent[]> {
  const events = await getEvents();

  // Add new event to the END of the array (chronological order)
  events.push(event);

  await saveEvents(events);
  return events;
}

/**
 * DELETE ONE EVENT - Remove a slip event by ID
 *
 * WHAT IT DOES:
 *   1. Load all events
 *   2. Filter OUT the one with matching ID
 *   3. Save the filtered array
 *
 * RETURNS: The updated array (without the deleted event)
 */
export async function deleteEvent(eventId: string): Promise<SlipEvent[]> {
  const events = await getEvents();

  // filter() keeps items where the condition is TRUE
  // So we keep all events EXCEPT the one with the matching ID
  const filteredEvents = events.filter((event) => event.id !== eventId);

  await saveEvents(filteredEvents);
  return filteredEvents;
}

// =============================================================================
// USER SETTINGS - Save and load user preferences
// =============================================================================

/**
 * GET SETTINGS - Load user settings from storage
 *
 * RETURNS: UserSettings object (or defaults if nothing saved)
 */
export async function getSettings(): Promise<UserSettings> {
  try {
    const jsonString = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);

    // If nothing saved, return default settings
    if (jsonString === null) {
      return DEFAULT_SETTINGS;
    }

    // Parse and return
    const settings: UserSettings = JSON.parse(jsonString);

    // Merge with defaults in case we added new settings in an update
    // This prevents crashes if old storage is missing new fields
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * SAVE SETTINGS - Save user settings to storage
 */
export async function saveSettings(settings: UserSettings): Promise<void> {
  try {
    const jsonString = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonString);
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
}

/**
 * UPDATE SETTINGS - Partially update settings (convenience function)
 *
 * WHAT IT DOES:
 *   1. Load current settings
 *   2. Merge in the new values (overwrite only what's provided)
 *   3. Save the merged settings
 *
 * EXAMPLE:
 *   updateSettings({ dailyLimit: 5 })
 *   // Only changes dailyLimit, keeps everything else the same
 */
export async function updateSettings(
  partial: Partial<UserSettings>
): Promise<UserSettings> {
  const current = await getSettings();

  // Spread operator merges objects
  // { ...current, ...partial } = start with current, then overwrite with partial
  const updated = { ...current, ...partial };

  await saveSettings(updated);
  return updated;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * CLEAR ALL DATA - Reset everything (for "Reset all data" in Settings)
 *
 * WARNING: This is destructive! Confirm with user before calling.
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.EVENTS,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.LAST_SLIP_TIME,
    ]);
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
}

/**
 * GET LAST SLIP TIME - For undo window tracking
 *
 * RETURNS: Timestamp (ms) of last slip, or null if none
 */
export async function getLastSlipTime(): Promise<number | null> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SLIP_TIME);
    return value ? parseInt(value, 10) : null;
  } catch (error) {
    console.error("Error getting last slip time:", error);
    return null;
  }
}

/**
 * SET LAST SLIP TIME - Record when last slip happened
 */
export async function setLastSlipTime(timestamp: number): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_SLIP_TIME,
      timestamp.toString()
    );
  } catch (error) {
    console.error("Error setting last slip time:", error);
  }
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
// EVENTS:
//   getEvents()              → Load all events
//   saveEvents(events)       → Save all events
//   addEvent(event)          → Add one event
//   deleteEvent(id)          → Delete one event
//
// SETTINGS:
//   getSettings()            → Load settings (or defaults)
//   saveSettings(settings)   → Save settings
//   updateSettings(partial)  → Update some settings
//
// UTILITY:
//   clearAllData()           → Reset everything
//   getLastSlipTime()        → For undo window
//   setLastSlipTime(ts)      → For undo window
//
// =============================================================================
