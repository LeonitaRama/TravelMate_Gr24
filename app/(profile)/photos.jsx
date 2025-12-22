import { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity, Alert
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { auth1, db1 } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { scheduleLocalNotification } from "../../utils/localNotifications";

const MyPosts = () => {
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth1.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db1, "posts"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snapshot => {
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db1, "posts", id));
    Alert.alert("Deleted", "Your post has been deleted successfully.");
    await scheduleLocalNotification(
      "Post Deleted 🗑️",
      "Your travel post has been removed successfully."
    );
  };

  if (loading) {
    return (
      <View style={[styles.emptyText, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      ListEmptyComponent={() => (
        <View style={[{ marginTop: 300, flex: 1, width: '100%' }]}>
          <Text style={[{ color: theme.text, fontSize: 16 }]}>
            No posts yet. Go add your first post!
          </Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={[styles.postContainer, { backgroundColor: theme.card }]}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <View style={[
              styles.noImage,
              { backgroundColor: darkMode ? "#444" : "#e0e0e0" },
            ]}>
              <Text style={{ color: theme.text }}>No Image</Text>
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={[styles.postText, { color: theme.text }]} numberOfLines={3}>
              {item.text}
            </Text>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

export default MyPosts;

const styles = StyleSheet.create({
  postContainer: {
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginBottom: 10,
  },
  noImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  noImageText: {
    color: "#888",
    fontSize: 14,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postText: {
    textAlign: "center",
    flex: 1,
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
