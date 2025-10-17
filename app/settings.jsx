import { View, Text, Switch, StyleSheet } from "react-native";
import { useState } from "react";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#222" : "#fff" }]}>
      <Text style={[styles.title, { color: darkMode ? "#fff" : "#000" }]}>⚙️ Settings</Text>

      <View style={styles.option}>
        <Text style={{ color: darkMode ? "#fff" : "#000" }}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  option: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
});
