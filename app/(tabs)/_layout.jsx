import { Tabs, useRouter, usePathname } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform,StatusBar} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NotificationContext } from "../../context/NotificationContext";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { useTranslation } from "react-i18next";


export default function TabsLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const { unreadCount } = useContext(NotificationContext);
  const languages = ["English", "Albanian"];
  
 return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitle: "",
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
              color={theme.text}
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
    headerLeft: () => (
      user ? (
        <TouchableOpacity onPress={() => router.push("/profile")} style={{ marginLeft: 15 }}>
          <Image
            source={{ uri: user.photoURL || 'https://via.placeholder.com/40' }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.accent,
            }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => router.push("/login")} style={{ marginLeft: 15 }}>
          <Text style={{ color: theme.text, fontWeight: "600", fontSize: 18 }}>Login</Text>
        </TouchableOpacity>
      )
    )
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
