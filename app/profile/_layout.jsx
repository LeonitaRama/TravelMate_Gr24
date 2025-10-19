import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { ThemeProvider } from "../../context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Këto janë rrugët jashtë tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="Profile" />
        <Stack.Screen name="Reviews" />
        <Stack.Screen name="Photos" />
        <Stack.Screen name="PersonalInfo" />
        <Stack.Screen name="DestinationDetails" />
      </Stack>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {

    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  }
}

);