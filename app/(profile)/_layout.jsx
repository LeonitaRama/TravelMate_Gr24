import { Stack, useSegments } from "expo-router";
import { StatusBar } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { useContext } from "react";

export default function ProfileLayout() {
  const segments = useSegments();
  const current = segments[segments.length - 1];
  const { darkMode } = useContext(ThemeContext);
  
  const theme = darkMode ? darkTheme : lightTheme;

  const titles = {
    personalInfo: "Edit Profile",
    photos: "My Posts",
    reviews: "My Reviews",
    profile: "My Profile",
    badges: "My Badges"
  };

  return (
    <>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: titles[current] || "Travel Posts",
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: { color: theme.text },
          headerTintColor: darkMode ? "#fff" : "#000", // back button and other header icons
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: darkMode ? "#333" : "#ddd",
          },
        }}
      />
    </>
  );
}
