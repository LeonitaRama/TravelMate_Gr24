import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function requestLocalNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleLocalNotification(title, body) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null, // shfaqet MENJËHERË
  });

  const newNotification = {
    id,
    title,
    body,
    date: new Date().toISOString(),
  };

  const stored = await AsyncStorage.getItem("LOCAL_NOTIFICATIONS");
  const notifications = stored ? JSON.parse(stored) : [];

  notifications.unshift(newNotification);
  await AsyncStorage.setItem(
    "LOCAL_NOTIFICATIONS",
    JSON.stringify(notifications)
  );

  return newNotification;
}

export async function getLocalNotifications() {
  const stored = await AsyncStorage.getItem("LOCAL_NOTIFICATIONS");
  return stored ? JSON.parse(stored) : [];
}

export async function clearLocalNotifications() {
  await AsyncStorage.removeItem("LOCAL_NOTIFICATIONS");
}
