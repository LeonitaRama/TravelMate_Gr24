import { Tabs, useRouter, usePathname } from "expo-router";
import { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NotificationContext } from "../../context/NotificationContext";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { useTranslation } from "react-i18next";


export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const showLoginHeader = pathname === "/" || pathname === "/explore";
  const { unreadCount } = useContext(NotificationContext);
  const languages = ["English", "Albanian"];

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
          <TouchableOpacity
    onPress={() => router.push("/notifications")}
    style={{ marginRight: 15 }}
  >
    <Ionicons
      name="notifications-outline"
      size={24}
      color={darkMode ? "#fff" : "#000"}
    />

    {unreadCount > 0 && (
      <View
        style={{
          position: "absolute",
          top: -4,
          right: -6,
          backgroundColor: "red",
          borderRadius: 10,
          minWidth: 16,
          height: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>
          {unreadCount}
        </Text>
      </View>
    )}
  </TouchableOpacity>
),
            headerLeft: () =>
            showLoginHeader ? (
           <TouchableOpacity
            onPress={() => router.push("/login")}
            style={{ marginLeft: 15 }}
           >
          <Text style={{ color: theme.text, fontWeight: "600" , fontSize: 18}}>
           {t("login.title")}
         </Text>
         </TouchableOpacity>
          ) : null,
             tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: darkMode ? "#333" : "#ddd",
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            style={{ marginRight: 15 }}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={darkMode ? "#fff" : "#000"}
            />

            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -6,
                  backgroundColor: "red",
                  borderRadius: 10,
                  minWidth: 16,
                  height: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ),
        headerLeft: () =>
          showLoginHeader ? (
            <TouchableOpacity
              onPress={() => router.push("/login")}
              style={{ marginLeft: 15 }}
            >
              <Text style={{ color: theme.text, fontWeight: "600", fontSize: 18 }}>
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
    fontSize: 16,
    fontWeight: "600",
    marginTop: 40,

  },
  underline: {
    height: 2,
    width: "100%",
    marginTop: 2,
  },
});
