import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { useEffect } from "react";

export async function requestLocalNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}


export async function scheduleLocalNotification(title, body) {
  const storedEnabled = await AsyncStorage.getItem("notificationsEnabled");
  const enabled = storedEnabled ? JSON.parse(storedEnabled) : true;
  if (!enabled) return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      sound: true,
    });
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null, 
  });

  const newNotification = { id, title, body, date: new Date().toISOString() };
  const stored = await AsyncStorage.getItem("LOCAL_NOTIFICATIONS");
  const notifications = stored ? JSON.parse(stored) : [];
  notifications.unshift(newNotification);
  await AsyncStorage.setItem("LOCAL_NOTIFICATIONS", JSON.stringify(notifications));

  return newNotification;
}


export function scheduleRandomNotification(addNotification) {
  const messages = [
    "Check out a new destination today! ✈️",
    "Don't forget to plan your next adventure!",
    "Explore travel tips in your feed 🗺️",
    "Discover amazing places today!"
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  scheduleLocalNotification("TravelMate Reminder", randomMessage);

  if (addNotification) addNotification();
}


export function scheduleRepeatingRandomNotifications(addNotification, intervalMinutes = 60) {
  const interval = setInterval(() => {
    scheduleRandomNotification(addNotification);
  }, 1000 * 60 * intervalMinutes); 
  return () => clearInterval(interval); 
}


export async function getLocalNotifications() {
  const stored = await AsyncStorage.getItem("LOCAL_NOTIFICATIONS");
  return stored ? JSON.parse(stored) : [];
}

export async function clearLocalNotifications() {
  await AsyncStorage.removeItem("LOCAL_NOTIFICATIONS");
}