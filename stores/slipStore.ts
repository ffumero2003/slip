// ============================================================================
// SLIP - SLIP EVENTS STORE (Zustand)
// ============================================================================
// This is the "brain" that manages all slip events in the app.
//
// WHAT IS ZUSTAND?
// Zustand is a state management library (like Redux, but simpler).
// Think of it as a shared notepad that any component can read or write to.
// When the notepad changes, all components watching it update automatically.
//
// WHY USE A STORE?
//   - Home screen needs to know today's count
//   - History screen needs all events
//   - Stats screen needs events for calculations
//   - When you add a slip, ALL screens should update instantly
//   - Without a store, you'd have to pass data through many components (messy!)
//
// FILE LOCATION: store/slipStore.ts
// ============================================================================

import * as storage from "@/services/storage";
import { SlipEvent } from "@/types";
import { getDateFromTimestamp, getTodayDateString } from "@/utils/date";
import { create } from "zustand";

// =============================================================================
// STORE INTERFACE - What data and actions the store has
// =============================================================================
// This defines the "shape" of our store - what it contains and what it can do.

interface SlipStore {
  // ---------------------------------------------------------------------------
  // STATE (the data)
  // ---------------------------------------------------------------------------

  // All slip events ever recorded
  events: SlipEvent[];

  // Is the store loading data from storage?
  // We show a loading spinner while this is true
  isLoading: boolean;

  // The ID of the last slip (for undo functionality)
  lastSlipId: string | null;

  // When the last slip happened (timestamp in ms, for undo window)
  lastSlipTime: number | null;

  // ---------------------------------------------------------------------------
  // ACTIONS (functions that modify state)
  // ---------------------------------------------------------------------------

  // Load events from AsyncStorage into the store
  loadEvents: () => Promise<void>;

  // Add a new slip event
  addSlip: () => Promise<void>;

  // Delete a slip event by ID
  deleteSlip: (id: string) => Promise<void>;

  // Undo the last slip (if within undo window)
  undoLastSlip: () => Promise<boolean>;

  // Clear all events (for reset)
  clearAllEvents: () => Promise<void>;
}

// =============================================================================
// HELPER: Generate unique ID
// =============================================================================
// Every slip needs a unique ID so we can find/delete it later.
// This creates a random-ish ID using timestamp + random number.

function generateId(): string {
  // Date.now() = milliseconds since 1970 (always increasing)
  // Math.random() = random decimal between 0 and 1
  // toString(36) = convert to base-36 (uses 0-9 and a-z)
  // slice(2) = remove the "0." from random number
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// =============================================================================
// CREATE THE STORE
// =============================================================================
// create() is Zustand's function to make a store.
// It takes a function that receives "set" and "get":
//   - set: function to update state
//   - get: function to read current state

export const useSlipStore = create<SlipStore>((set, get) => ({
  // ---------------------------------------------------------------------------
  // INITIAL STATE - Starting values when app opens
  // ---------------------------------------------------------------------------

  events: [], // Empty until we load from storage
  isLoading: true, // Start loading immediately
  lastSlipId: null, // No last slip yet
  lastSlipTime: null, // No last slip time yet

  // ---------------------------------------------------------------------------
  // ACTION: Load events from storage
  // ---------------------------------------------------------------------------
  // Called when app starts to restore saved data

  loadEvents: async () => {
    // 1. Set loading to true (shows spinner)
    set({ isLoading: true });

    try {
      // 2. Load events from AsyncStorage
      const events = await storage.getEvents();

      // 3. Load last slip time (for undo window)
      const lastSlipTime = await storage.getLastSlipTime();

      // 4. Find the last slip ID (most recent event)
      const lastSlipId =
        events.length > 0 ? events[events.length - 1].id : null;

      // 5. Update the store with loaded data
      set({
        events,
        lastSlipId,
        lastSlipTime,
        isLoading: false, // Done loading!
      });
    } catch (error) {
      console.error("Failed to load events:", error);
      set({ isLoading: false }); // Stop loading even if error
    }
  },

  // ---------------------------------------------------------------------------
  // ACTION: Add a new slip
  // ---------------------------------------------------------------------------
  // Called when user taps "I Slipped" button

  addSlip: async () => {
    // 1. Create the new event object
    const now = Date.now();
    const newEvent: SlipEvent = {
      id: generateId(), // Unique ID
      timestamp: new Date(now).toISOString(), // Current time as ISO string
      source: "manual", // User manually logged this
    };

    // 2. Get current events from store
    const { events } = get();

    // 3. Add new event to the array
    const updatedEvents = [...events, newEvent];

    // 4. Update the store (this triggers re-renders!)
    set({
      events: updatedEvents,
      lastSlipId: newEvent.id,
      lastSlipTime: now,
    });

    // 5. Save to persistent storage (in background)
    // We update the UI first, then save - feels faster to user
    try {
      await storage.saveEvents(updatedEvents);
      await storage.setLastSlipTime(now);
    } catch (error) {
      console.error("Failed to save slip:", error);
      // Could add error handling here (show toast, retry, etc.)
    }
  },

  // ---------------------------------------------------------------------------
  // ACTION: Delete a slip by ID
  // ---------------------------------------------------------------------------
  // Called from History screen to remove a slip

  deleteSlip: async (id: string) => {
    const { events } = get();

    // Filter out the event with matching ID
    const updatedEvents = events.filter((event) => event.id !== id);

    // Update store
    set({ events: updatedEvents });

    // Save to storage
    try {
      await storage.saveEvents(updatedEvents);
    } catch (error) {
      console.error("Failed to delete slip:", error);
    }
  },

  // ---------------------------------------------------------------------------
  // ACTION: Undo the last slip
  // ---------------------------------------------------------------------------
  // Only works if within the undo window (5 minutes)
  // Returns true if undo was successful, false if not

  undoLastSlip: async () => {
    const { events, lastSlipId, lastSlipTime } = get();

    // Check if there's a slip to undo
    if (!lastSlipId || !lastSlipTime) {
      return false;
    }

    // Check if within undo window (5 minutes)
    const UNDO_WINDOW_MS = 5 * 60 * 1000;
    const timeSinceLastSlip = Date.now() - lastSlipTime;
    if (timeSinceLastSlip > UNDO_WINDOW_MS) {
      return false; // Too late to undo
    }

    // Remove the last slip
    const updatedEvents = events.filter((event) => event.id !== lastSlipId);

    // Update store
    set({
      events: updatedEvents,
      lastSlipId: null, // Clear last slip (can't undo twice)
      lastSlipTime: null,
    });

    // Save to storage
    try {
      await storage.saveEvents(updatedEvents);
    } catch (error) {
      console.error("Failed to undo slip:", error);
    }

    return true; // Undo successful
  },

  // ---------------------------------------------------------------------------
  // ACTION: Clear all events
  // ---------------------------------------------------------------------------
  // Called from Settings when user taps "Reset all data"

  clearAllEvents: async () => {
    set({
      events: [],
      lastSlipId: null,
      lastSlipTime: null,
    });

    try {
      await storage.saveEvents([]);
    } catch (error) {
      console.error("Failed to clear events:", error);
    }
  },
}));

// =============================================================================
// SELECTOR HOOKS - Convenient ways to get specific data
// =============================================================================
// These are "derived state" - computed from the raw events.
// Using selectors prevents unnecessary re-renders.

/**
 * Get only today's events
 */
export function useTodayEvents(): SlipEvent[] {
  return useSlipStore((state) => {
    const today = getTodayDateString();
    return state.events.filter(
      (event) => getDateFromTimestamp(event.timestamp) === today
    );
  });
}

/**
 * Get today's slip count
 */
export function useTodayCount(): number {
  const todayEvents = useTodayEvents();
  return todayEvents.length;
}

/**
 * Get events grouped by date (for History screen)
 */
export function useEventsByDate(): Record<string, SlipEvent[]> {
  return useSlipStore((state) => {
    const grouped: Record<string, SlipEvent[]> = {};

    // Loop through all events and group by date
    state.events.forEach((event) => {
      const date = getDateFromTimestamp(event.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });

    return grouped;
  });
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
// IN YOUR COMPONENT:
//
//   import { useSlipStore, useTodayCount } from '@/store/slipStore';
//
//   // Get actions
//   const addSlip = useSlipStore(state => state.addSlip);
//   const undoLastSlip = useSlipStore(state => state.undoLastSlip);
//
//   // Get data
//   const todayCount = useTodayCount();
//   const isLoading = useSlipStore(state => state.isLoading);
//
//   // Use it
//   <Button onPress={addSlip} title="I Slipped" />
//
// =============================================================================
