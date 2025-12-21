import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth1 as auth } from "../../firebase/firebaseConfig";
import * as Notifications from "expo-notifications";

/* 🔔 HANDLER */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
  };

  const sendLoginNotification = async (email) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Login Successful ✅",
        body: `Mirë se u ktheve ${email}`,
        sound: true,
      },
      trigger: null,
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Gabim", "Plotëso email dhe password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await AsyncStorage.setItem("isAuthenticated", "true");
      await sendLoginNotification(userCredential.user.email);

      Alert.alert("Sukses", "Login i suksesshëm");
      router.replace("/");
    } catch (error) {
      Alert.alert("Gabim", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/image.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.overlay}>
        <Text style={styles.title}>Log In</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#fff"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Animated.View style={{ opacity: buttonOpacity, width: "100%" }}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: { fontSize: 36, color: "#fff", marginBottom: 40 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    width: "100%",
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 45,
  },
  input: { flex: 1, color: "#fff", marginLeft: 10 },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
