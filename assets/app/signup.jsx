// app/signup.jsx
import { useState } from "react";
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const handleSignup = () => {
    if (!email || !password) return alert("Please fill all fields");
    if (password !== confirm) return alert("Passwords do not match");
    // Here you can add API call for registration
    alert("Signed up!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.input} />
      <Button title="Sign Up" onPress={handleSignup} />
      <Text style={styles.link} onPress={() => router.push("/login")}>
        Already have an account? Login
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
  link: { color: "blue", marginTop: 15, textAlign: "center" },
});
