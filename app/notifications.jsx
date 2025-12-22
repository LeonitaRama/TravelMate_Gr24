import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationContext } from "../context/NotificationContext";
import { darkTheme, lightTheme } from "../context/ThemeStyles";
import { ThemeContext } from "../context/ThemeContext";
import {
  getLocalNotifications,
  clearLocalNotifications,
} from "../utils/localNotifications";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


const groupNotificationsByDate = (notifications) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const groups = {
    Today: [],
    Yesterday: [],
    Older: [],
  };

  notifications.forEach((n) => {
    const nDate = new Date(n.date);

    if (nDate.toDateString() === today.toDateString()) {
      groups.Today.push(n);
    } else if (
      nDate.toDateString() === yesterday.toDateString()
    ) {
      groups.Yesterday.push(n);
    } else {
      groups.Older.push(n);
    }
  });

  return groups;
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const { clearNotifications } =
    useContext(NotificationContext);

  /* Clear badge when screen opens */
  useFocusEffect(
    useCallback(() => {
      clearNotifications();
    }, [])
  );

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const data = await getLocalNotifications();

    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setNotifications(data.reverse());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const clearAll = async () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    await clearLocalNotifications();
    setNotifications([]);
  };

  const grouped =
    groupNotificationsByDate(notifications);

 return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Notifications
        </Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAll}>
            <Text style={[styles.clear, { color: theme.accent }]}>
              Clear all
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No notifications yet
          </Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.text} // ngjyra pull-to-refresh
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {Object.entries(grouped).map(
            ([section, items]) =>
              items.length > 0 && (
                <View key={section}>
                  <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    {section}
                  </Text>
                  {items.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.card, { backgroundColor: theme.card }]}
                    >
                      <View style={styles.row}>
                        <View style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
                        <Text style={[styles.title, { color: theme.text }]}>
                          {item.title}
                        </Text>
                      </View>

                      <Text style={[styles.body, { color: theme.textSecondary }]}>
                        {item.body}
                      </Text>

                      <Text style={[styles.date, { color: theme.textSecondary }]}>
                        {new Date(item.date).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </View>
              )
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  clear: {
    color: "#ff4757",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#777",
    marginVertical: 10,
    textTransform: "uppercase",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginRight: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  body: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },

  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
