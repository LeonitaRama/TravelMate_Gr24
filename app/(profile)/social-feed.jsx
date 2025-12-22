import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDocs,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth1, db1 } from "../../firebase/firebaseConfig";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";

export default function SocialTravelFeed() {
  const [posts, setPosts] = useState([]);
  const [travelBuddies, setTravelBuddies] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  const router = useRouter();
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;

  const currentUserId = auth1.currentUser?.uid;

  // 🔹 Guard
  useEffect(() => {
    if (auth1.currentUser) {
      setLoadingUser(false);
    }
  }, []);

  // 🔹 Fetch posts
  useEffect(() => {
    const q = query(collection(db1, "posts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, snapshot => {
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  // 🔹 Fetch travel buddies
  useEffect(() => {
    if (!currentUserId) return;

    const fetchBuddies = async () => {
      const myPlansSnap = await getDocs(
        query(collection(db1, "tripPlans"), where("userId", "==", currentUserId))
      );

      if (myPlansSnap.empty) return;

      const myTrip = myPlansSnap.docs[0].data();

      const buddiesSnap = await getDocs(
        query(
          collection(db1, "tripPlans"),
          where("destination", "==", myTrip.destination)
        )
      );

      const matches = buddiesSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(buddy => {
          if (buddy.userId === currentUserId) return false;

          return (
            new Date(myTrip.startDate) <= new Date(buddy.endDate) &&
            new Date(buddy.startDate) <= new Date(myTrip.endDate)
          );
        });

      setTravelBuddies(matches);
    };

    fetchBuddies();
  }, [currentUserId]);

  const handleDeletePost = (postId) => {
    Alert.alert("Delete Post", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db1, "posts", postId));
        },
      },
    ]);
  };

  if (loadingUser || !currentUserId) {
    return (
      <View style={styles.center}>
        <Text>Loading user...</Text>
      </View>
    );
  }

  const myPosts = posts.filter(p => p.userId === currentUserId);
  const otherPosts = posts.filter(p => p.userId !== currentUserId);

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/addPost")}
            >
              <Text style={styles.buttonText}>Post Your Trip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/addTripPlan")}
            >
              <Text style={styles.buttonText}>Add Trip Plan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buddiesContainer}>
            <Text style={styles.text}>Travel Buddies</Text>
            {travelBuddies.length === 0 ? (
              <Text style={styles.text}>No matching itineraries</Text>
            ) : (
              travelBuddies.map(b => (
                <View key={b.id} style={styles.buddyCard}>
                  <Text>{b.destination}</Text>
                  <Text>{b.startDate} → {b.endDate}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.postsSectionContainer}>
            <Text style={styles.text}>My Posts</Text>
            {myPosts.map(post => (
              <View key={post.id} style={styles.postCard}>
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                <Text>{post.text}</Text>
                <TouchableOpacity onPress={() => handleDeletePost(post.id)}>
                  <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.postsSectionContainer}>
            <Text style={styles.text}>Other Posts</Text>
            {otherPosts.map(post => (
              <View key={post.id} style={styles.postCard}>
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                <Text>{post.text}</Text>
              </View>
            ))}
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 12,
  },
  button: {
    padding: 12,
    backgroundColor: "#2196F3",
    borderRadius: 6,
    marginBottom: 8,
  },
  text: {
textAlign: "center"
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  postsSectionContainer: {
    padding: 12,
  },
  postCard: {
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});
