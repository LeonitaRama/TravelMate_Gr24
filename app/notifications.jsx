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
      style={styles.container}
      edges={["top"]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Notifications
        </Text>

        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clear}>
              Clear all
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* EMPTY STATE */}
      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>
            No notifications yet
          </Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          {Object.entries(grouped).map(
            ([section, items]) =>
              items.length > 0 ? (
                <View key={section}>
                  <Text style={styles.sectionTitle}>
                    {section}
                  </Text>

                  {items.map((item) => (
                    <View
                      key={item.id}
                      style={styles.card}
                    >
                      <View style={styles.row}>
                        <View style={styles.dot} />
                        <Text style={styles.title}>
                          {item.title}
                        </Text>
                      </View>

                      <Text style={styles.body}>
                        {item.body}
                      </Text>

                      <Text style={styles.date}>
                        {new Date(
                          item.date
                        ).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null
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
