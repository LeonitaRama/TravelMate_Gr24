import { Tabs, useRouter, usePathname } from "expo-router";
import { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const showLoginHeader = pathname === "/" || pathname === "/explore";

  return (
 
      
      <Tabs
        screenOptions={{
          headerShown: true,
          headerTitle:"",
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: darkMode ? "#333" : "#ddd",
          },
            headerRight: () => (
          <Ionicons
            name="notifications-outline"
            size={24}
            color={darkMode ? "#fff" : "#000"}
            style={{ marginRight: 15 }}
            onPress={() => router.push("/notifications")}
            
          />
            ), 
            headerLeft: () =>
            showLoginHeader ? (
           <TouchableOpacity
            onPress={() => router.push("/login")}
            style={{ marginLeft: 15 }}
           >
          <Text style={{ color: theme.text, fontWeight: "600" , fontSize: 18}}>
          Login
         </Text>
         </TouchableOpacity>
          ) : null,
             tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: darkMode ? "#333" : "#ddd",
    },
    
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="wishlist"
          options={{
            title: "Wishlist",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />

      </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 13,
    paddingVertical: 10,
     alignItems: "flex-end",
     
  },
  loginButton: {
    paddingVertical: 6,
  },
  loginText: {
    fontSize:16,
    fontWeight: "600",
     marginTop: 40,
    
  },
  underline: {
    height: 2,
    width: "100%",
    marginTop: 2,
  },
});
