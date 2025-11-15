import { Tabs, useRouter, usePathname } from "expo-router";
import { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode } = useContext(ThemeContext);

  const theme = darkMode ? darkTheme : lightTheme;

  const showLoginHeader = pathname === "/" || pathname === "/explore";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {showLoginHeader && (
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Text style={[styles.loginText, { color: theme.text }]}>Login</Text>
            <View style={[styles.underline, { backgroundColor: theme.text }]} />
          </TouchableOpacity>
        </View>
      )}

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: darkMode ? "#333" : "#ddd",
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
