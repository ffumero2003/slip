// ============================================================================
// SLIP - SETTINGS STORE (Zustand)
// ============================================================================
// This store manages user settings (habit name, daily limit, reminders).
//
// WHY A SEPARATE STORE FROM EVENTS?
//   - Settings change rarely (user sets once)
//   - Events change often (every slip)
//   - Separating them keeps code cleaner
//   - Different screens need different data
//
// FILE LOCATION: store/settingsStore.ts
// ============================================================================

import * as storage from "@/services/storage";
import { UserSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/utils/constants";
import { create } from "zustand";

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface SettingsStore {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  // The user's settings
  settings: UserSettings;

  // Is the store loading from storage?
  isLoading: boolean;

  // Has the user completed initial setup?
  // (We check if habitName is set)
  isSetupComplete: boolean;

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  // Load settings from storage
  loadSettings: () => Promise<void>;

  // Update one or more settings
  updateSettings: (partial: Partial<UserSettings>) => Promise<void>;

  // Reset to defaults
  resetSettings: () => Promise<void>;
}

// =============================================================================
// CREATE THE STORE
// =============================================================================

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  // ---------------------------------------------------------------------------
  // INITIAL STATE
  // ---------------------------------------------------------------------------

  settings: DEFAULT_SETTINGS,
  isLoading: true,
  isSetupComplete: false,

  // ---------------------------------------------------------------------------
  // ACTION: Load settings from storage
  // ---------------------------------------------------------------------------

  loadSettings: async () => {
    set({ isLoading: true });

    try {
      const settings = await storage.getSettings();

      // Check if setup is complete (has habit name)
      const isSetupComplete = settings.habitName.trim().length > 0;

      set({
        settings,
        isSetupComplete,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load settings:", error);
      set({ isLoading: false });
    }
  },

  // ---------------------------------------------------------------------------
  // ACTION: Update settings
  // ---------------------------------------------------------------------------
  // You can update one field or multiple:
  //   updateSettings({ dailyLimit: 5 })
  //   updateSettings({ dailyLimit: 5, reminderEnabled: false })

  updateSettings: async (partial: Partial<UserSettings>) => {
    const { settings } = get();

    // Merge current settings with new values
    const updated = { ...settings, ...partial };

    // Check if setup is now complete
    const isSetupComplete = updated.habitName.trim().length > 0;

    // Update store (instant UI update)
    set({ settings: updated, isSetupComplete });

    // Save to storage (background)
    try {
      await storage.saveSettings(updated);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  },

  // ---------------------------------------------------------------------------
  // ACTION: Reset settings to defaults
  // ---------------------------------------------------------------------------

  resetSettings: async () => {
    set({
      settings: DEFAULT_SETTINGS,
      isSetupComplete: false,
    });

    try {
      await storage.saveSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Failed to reset settings:", error);
    }
  },
}));

// =============================================================================
// SELECTOR HOOKS - Convenient shortcuts
// =============================================================================

/**
 * Get just the daily limit
 */
export function useDailyLimit(): number {
  return useSettingsStore((state) => state.settings.dailyLimit);
}

/**
 * Get just the habit name
 */
export function useHabitName(): string {
  return useSettingsStore((state) => state.settings.habitName);
}

/**
 * Get reminder settings
 */
export function useReminderSettings(): { enabled: boolean; time: string } {
  return useSettingsStore((state) => ({
    enabled: state.settings.reminderEnabled,
    time: state.settings.reminderItem,
  }));
}

// =============================================================================
// QUICK REFERENCE
// =============================================================================
//
//   import { useSettingsStore, useDailyLimit } from '@/store/settingsStore';
//
//   // Get the whole settings object
//   const settings = useSettingsStore(state => state.settings);
//
//   // Get just what you need (better for performance)
//   const dailyLimit = useDailyLimit();
//   const habitName = useHabitName();
//
//   // Update settings
//   const updateSettings = useSettingsStore(state => state.updateSettings);
//   updateSettings({ dailyLimit: 5 });
//
// =============================================================================
