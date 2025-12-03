import React, { useState, useContext } from "react";
import { View, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadCloudinary } from "../../utils/uploadCloudinary";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db3, auth3 } from "../../firebase/firebaseConfig";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";

export default function AddPost() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;

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

      await addDoc(collection(db3, "posts"), {
        userId: auth3.currentUser.uid,
        imageUrl: url,
        text,
        createdAt: serverTimestamp(),
      });

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
    <View style={[styles.container, {backgroundColor:theme.background}]}>
      <TouchableOpacity style={[styles.imagePicker, {backgroundColor
        :theme.card}]
      } onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Select Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={[styles.textInput, {color:theme.textSecondary}]}
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
      <Text style={[styles.buttonText, { color: "#fff"}]}>
        {uploading ? "Posting..." : "Publish post"}
      </Text>
      </TouchableOpacity>
  </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  imagePicker: {
    height: 250,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerText: { fontSize: 18, color: "#888" },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,       // lartësi "verticale" për butonin
    paddingHorizontal: 25,     // pak gjerësi për brenda
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    minWidth: 150,             // minimale gjerësi që të mos ngushtohet shumë
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
