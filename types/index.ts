// ============================================================================
// SLIP - TYPE DEFINITIONS
// ============================================================================
// Types are like "blueprints" or "contracts" that describe the SHAPE of data.
// They don't DO anything - they just tell TypeScript what to expect.
//
// WHY USE TYPES?
// 1. Catch errors before running the app (typos, wrong data)
// 2. Get autocomplete in your editor
// 3. Document what data looks like for future you
//
// FILE LOCATION: types/index.ts
// ============================================================================

// =============================================================================
// SLIP EVENT - The core data of the app
// =============================================================================
// Every time the user taps "I Slipped", we create one of these.
// It's like a diary entry: "I slipped at 9:14pm on Jan 16"
export interface SlipEvent {
  // -------------------------------------------------------------------------
  // id: A unique identifier for this specific slip
  // -------------------------------------------------------------------------
  // WHY: So we can find, update, or delete THIS specific slip
  // EXAMPLE: "abc123-def456-ghi789"
  // HOW TO GENERATE: Use uuid library or Date.now().toString()
  id: string;

  // -------------------------------------------------------------------------
  // timestamp: When the slip happened
  // -------------------------------------------------------------------------
  // WHY: To track patterns (what time do slips happen?)
  // FORMAT: ISO 8601 string - "2025-01-16T21:14:00.000Z"
  // WHY STRING: Strings are easier to store and compare than Date objects
  timestamp: string;

  // -------------------------------------------------------------------------
  // source: How was this slip created?
  // -------------------------------------------------------------------------
  // WHY: If user undoes a slip then re-does it, we might want to know
  // VALUES:
  //   'manual' = user tapped "I Slipped"
  //   'undo-restore' = slip was restored after an undo (optional feature)
  source: "manual" | "undo-restore";
}

// =============================================================================
// USER SETTINGS - The rules the user sets once
// =============================================================================
// These are the user's personal settings that control how the app behaves.
// Set once in Settings screen, used everywhere else.
export interface UserSettings {
  // -------------------------------------------------------------------------
  // habitName: What bad habit are they tracking?
  // -------------------------------------------------------------------------
  // WHY: To personalize the UI ("I slipped (vaping)" vs "I slipped")
  // EXAMPLES: "vaping", "cigarettes", "junk food", "doomscrolling"
  // DEFAULT: "" (empty, user fills in during setup)
  habitName: string;

  // -------------------------------------------------------------------------
  // dailyLimit: How many slips per day is "acceptable"?
  // -------------------------------------------------------------------------
  // WHY: To determine "on track" vs "over limit" status
  // EXAMPLES: 3 (trying to limit to 3 cigarettes/day)
  // DEFAULT: 3 (reasonable starting point)
  // RANGE: 1-99 (must be positive, cap at reasonable max)
  dailyLimit: number;

  // -------------------------------------------------------------------------
  // reminderEnabled: Should we send daily reminder notifications?
  // -------------------------------------------------------------------------
  // WHY: Remind user to log honestly before their typical slip time
  // DEFAULT: true (opt-out, not opt-in)
  reminderEnabled: boolean;

  // -------------------------------------------------------------------------
  // reminderTime: What time to send the reminder?
  // -------------------------------------------------------------------------
  // WHY: Send it before their typical slip time (evening usually)
  // FORMAT: "HH:mm" 24-hour format - "20:30" = 8:30 PM
  // DEFAULT: "20:30" (8:30 PM - before typical evening slip time)
  reminderItem: string;
}

// =============================================================================
// DAY STATS - Computed stats for a single day
// =============================================================================
// This is NOT stored - it's calculated from SlipEvents.
// Useful for Stats screen and History screen.

export interface DayStats {
  // -------------------------------------------------------------------------
  // date: Which day is this for?
  // -------------------------------------------------------------------------
  // FORMAT: "YYYY-MM-DD" - "2025-01-16"
  // WHY THIS FORMAT: Easy to sort, compare, and group
  date: string;

  // -------------------------------------------------------------------------
  // count: How many slips happened this day?
  // ----------------------------------------------------
  count: number;

  // -------------------------------------------------------------------------
  // underLimit: Was the user under their daily limit?
  // -------------------------------------------------------------------------
  // TRUE = count <= dailyLimit (good day!)
  // FALSE = count > dailyLimit (over limit)
  underLimit: boolean;
}

// =============================================================================
// TODAY STATUS - What we show on the Home screen
// =============================================================================
// Everything the Home screen needs to display the current state.
export interface TodayStatus {
  // How many slips today?
  count: number;
  // What's the daily limit?
  limit: number;
  // Are we under the limit?
  isUnderLimit: boolean;
  // How many slips left before hitting limit?
  // (0 if already at or over limit)
  remaining: number;
}

// =============================================================================
// STREAK INFO - Consecutive days under limit
// =============================================================================
// The streak is NOT "days with 0 slips" (too harsh)
// It's "days where slips <= daily limit" (encouraging progress)
export interface StreakInfo {
  // Current streak (consecutive days under limit)
  current: number;
  // Best streak ever (for motivation)
  best: number;
}

// =============================================================================
// TYPE HELPERS - Useful utility types
// =============================================================================

// When creating a new slip, we don't have the ID yet
// Omit<X, 'id'> means "X but without the id field"
export type NewSlipEvent = Omit<SlipEvent, "id">;

// For storing in AsyncStorage, we need to serialize everything
export interface StoredData {
  events: SlipEvent[];
  settings: UserSettings;
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
// SlipEvent     → One "I slipped" tap (id, timestamp, source)
// UserSettings  → User's rules (habit, limit, reminder)
// DayStats      → Stats for one day (computed, not stored)
// TodayStatus   → Home screen display data
// StreakInfo    → Streak counter
//
// ====================================================================
