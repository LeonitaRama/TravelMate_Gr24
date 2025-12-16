import { createContext, useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
 const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
 useEffect(() => {
 loadSetting();
  }, []);

 const loadSetting = async () => {
    const value = await AsyncStorage.getItem("notificationsEnabled");
    if (value !== null) {
      setNotificationsEnabled(JSON.parse(value));
    }
  };
    const setNotificationsEnabledValue = async (value) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem(
      "notificationsEnabled",
      JSON.stringify(value)
    );

    //  kur OFF → hek badge
    if (!value) {
      setUnreadCount(0);
    }
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem(
      "notificationsEnabled",
      JSON.stringify(newValue)
    );
  };
  const addNotification = () => {
    if (!notificationsEnabled) return;
    setUnreadCount((prev) => prev + 1);
  };

  const clearNotifications = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ unreadCount, addNotification, clearNotifications,notificationsEnabled, toggleNotifications,setNotificationsEnabledValue}}
    >
      {children}
    </NotificationContext.Provider>
  );
}
