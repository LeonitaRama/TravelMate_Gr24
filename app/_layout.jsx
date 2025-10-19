import React from "react";
import { Stack, usePathname } from "expo-router";
import { StyleSheet, View, TouchableOpacity, Text, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname(); 

  const showLoginHeader = pathname === "/" || pathname.startsWith("/explore");

  return (
    <ThemeProvider>
      <View style={styles.container}>
        {showLoginHeader && (
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/auth/login")}
            >
              <Text style={styles.loginText}>Login</Text>
              <View style={styles.underline} />
            </TouchableOpacity>
          </View>
        )}

        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight - 10 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 13,
  },
  loginButton: {
    marginTop: 37,
    paddingVertical: 6,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  underline: {
    height: 2,
    backgroundColor: "#000",
    width: "100%",
    marginTop: 2,
  },
});


