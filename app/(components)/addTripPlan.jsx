import React, { useState, useContext } from "react";
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db3, auth3 } from "../../firebase/firebaseConfig";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { scheduleLocalNotification } from "../../utils/localNotifications";

export default function AddTripPlan() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;

  const submitPlan = async () => {
    if (!destination || !startDate || !endDate) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db3, "tripPlans"), {
        userId: auth3.currentUser.uid,
        destination,
        startDate,
        endDate,

      });
      await scheduleLocalNotification(
      "Trip Reminder",
      "Mos harro udhëtimin tënd nesër ✈️"
);
      Alert.alert("Trip plan saved!");
      setDestination("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      Alert.alert("Error saving trip plan.", error.message);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor:theme.background}]}>
      <TextInput
        style={[styles.input, {backgroundColor:theme.card}]}
        placeholder="Destination"
        placeholderTextColor={theme.placeholder}
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        style={[styles.input, {backgroundColor:theme.card}]}
        placeholder="Start Date (YYYY-MM-DD)"
        placeholderTextColor={theme.placeholder}
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={[styles.input, {backgroundColor:theme.card}]}
        placeholder="End Date (YYYY-MM-DD)"
        placeholderTextColor={theme.placeholder}
        value={endDate}
        onChangeText={setEndDate}
      />
       <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.button }]}
        onPress={submitPlan}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Save Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
button: {
    paddingVertical: 14,       // lartësi "verticale" për butonin
    paddingHorizontal: 25,     // pak gjerësi për brenda
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    minWidth: 150,             // minimale gjerësi që të mos ngushtohet shumë
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

