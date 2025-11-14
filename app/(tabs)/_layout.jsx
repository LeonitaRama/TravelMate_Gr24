import React, { createContext, useState, useContext } from "react";
import { Tabs, usePathname } from "expo-router";
import { StyleSheet, View, TouchableOpacity, Text, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext, ThemeProvider } from "../../context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
}

function LayoutContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode } = useContext(ThemeContext);

  // Defino theme plotësisht
  const theme = darkMode
    ? { background: "#121212", text: "#ffffff", tabBar: "#1c1c1c", tabIconActive: "#00bfff", tabIconInactive: "#888888" }
    : { background: "#ffffff", text: "#333333", tabBar: "#f5f5f5", tabIconActive: "#0080ff", tabIconInactive: "#999999" };

  const showLoginHeader = pathname === "/" || pathname === "/explore";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header me Login button */}
      {showLoginHeader && (
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={[styles.loginText, { color: theme.text }]}>Login</Text>
            <View style={[styles.underline, { backgroundColor: theme.text }]} />
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs system */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.tabIconActive,
          tabBarInactiveTintColor: theme.tabIconInactive,
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopColor: darkMode ? "#333333" : "#ddd", // border i ndryshëm për dark mode
          },
        }}
      >
        <Tabs.Screen
          name="index"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  loginButton: {
    paddingVertical: 6,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "600",
  },
  underline: {
    height: 2,
    width: "100%",
    marginTop: 2,
  },
});
