import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { collection, onSnapshot, orderBy, query, getDocs, where, deleteDoc, doc } from "firebase/firestore";
import { db3, auth3 } from "../../firebase/firebaseConfig";
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SocialTravelFeed() {
  const [posts, setPosts] = useState([]);
  const [travelBuddies, setTravelBuddies] = useState([]);
  const router = useRouter();

  const currentUserId = auth3.currentUser.uid;

  // Fetch posts ordered by creation date desc
  useEffect(() => {
    const q = query(collection(db3, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snapshot => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  // Fetch trip plans and find matching travel buddies
  useEffect(() => {
    async function findTravelBuddies() {
      const userId = currentUserId;

      const myPlansSnapshot = await getDocs(
        query(collection(db3, "tripPlans"), where("userId", "==", userId))
      );

      if (myPlansSnapshot.empty) return;

      const myTrip = myPlansSnapshot.docs[0].data();

      const buddiesQuery = query(
        collection(db3, "tripPlans"),
        where("destination", "==", myTrip.destination)
      );

      const buddiesSnapshot = await getDocs(buddiesQuery);

      const filteredBuddies = buddiesSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(buddy => {
          if (buddy.userId === userId) return false;

          const start1 = new Date(myTrip.startDate);
          const end1 = new Date(myTrip.endDate);
          const start2 = new Date(buddy.startDate);
          const end2 = new Date(buddy.endDate);

          return start1 <= end2 && start2 <= end1;
        });

      setTravelBuddies(filteredBuddies);
    }

    findTravelBuddies();
  }, []);

  // Function to handle deleting a post
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
              // post will be removed automatically by onSnapshot listener
            } catch (error) {
              alert("Error deleting post: " + error.message);
            }
          }
        }
      ]
    );
  };

  // Separate posts by current user and others
  const myPosts = posts.filter(post => post.userId === currentUserId);
  const otherPosts = posts.filter(post => post.userId !== currentUserId);

  // Header with buttons and travel buddies section
  const ListHeader = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/addPost")}>
          <Text style={styles.buttonText}>Post Your Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/addTripPlan")}>
          <Text style={styles.buttonText}>Add Trip Plan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buddiesContainer}>
        <Text style={styles.sectionTitleSmall}>🚀 Travel Buddies With Matching Itineraries</Text>
        {travelBuddies.length === 0 ? (
          <Text style={styles.noBuddiesText}>
            No users found with matching itineraries.
          </Text>
        ) : (
          travelBuddies.map(buddy => (
            <View key={buddy.id} style={styles.buddyCard}>
              <Text style={styles.buddyText}>User: {buddy.userId}</Text>
              <Text style={styles.buddyText}>Destination: {buddy.destination}</Text>
              <Text style={styles.buddyText}>{buddy.startDate} → {buddy.endDate}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      data={[]}
      contentContainerStyle={styles.container}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={
        <>
          {/* My Posts Section */}
          <View style={styles.postsSectionContainer}>
            <Text style={styles.sectionTitle}>🧳 My Posts</Text>
            {myPosts.length === 0 ? (
              <Text style={styles.noBuddiesText}>No posts yet.</Text>
            ) : (
              myPosts.map(post => (
                <View key={post.id} style={styles.postCard}>
                  <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                  <Text style={styles.postText}>{post.text}</Text>
                  <TouchableOpacity
                    style={styles.deleteIconButton}
                    onPress={() => handleDeletePost(post.id)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Other Posts Section */}
          <View style={[styles.postsSectionContainer, { marginTop: 30 }]}>
            <Text style={styles.sectionTitle}>🌍 Other Posts</Text>
            {otherPosts.length === 0 ? (
              <Text style={styles.noBuddiesText}>No posts from other users yet.</Text>
            ) : (
              otherPosts.map(post => (
                <View key={post.id} style={styles.postCard}>
                  <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                  <Text style={styles.postText}>{post.text}</Text>
                </View>
              ))
            )}
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#f0f4f8", paddingBottom: 60 },
  header: { marginBottom: 15 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 10, textAlign: "center", color: "#333" },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "600", fontSize: 16 },
  postCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  postImage: { width: "100%", height: 260, resizeMode: "cover" },
  postText: { padding: 12, fontSize: 16, color: "#444" },
  deleteIconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderRadius: 20,
  },
  buddiesContainer: {
    marginTop: 10,
    padding: 15,
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#aaa",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#222" },
  sectionTitleSmall: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#555" },
  noBuddiesText: { textAlign: "center", marginVertical: 10, color: "#999", fontStyle: "italic" },
  buddyCard: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  buddyText: { fontSize: 16, color: "#555" },
  postsSectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#aaa",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
});
