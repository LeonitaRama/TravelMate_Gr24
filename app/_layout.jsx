import { Slot, Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import '../i18n';
import { AuthProvider } from "../context/AuthContext";
import { useEffect } from "react";
import { requestLocalNotificationPermission } from "../utils/localNotifications";
import { NotificationProvider } from "../context/NotificationContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,   // ⬅ SHFAQ POPUP
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
  requestLocalNotificationPermission();
}, []);
  return (
    <AuthProvider>
      <ThemeProvider>
      <NotificationProvider>
        <Slot />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}