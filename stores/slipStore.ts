// ============================================================================
// SLIP - SLIP EVENTS STORE (Zustand) - FIXED VERSION
// ============================================================================
// CAMBIO IMPORTANTE: Los selectores ahora están FUERA del store
// para evitar crear nuevos objetos en cada render.
//
// FILE LOCATION: stores/slipStore.ts
// ============================================================================

import * as storage from "@/services/storage";
import { SlipEvent } from "@/types";
import { getDateFromTimestamp, getTodayDateString } from "@/utils/date";
import { create } from "zustand";

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface SlipStore {
  // STATE
  events: SlipEvent[];
  isLoading: boolean;
  lastSlipId: string | null;
  lastSlipTime: number | null;

  // ACTIONS
  loadEvents: () => Promise<void>;
  addSlip: () => Promise<void>;
  deleteSlip: (id: string) => Promise<void>;
  undoLastSlip: () => Promise<boolean>;
  clearAllEvents: () => Promise<void>;
}

// =============================================================================
// HELPER: Generate unique ID
// =============================================================================

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// =============================================================================
// CREATE THE STORE
// =============================================================================

export const useSlipStore = create<SlipStore>((set, get) => ({
  // INITIAL STATE
  events: [],
  isLoading: true,
  lastSlipId: null,
  lastSlipTime: null,

  // ACTION: Load events from storage
  loadEvents: async () => {
    set({ isLoading: true });

    try {
      const events = await storage.getEvents();
      const lastSlipTime = await storage.getLastSlipTime();
      const lastSlipId =
        events.length > 0 ? events[events.length - 1].id : null;

      set({
        events,
        lastSlipId,
        lastSlipTime,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load events:", error);
      set({ isLoading: false });
    }
  },

  // ACTION: Add a new slip
  addSlip: async () => {
    const now = Date.now();
    const newEvent: SlipEvent = {
      id: generateId(),
      timestamp: new Date(now).toISOString(),
      source: "manual",
    };

    const { events } = get();
    const updatedEvents = [...events, newEvent];

    set({
      events: updatedEvents,
      lastSlipId: newEvent.id,
      lastSlipTime: now,
    });

    try {
      await storage.saveEvents(updatedEvents);
      await storage.setLastSlipTime(now);
    } catch (error) {
      console.error("Failed to save slip:", error);
    }
  },

  // ACTION: Delete a slip by ID
  deleteSlip: async (id: string) => {
    const { events } = get();
    const updatedEvents = events.filter((event) => event.id !== id);

    set({ events: updatedEvents });

    try {
      await storage.saveEvents(updatedEvents);
    } catch (error) {
      console.error("Failed to delete slip:", error);
    }
  },

  // ACTION: Undo the last slip
  undoLastSlip: async () => {
    const { events, lastSlipId, lastSlipTime } = get();

    if (!lastSlipId || !lastSlipTime) {
      return false;
    }

    const UNDO_WINDOW_MS = 5 * 60 * 1000;
    const timeSinceLastSlip = Date.now() - lastSlipTime;
    if (timeSinceLastSlip > UNDO_WINDOW_MS) {
      return false;
    }

    const updatedEvents = events.filter((event) => event.id !== lastSlipId);

    set({
      events: updatedEvents,
      lastSlipId: null,
      lastSlipTime: null,
    });

    try {
      await storage.saveEvents(updatedEvents);
    } catch (error) {
      console.error("Failed to undo slip:", error);
    }

    return true;
  },

  // ACTION: Clear all events
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
// SELECTOR FUNCTIONS - VERSIÓN CORREGIDA
// =============================================================================
// IMPORTANTE: Estos selectores ahora calculan el valor FUERA del selector
// de Zustand para evitar crear nuevos objetos en cada render.
//
// El problema anterior era que filter() y {} creaban nuevos objetos
// cada vez, lo que hacía que Zustand pensara que el estado había cambiado.
// =============================================================================

/**
 * Get today's slip count - SIMPLE NUMBER (no infinite loop)
 *
 * Este es el más importante - solo devuelve un número, no un array.
 */
export function useTodayCount(): number {
  // Obtenemos los eventos del store
  const events = useSlipStore((state) => state.events);

  // Calculamos el conteo FUERA del selector
  // Esto es seguro porque es un número primitivo, no un objeto/array
  const today = getTodayDateString();
  let count = 0;

  for (const event of events) {
    if (getDateFromTimestamp(event.timestamp) === today) {
      count++;
    }
  }

  return count;
}

/**
 * Get all events - just returns the array reference
 * (safe because we're not creating a new array)
 */
export function useAllEvents(): SlipEvent[] {
  return useSlipStore((state) => state.events);
}

/**
 * Get today's events as a filtered array
 *
 * NOTA: Este hook puede causar re-renders porque crea un nuevo array.
 * Úsalo solo donde realmente necesites la lista de eventos de hoy.
 * Para solo el conteo, usa useTodayCount().
 */
export function useTodayEvents(): SlipEvent[] {
  const events = useSlipStore((state) => state.events);
  const today = getTodayDateString();

  // Filtramos FUERA del selector de Zustand
  return events.filter(
    (event) => getDateFromTimestamp(event.timestamp) === today
  );
}

/**
 * Get events grouped by date
 *
 * NOTA: Este también crea un nuevo objeto, úsalo con cuidado.
 */
export function useEventsByDate(): Record<string, SlipEvent[]> {
  const events = useSlipStore((state) => state.events);

  // Agrupamos FUERA del selector
  const grouped: Record<string, SlipEvent[]> = {};

  for (const event of events) {
    const date = getDateFromTimestamp(event.timestamp);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
  }

  return grouped;
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
// SAFE (no infinite loops):
//   const count = useTodayCount();           // Returns number
//   const events = useAllEvents();           // Returns same array reference
//   const isLoading = useSlipStore(s => s.isLoading);  // Returns boolean
//
// USE WITH CAUTION (creates new objects):
//   const todayEvents = useTodayEvents();    // Creates new array
//   const byDate = useEventsByDate();        // Creates new object
//
// =============================================================================
