// app/auth/login.jsx
import React, { useState, useEffect } from "react";
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
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GithubAuthProvider,
} from "firebase/auth";
import { auth1 as auth } from "../../firebase/firebaseConfig";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// GitHub OAuth config
const GITHUB_CLIENT_ID = "Ov23li2C5DkV5tRMvj83";
const GITHUB_CLIENT_SECRET = "b908103ca0f8ddd230c80a26ebd1c8677301f120";

// Firebase OAuth handler URL
const REDIRECT_URI = "https://myreactnativeapp-def5a.firebaseapp.com/__/auth/handler";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // --- Input validation ---
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

  // --- Email/Password login ---
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
      } else {
        Alert.alert("Login failed", error.message);
      }
    }
  };

  // --- GitHub OAuth with Firebase ---
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ["read:user", "user:email"],
      redirectUri: REDIRECT_URI,
    },
    { authorizationEndpoint: "https://github.com/login/oauth/authorize" }
  );

  useEffect(() => {
    const handleGitHubLogin = async () => {
      if (response?.type === "success" && response.params.code) {
        const code = response.params.code;

        try {
          // Exchange code for access token
          const tokenResponse = await fetch(
            "https://github.com/login/oauth/access_token",
            {
              method: "POST",
              headers: { Accept: "application/json", "Content-Type": "application/json" },
              body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
              }),
            }
          );

          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;

          if (accessToken) {
            // Sign in with Firebase credential
            const credential = GithubAuthProvider.credential(accessToken);
            const userCredential = await signInWithCredential(auth, credential);
            await AsyncStorage.setItem("isAuthenticated", "true");
            Alert.alert(
              "Success",
              `Logged in as ${userCredential.user.displayName || userCredential.user.email}`
            );
            router.replace("/");
          } else {
            Alert.alert("Error", "Failed to get access token from GitHub");
          }
        } catch (err) {
          Alert.alert("GitHub Login Failed", err.message);
        }
      }
    };

    handleGitHubLogin();
  }, [response]);

  return (
    <ImageBackground
      source={require("../../assets/image.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <Text style={styles.title}>Log In</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#333" }]}
          onPress={() => promptAsync()} // pa useProxy
        >
          <Text style={styles.buttonText}>LOGIN WITH GITHUB</Text>
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








