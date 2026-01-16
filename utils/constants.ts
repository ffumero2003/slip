// ============================================================================
// SLIP - CONSTANTS & DEFAULTS
// ============================================================================
// Constants are values that NEVER change while the app runs.
// We put them here so:
//   1. They're easy to find and update
//   2. We don't have "magic numbers" scattered in code
//   3. We can reuse them everywhere
//
// FILE LOCATION: utils/constants.ts
// =======================================================================
import { UserSettings } from "@/types";

// =============================================================================
// DEFAULT SETTINGS - What new users start with
// =============================================================================
// When a user first opens the app (before they configure anything),
// these are the settings they'll have.

export const DEFAULT_SETTINGS: UserSettings = {
  // Empty - user should set this in Settings
  // We'll prompt them if it's empty
  habitName: "",

  // 3 slips per day is a reasonable starting point
  // Not too strict (0), not too lenient (10)
  dailyLimit: 3,

  // Reminders on by default - they can turn off if annoying
  reminderEnabled: true,

  // 8:30 PM - before typical evening slip time
  // Format: "HH:mm" (24-hour)
  reminderItem: "20:30",
};

// =============================================================================
// UNDO WINDOW - How long can you undo a slip?
// =============================================================================
// After tapping "I Slipped", you have this many milliseconds to undo.
// After this time, the undo button disappears (or becomes disabled).

export const UNDO_WINDOW_MS = 5 * 60 * 1000; //5 minutes in ms
//                           5 minutes
//                              × 60 seconds per minute
//                                 × 1000 milliseconds per second
//                           = 300,000 ms

// =============================================================================
// STORAGE KEYS - Names for AsyncStorage
// =============================================================================
// AsyncStorage is like a simple database - you save with a KEY and VALUE.
// These are the keys we use. Keep them consistent!
export const STORAGE_KEYS = {
  // Where we store all slip events
  EVENTS: "slips-events",

  // Where we store user settings
  SETTINGS: "slip-settings",

  // When we last showed the undo option (to track undo window)
  LAST_SLIP_TIME: "slip-last-slip-time",
} as const;
// "as const" makes these readonly - you can't accidentally change them

// =============================================================================
// TIME CONSTANTS - For calculations
// =============================================================================

// Milliseconds in one day (for date calculations)

export const MS_PER_DAY = 24 * 60 * 60 * 1000; //86,400,000

//Milliseconds in one hour

export const MS_PER_HOUR = 60 * 60 * 1000; //3,600,000

// =============================================================================
// UI CONSTANTS - For consistent styling
// =============================================================================

// How many days of history to show by default
export const DEFAULT_HISTORY_DAYS = 30;

//Stats scren range options
export const STATS_RANGES = {
  WEEK: 7,
  MONTH: 30,
} as const;

// Minimum days needed to show pattern insights
export const MIN_DAYS_FOR_PATTERNS = 3;

// =============================================================================
// VALIDATION LIMITS - Prevent bad data
// =============================================================================

// Daily limit must be between these values
export const LIMIT_MIN = 1; // At least 1 (can't be 0 or negative)
export const LIMIT_MAX = 99; // Cap at 99 (reasonable upper bound)

// Habit name max length
export const HABIT_NAME_MAX_LENGTH = 50;

// =============================================================================
// STATUS MESSAGES - Text shown to user
// =============================================================================
export const STATUS_MESSAGES = {
  // When under daily limit
  ON_TRACK: "On track",

  // When at or over daily limit
  OVER_LIMIT: "Over limit",

  // When no slips today
  CLEAN: "No slips yet",
} as const;

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
// DEFAULT_SETTINGS      → New user defaults
// UNDO_WINDOW_MS        → 5 minutes to undo
// STORAGE_KEYS          → AsyncStorage key names
// STATS_RANGES          → 7 and 30 day options
// LIMIT_MIN/MAX         → 1-99 range for daily limit
// STATUS_MESSAGES       → UI text
//
// =============================================================
