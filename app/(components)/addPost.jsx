import React, { useState, useContext } from "react";
import { View, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadCloudinary } from "../../utils/uploadCloudinary";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db3, auth3 } from "../../firebase/firebaseConfig";

export default function AddPost() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Duhet të lejoni aksesin në fotot për të postuar.");
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
      Alert.alert("Ju lutem zgjidhni një foto.");
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

      Alert.alert("Postimi u publikua!");
      setImage(null);
      setText("");
    } catch (error) {
      Alert.alert("Gabim gjatë postimit:", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Zgjidh Foto</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.textInput}
        placeholder="Shkruaj një përshkrim..."
        multiline
        value={text}
        onChangeText={setText}
      />

      <Button title={uploading ? "Po publikohet..." : "Publiko Postimin"} onPress={submitPost} disabled={uploading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  imagePicker: {
    height: 250,
    backgroundColor: "#eee",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerText: { fontSize: 18, color: "#888" },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  textInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
    fontSize: 16,
  },
});
