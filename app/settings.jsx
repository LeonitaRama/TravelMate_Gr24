import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext"; // vendos path sipas strukturës

export default function SettingsScreen() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [modalVisible, setModalVisible] = useState(false);

  const languages = ["English", "Albanian", "German"];

  const handlePress = (option) => {
    if (option === "Log Out") {
      Alert.alert("Logged Out", "You have been logged out.");
    } else {
      Alert.alert(`${option} clicked`);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const selectLanguage = (lang) => {
    setLanguage(lang);
    closeModal();
  };

  const settingsOptions = [
    { title: "Edit Profile", icon: "person-outline" },
    { title: "Notifications", icon: "notifications-outline" },
    { title: "Change Language", icon: "globe-outline" },
    { title: "Dark Mode", icon: "moon-outline" },
    { title: "Log Out", icon: "log-out-outline" },
  ];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#222" : "#fff" },
      ]}
    >
      <Text
        style={[styles.header, { color: darkMode ? "#fff" : "#007bff" }]}
      >
        ⚙️ Settings
      </Text>

      {settingsOptions.map((item, index) => {
        const textColor = darkMode ? "#fff" : "#333";
        const bgColor = darkMode ? "#333" : "#f9f9f9";
        const iconColor = "#007bff";

        if (item.title === "Notifications") {
          return (
            <View
              key={index}
              style={[styles.option, { backgroundColor: bgColor }]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={22} color={iconColor} />
              </View>
              <Text style={[styles.optionText, { color: textColor }]}>
                {item.title}
              </Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            </View>
          );
        } else if (item.title === "Change Language") {
          return (
            <TouchableOpacity
              key={index}
              style={[styles.option, { backgroundColor: bgColor }]}
              onPress={openModal}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={22} color={iconColor} />
              </View>
              <Text style={[styles.optionText, { color: textColor }]}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.languageText,
                  { color: darkMode ? "#ccc" : "#555" },
                ]}
              >
                {language}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          );
        } else if (item.title === "Dark Mode") {
          return (
            <View
              key={index}
              style={[styles.option, { backgroundColor: bgColor }]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={22} color={iconColor} />
              </View>
              <Text style={[styles.optionText, { color: textColor }]}>
                {item.title}
              </Text>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
          );
        } else {
          return (
            <TouchableOpacity
              key={index}
              style={[styles.option, { backgroundColor: bgColor }]}
              onPress={() => handlePress(item.title)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={22} color={iconColor} />
              </View>
              <Text style={[styles.optionText, { color: textColor }]}>
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          );
        }
      })}

      {/* Modal për Change Language */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {languages.map((lang, index) => (
              <Pressable
                key={index}
                style={styles.modalOption}
                onPress={() => selectLanguage(lang)}
              >
                <Text style={styles.modalText}>{lang}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.modalClose} onPress={closeModal}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 30,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  languageText: {
    marginRight: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  modalText: { fontSize: 18, textAlign: "center" },
  modalClose: {
    marginTop: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
});
