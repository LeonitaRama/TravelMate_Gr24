import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth1 as auth } from '../../firebase/firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const validateInputs = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return false;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

  

    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem("isAuthenticated", "true");
      Alert.alert("Success", `Login successful: ${userCredential.user.email}`);
      router.replace("/"); 
    } catch (error) {
      if (error.code === "auth/user-not-found") {
       
        try {
          const newUser = await createUserWithEmailAndPassword(auth, email, password);
          await AsyncStorage.setItem("isAuthenticated", "true");
          Alert.alert("Success", `Account created and logged in: ${newUser.user.email}`);
          router.replace("/");
        } catch (signupError) {
          Alert.alert("Signup failed", signupError.message);
        }
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Wrong password");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email");
      } else {
        Alert.alert("Login failed", error.message);
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
        <Text style={styles.title}>Log In</Text>

        <View style={styles.inputWrapper}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#fff"
            style={styles.icon}
          />
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
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#fff"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/signup")}>
          <Text style={styles.signupText}>Don't have an account? SIGN UP</Text>
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
