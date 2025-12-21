import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Animated,
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
import { auth1 as auth } from "../../firebase/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";

/* 🔔 NOTIFICATION HANDLER (OBLIGATIVE) */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const router = useRouter();
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
  };

  const sendSignupNotification = async (email) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Signup Successful ✅",
        body: `Mirë se erdhe ${email}`,
        sound: true,
      },
      trigger: null,
    });
  };

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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Gabim", "Duhet leje për galeri");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
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
      Alert.alert("Gabim", "Plotëso të gjitha fushat");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Gabim", "Password min 6 karaktere");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Gabim", "Password nuk përputhen");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await AsyncStorage.setItem("isAuthenticated", "true");
      await sendSignupNotification(userCredential.user.email);

      Alert.alert("Sukses", "Llogaria u krijua me sukses");
      router.replace("/login");
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
        <Text style={styles.title}>Sign Up</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickProfileImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profilePic} />
          ) : (
            <Text style={{ color: "#fff" }}>Zgjedh Foto</Text>
          )}
        </TouchableOpacity>

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

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            secureTextEntry
            style={styles.input}
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
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: { width: 120, height: 120, borderRadius: 60 },
});
