// "Tabs" is a component from Expo Router that creates the bottom tab bar
// Think of it like a container that holds all your tab buttons
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    //edges top = will only affect the top area
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
      edges={["top"]}
    >
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor = the color of the icon/text when tab is SELECTED
          // We pick the right color based on dark/light mode
          // The "?? 'light'" means: if colorScheme is null, use 'light' as backup
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,

          // tabBarInactiveTintColor = color when tab is NOT selected (grayed out)
          tabBarInactiveTintColor: Colors[colorScheme ?? "light"].icon,

          // headerShown: false = hide the header bar at the top of each screen
          // We hide it because we'll design our own headers inside each screen
          headerShown: false,

          // tabBarButton = what component to use for each tab button
          // HapticTab adds that nice little vibration when you press
          // tabBarButton: HapticTab,

          // tabBarStyle = styling for the entire bottom bar
          // You can customize background color, height, etc. here later
          tabBarStyle: {
            borderTopWidth: 1,
            // Example: give it a subtle top border
            borderTopColor: Colors[colorScheme ?? "light"].icon + "20",
          },
        }}
      >
        {/* ================================================================== */}
        {/* TAB 1: HOME - The main screen where users log slips               */}
        {/* ================================================================== */}
        {/* 
        name="index" is SPECIAL in Expo Router:
        - "index" means this is the DEFAULT tab (shows first when app opens)
        - The actual file is: app/(tabs)/index.tsx
      */}
        <Tabs.Screen
          name="index"
          options={{
            // "title" shows as text under the icon in the tab bar
            title: "Home",

            // "tabBarIcon" is a function that returns the icon to display
            // It receives { color, focused, size } - we only need color here
            // "color" will automatically be the active or inactive color based on selection
            tabBarIcon: ({ color }) => (
              <Ionicons
                size={28}
                name="home-outline" // SF Symbol name (iOS) - mapped to Material icon for Android
                color={color}
              />
            ),
          }}
        />

        {/* ================================================================== */}
        {/* TAB 2: STATS - Where users see their patterns and trends          */}
        {/* ================================================================== */}
        {/*
        name="stats" means:
        - This tab loads the file: app/(tabs)/stats.tsx
        - The URL will be: /stats
      */}
        <Tabs.Screen
          name="stats"
          options={{
            title: "Stats",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="stats-chart-outline" color={color} />
            ),
          }}
        />

        {/* ================================================================== */}
        {/* TAB 3: HISTORY - The audit log of all slip events                 */}
        {/* ================================================================== */}
        {/*
        name="history" means:
        - This tab loads the file: app/(tabs)/history.tsx
        - The URL will be: /history
      */}
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="time-outline" color={color} />
            ),
          }}
        />

        {/* ================================================================== */}
        {/* TAB 4: SETTINGS - Where users configure their rules               */}
        {/* ================================================================== */}
        {/*
        name="settings" means:
        - This tab loads the file: app/(tabs)/settings.tsx
        - The URL will be: /settings
      */}
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="settings-outline" color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
// =============================================================================
// WHAT EACH PART DOES - SUMMARY
// =============================================================================
//
// <Tabs>                    → Creates the bottom tab navigator
// screenOptions={{...}}     → Default settings for ALL tabs
// tabBarActiveTintColor     → Color when tab IS selected
// tabBarInactiveTintColor   → Color when tab is NOT selected
// headerShown: false        → Hide the top header (we'll make our own)
// tabBarButton: HapticTab   → Add vibration feedback on tap
//
// <Tabs.Screen>             → Defines ONE tab
// name="xxx"                → Must match the filename (xxx.tsx)
// title="Xxx"               → Text shown under the icon
// tabBarIcon                → Function that returns the icon component
// href: null                → Hides a tab completely
//
// =============================================================================
