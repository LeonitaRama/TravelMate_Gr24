import React, { useState, useContext } from "react";
import { View, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity, Text, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadCloudinary } from "../../utils/uploadCloudinary";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db1, auth1 } from "../../firebase/firebaseConfig";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { scheduleLocalNotification } from "../../utils/localNotifications";
import { NotificationContext } from "../../context/NotificationContext";

export default function AddPost() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const { addNotification } = useContext(NotificationContext);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("You need to allow access to photos to post.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitPost = async () => {
    if (!image) {
      Alert.alert("Please select an image.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadCloudinary(image);

      await addDoc(collection(db1, "posts"), {
        userId: auth1.currentUser.uid,
        imageUrl: url,
        text,
        createdAt: serverTimestamp(),
      });

      await scheduleLocalNotification(
        "Post published 📸",
        "Your travel post is now live"
      );
      addNotification();


      Alert.alert("Your post has been published!");
      setImage(null);
      setText("");
    } catch (error) {
      Alert.alert("Error posting:", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity style={[styles.imagePicker, {
        backgroundColor
          : theme.card
      }]
      } onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Select Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={[styles.textInput, { color: theme.textSecondary }]}
        placeholder="Write a description..."
        placeholderTextColor={theme.placeholder}
        multiline
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.button }]}
        onPress={submitPost}
      >
        <Text style={[styles.buttonText, { color: "#fff" }]}>
          {uploading ? "Posting..." : "Publish post"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // ndryshohet nga theme.background
  },
  imagePicker: {
    height: 250,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  imagePickerText: {
    fontSize: 18,
    color: "#888",
    fontWeight: "500",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  textInput: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    textAlignVertical: "top",
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
