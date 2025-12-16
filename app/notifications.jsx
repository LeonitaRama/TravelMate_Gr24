import React, { useEffect,useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  getLocalNotifications,
  clearLocalNotifications,
} from "../utils/localNotifications";
import { useFocusEffect } from "expo-router";
import { NotificationContext } from "../context/NotificationContext";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const { clearNotifications } = useContext(NotificationContext);
  
  
      useFocusEffect(
    useCallback(() => {
      clearNotifications(); // 👉 hek badge-in sapo hapet screen-i
    }, [])
  );

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getLocalNotifications();
    setNotifications(data);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={clearLocalNotifications}>
        <Text style={styles.clear}>Clear all</Text>
      </TouchableOpacity>
          <View>
      <Text>Notifications</Text>
    </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.body}</Text>
            <Text style={styles.date}>
              {new Date(item.date).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
  },
  title: { fontWeight: "bold" },
  date: { fontSize: 12, color: "#666" },
  clear: { color: "red", marginBottom: 10 },
});
