import { Stack, useSegments, useRouter } from "expo-router";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { useContext, useEffect, useState } from "react";
import { StatusBar, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { NotificationContext } from "../../context/NotificationContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ProfileLayout() {
  const segments = useSegments();
  const router = useRouter();
  const current = segments[segments.length-1];

  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;

const { unreadCount } = useContext(NotificationContext);

  const titles = {
    personalInfo: "Edit Profile",
    photos: "My Posts",
    reviews: "My Reviews",
    profile: "My Profile",
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
          headerTitle: titles[current] || "Profile",
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: { color: theme.text, fontSize: theme.fontSizes.lg, fontWeight: '600', },
          headerTintColor: darkMode ? "#fff" : "#000",
          headerShadowVisible: false,
          headerRight: () => (
             <TouchableOpacity onPress={() => router.push("/notifications")} style={styles.notificationButton} activeOpacity={0.7}>
              <Ionicons
                name={unreadCount > 0 ? "notifications" : "notifications-outline"}
                size={24}
                color={theme.text}
              />
              {unreadCount > 0 && (
                <View
                  style={[
                    styles.badge,
                    { 
                      backgroundColor: theme.primary,
                      borderColor: theme.background 
                    }
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ),
        }}
      />
    </>
  );
}


const styles = StyleSheet.create({
  notificationButton: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 4,
  },
});