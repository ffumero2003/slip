// ============================================================================
// SLIP - DATE UTILITIES
// ============================================================================
// Working with dates is HARD. This file has helper functions to make it easier.
//
// KEY CONCEPTS:
//   - "Today" = based on device's local timezone
//   - We store dates as ISO strings: "2025-01-16T21:14:00.000Z"
//   - We compare dates as "YYYY-MM-DD" strings: "2025-01-16"
//   - Midnight = when "today" changes to "tomorrow"
//
// FILE LOCATION: utils/date.ts
// ============================================================================

// =============================================================================
// GET TODAY'S DATE - As a "YYYY-MM-DD" string
// =============================================================================

/**
 * Get today's date in "YYYY-MM-DD" format (local timezone)
 *
 * EXAMPLE: If it's January 16, 2025 at 9pm → "2025-01-16"
 *
 * WHY THIS FORMAT?
 *   - Easy to compare: "2025-01-16" < "2025-01-17" (string comparison works!)
 *   - Easy to read: it's just year-month-day
 *   - Consistent: always 10 characters
 * */

export function getTodayDateString(): string {
  const now = new Date();
  return formatDateString(now);
}

/**
 * Convert any Date object to "YYYY-MM-DD" format
 *
 * WHAT IT DOES:
 *   1. Get the year, month, day from the Date
 *   2. Pad month and day with leading zeros if needed (1 → "01")
 *   3. Join them with dashes
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear(); // 2025
  const month = date.getMonth() + 1; // 0-11 → 1-12 (January is 0!)
  const day = date.getDate(); // 1-31

  // padStart(2, '0') ensures two digits: 1 → "01", 12 → "12"
  const monthStr = month.toString().padStart(2, "0");
  const dayStr = day.toString().padStart(2, "0");

  return `${year}-${monthStr}-${dayStr}`; // "2025-01-16"
}

// =============================================================================
// CHECK IF DATE IS TODAY
// =============================================================================

/**
 * Check if a timestamp (ISO string) is from today
 *
 * EXAMPLE:
 *   isToday("2025-01-16T21:14:00.000Z") → true (if today is Jan 16)
 *   isToday("2025-01-15T21:14:00.000Z") → false
 */
export function isToday(isoTimestamp: string): boolean {
  const eventDate = new Date(isoTimestamp);
  const eventDateString = formatDateString(eventDate);
  const todayString = getTodayDateString();

  return eventDateString === todayString;
}

/**
 * Get the date string from an ISO timestamp
 *
 * EXAMPLE: "2025-01-16T21:14:00.000Z" → "2025-01-16"
 */
export function getDateFromTimestamp(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return formatDateString(date);
}

/**
 * Format a timestamp for display in the UI
 *
 * EXAMPLE: "2025-01-16T21:14:00.000Z" → "9:14 PM"
 */
export function formatTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);

  // toLocaleTimeString formats time based on user's locale
  // Options: show hours and minutes, not seconds
  return date.toLocaleTimeString([], {
    hour: "numeric", // "9" not "09"
    minute: "2-digit", // "14" not "4"
    hour12: true, // "9:14 PM" not "21:14"
  });
}

/**
 * Format a date for display in History screen
 *
 * EXAMPLE: "2025-01-16" → "Jan 16" (or "Today" if it's today)
 */
export function formatDateForDisplay(dateString: string): string {
  // Check if it's today
  if (dateString === getTodayDateString()) {
    return "Today";
  }

  // Check if it's yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateString === formatDateString(yesterday)) {
    return "Yesterday";
  }

  // Otherwise, format as "Jan 16"
  const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
  return date.toLocaleDateString([], {
    month: "short", // "Jan"
    day: "numeric", // "16"
  });
}

// =============================================================================
// DATE RANGE HELPERS - For Stats screen
// =============================================================================

/**
 * Get an array of the last N days as "YYYY-MM-DD" strings
 *
 * EXAMPLE: getLastNDays(3) on Jan 16 → ["2025-01-14", "2025-01-15", "2025-01-16"]
 *
 * WHY: Stats screen needs to show data for "last 7 days" or "last 30 days"
 */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();

  // Start from (n-1) days ago, go up to today
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i); // Subtract i days
    days.push(formatDateString(date));
  }

  return days;
}

/**
 * Check if a date string is within the last N days
 */
export function isWithinLastNDays(dateString: string, n: number): boolean {
  const lastNDays = getLastNDays(n);
  return lastNDays.includes(dateString);
}

// =============================================================================
// STREAK HELPERS - For calculating consecutive days
// =============================================================================

/**
 * Get yesterday's date as "YYYY-MM-DD"
 */
export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateString(yesterday);
}

/**
 * Get the date N days ago as "YYYY-MM-DD"
 */
export function getDaysAgoDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDateString(date);
}

// =============================================================================
// TIME HELPERS - For pattern detection
// =============================================================================

/**
 * Get the hour (0-23) from an ISO timestamp
 *
 * EXAMPLE: "2025-01-16T21:14:00.000Z" → 21
 *
 * WHY: To find "most common slip time" patterns
 */
export function getHourFromTimestamp(isoTimestamp: string): number {
  const date = new Date(isoTimestamp);
  return date.getHours(); // 0-23
}

/**
 * Get the day of week (0-6) from an ISO timestamp
 *
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 *
 * WHY: To find "most common slip day" patterns
 */
export function getDayOfWeekFromTimestamp(isoTimestamp: string): number {
  const date = new Date(isoTimestamp);
  return date.getDay(); // 0-6
}

/**
 * Convert day number to name
 *
 * EXAMPLE: 0 → "Sunday", 1 → "Monday", etc.
 */
export function getDayName(dayOfWeek: number): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek];
}

/**
 * Format hour range for display
 *
 * EXAMPLE: formatHourRange(21) → "9–10 PM"
 */
export function formatHourRange(hour: number): string {
  const startHour = hour % 12 || 12; // Convert 0→12, 13→1, etc.
  const endHour = (hour + 1) % 12 || 12;
  const period = hour < 12 ? "AM" : "PM";
  const endPeriod = hour + 1 < 12 || hour + 1 === 24 ? "AM" : "PM";

  // If same period, only show once: "9–10 PM"
  // If different period, show both: "11 AM–12 PM"
  if (period === endPeriod) {
    return `${startHour}–${endHour} ${period}`;
  }
  return `${startHour} ${period}–${endHour} ${endPeriod}`;
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
// TODAY:
//   getTodayDateString()           → "2025-01-16"
//   isToday(timestamp)             → true/false
//
// FORMATTING:
//   formatTime(timestamp)          → "9:14 PM"
//   formatDateForDisplay(date)     → "Jan 16" or "Today"
//
// RANGES:
//   getLastNDays(7)                → ["2025-01-10", ..., "2025-01-16"]
//
// PATTERNS:
//   getHourFromTimestamp(ts)       → 21 (for 9pm)
//   getDayOfWeekFromTimestamp(ts)  → 4 (Thursday)
//
// =============================================================================
