import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated } from "react-native";



import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth1 as auth } from '../../firebase/firebaseConfig';

import * as ImagePicker from "expo-image-picker";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
  const router = useRouter();


    // Button opacity animation
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonOpacity, {
        toValue: 0.5,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

    const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };


  const validateInputs = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return false;
    }

    // Validim email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return false;
    }

 
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }


    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem("isAuthenticated", "true");
      Alert.alert("Success", `Account created: ${userCredential.user.email}`);
      router.replace("/login"); 
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Email is already in use");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email");
      } else {
        Alert.alert("Signup failed", error.message);
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/image.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <Text style={styles.title}>Sign Up</Text>

         <TouchableOpacity onPress={pickProfileImage} style={styles.imagePicker}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profilePic} />
          ) : (
            <Text style={{ color: "#fff" }}>Choose Profile Image</Text>
          )}
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#fff" style={styles.icon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#fff"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#fff"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.icon} />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

       <Animated.View style={{ opacity: buttonOpacity, width: "100%" }}>
  <TouchableOpacity
    style={styles.button}
    onPress={() => {
      animateButton();
      handleSignup();
    }}
  >
    <Text style={styles.buttonText}>SIGN UP</Text>
  </TouchableOpacity>
</Animated.View>


        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.signupText}>Already have an account? LOGIN</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: { fontSize: 36, fontWeight: "bold", color: "white", marginBottom: 60 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 30,
    width: "100%",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#fff", height: 45 },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 30,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  signupText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 20,
    textDecorationLine: "underline",
  },
});





