import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { auth3, db3 } from "../../firebase/firebaseConfig";
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from "firebase/firestore";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";

const MyPosts = () => {
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;

  const [posts, setPosts] = useState([]);
  const router = useRouter();

  const currentUserId = auth3.currentUser.uid;

  useEffect(() => {
    const q = query(
      collection(db3, "posts"),
      where("userId", "==", currentUserId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleDeletePost = (postId) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db3, "posts", postId));
            } catch (error) {
              alert("Error deleting post: " + error.message);
            }
          }
        }
      ]
    );
  };

  if (posts.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          You have no posts yet.
        </Text>

        {/* Add Post button when no posts */}
        <TouchableOpacity style={[styles.addPostButton, { marginTop: 20 }, ]} onPress={() => router.push("/addPost")}>
          <Text style={styles.addPostButtonText}>+ Add New Post</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header with title and Add Post button */}
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>🧳 My Posts</Text>
        <TouchableOpacity style={styles.addPostButton} onPress={() => router.push("/addPost")}>
          <Text style={styles.addPostButtonText}>+ Add New Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.postContainer, { backgroundColor: theme.card }]}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={[styles.text, { color: theme.text }]}>{item.text}</Text>
            <TouchableOpacity
              style={styles.deleteIconButton}
              onPress={() => handleDeletePost(item.id)}
            >
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default MyPosts;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  addPostButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  addPostButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  postContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
  },
  deleteIconButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
    backgroundColor: "rgba(255, 59, 48, 0.15)",
    borderRadius: 20,
  },
});
