import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";

export default function Layout() {
  // Rrethimi i Tabs me ThemeProvider
  return (
    <ThemeProvider>
      <TabsWrapper />
    </ThemeProvider>
  );
}

// Ky komponent brenda përdor darkMode për tabs
function TabsWrapper() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0080ff",
        tabBarInactiveTintColor: darkMode ? "#aaa" : "gray",
        tabBarStyle: {
          backgroundColor: darkMode ? "#222" : "#fff",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
