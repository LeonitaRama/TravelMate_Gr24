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
  Modal,
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
import { WebView } from "react-native-webview";
import { auth1 as auth } from "../../firebase/firebaseConfig";

const GITHUB_CLIENT_ID = "Ov23li2C5DkV5tRMvj83";
const GITHUB_CLIENT_SECRET = "b908103ca0f8ddd230c80a26ebd1c8677301f120";

const REDIRECT_URI =
  "https://myreactnativeapp-def5a.firebaseapp.com/__/auth/handler";

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await AsyncStorage.setItem("isAuthenticated", "true");
      Alert.alert("Success", `Login successful: ${userCredential.user.email}`);
      router.replace("/");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        try {
          const newUser = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await AsyncStorage.setItem("isAuthenticated", "true");
          Alert.alert(
            "Success",
            `Account created and logged in: ${newUser.user.email}`
          );
          router.replace("/");
        } catch (signupError) {
          Alert.alert("Signup failed", signupError.message);
        }
      } else {
        Alert.alert("Login failed", error.message);
      }
    }
  };

  // ---------------------------
  // GITHUB LOGIN STATE & WEBVIEW
  // ---------------------------

  const [githubVisible, setGithubVisible] = useState(false);

  const handleGitHubCode = async (code) => {
    try {
      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
          }),
        }
      );

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        Alert.alert("Error", "Failed to get access token");
        return;
      }

      const credential = GithubAuthProvider.credential(accessToken);
      const userCredential = await signInWithCredential(auth, credential);

      await AsyncStorage.setItem("isAuthenticated", "true");

      Alert.alert(
        "Success",
        `Logged in as ${
          userCredential.user.displayName || userCredential.user.email
        }`
      );

      router.replace("/");
    } catch (err) {
      Alert.alert("GitHub Login Failed", err.message);
    }
  };

  const loginUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=read:user%20user:email&redirect_uri=${REDIRECT_URI}`;

  const handleNavChange = (event) => {
    if (event.url.startsWith(REDIRECT_URI)) {
      const codeMatch = event.url.match(/[?&]code=([^&]+)/);
      const code = codeMatch ? codeMatch[1] : null;

      if (code) {
        handleGitHubCode(code);
      }
      setGithubVisible(false);
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
          <Ionicons name="person-outline" size={20} color="#fff" />
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
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
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
          onPress={() => setGithubVisible(true)}
        >
          <Text style={styles.buttonText}>LOGIN WITH GITHUB</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.signupText}>
            Don't have an account? SIGN UP
          </Text>
        </TouchableOpacity>

        {/* GitHub WebView Modal */}
        <Modal visible={githubVisible} animationType="slide">
          <WebView
            source={{ uri: loginUrl }}
            onNavigationStateChange={handleNavChange}
          />
        </Modal>
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
    height: 45,
  },
  input: { flex: 1, color: "#fff", marginLeft: 10 },
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
    marginTop: 20,
    textDecorationLine: "underline",
  },
});








