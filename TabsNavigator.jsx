import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "./context/ThemeContext";

// Screens
import HomeScreen from "./app/home";
import WishlistScreen from "./app/wishlist";
import SettingsScreen from "./app/settings";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: darkMode ? "#222" : "#fff" },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: darkMode ? "#aaa" : "#555",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "home") iconName = "home-outline";
          else if (route.name === "wishlist") iconName = "heart-outline";
          else if (route.name === "settings") iconName = "settings-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="wishlist" component={WishlistScreen} />
      <Tab.Screen name="settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
