import { Slot, Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import '../i18n';
import { AuthProvider } from "../context/AuthContext";
import { useEffect, useContext } from "react";
import { requestLocalNotificationPermission } from "../utils/localNotifications";
import { NotificationProvider } from "../context/NotificationContext";
import * as Notifications from "expo-notifications";
import '../i18n';
import { scheduleRepeatingRandomNotifications, addNotification} from "../utils/localNotifications";
import { NotificationContext } from "../context/NotificationContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function RootLayoutContent() {
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    requestLocalNotificationPermission();

    const stop = scheduleRepeatingRandomNotifications(addNotification, 60);

    return () => stop(); 
  }, []);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}