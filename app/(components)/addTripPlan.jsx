import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db3, auth3 } from "../../firebase/firebaseConfig";

export default function AddTripPlan() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const submitPlan = async () => {
    if (!destination || !startDate || !endDate) {
      Alert.alert("Ju lutem plotësoni të gjitha fushat.");
      return;
    }

    try {
      await addDoc(collection(db3, "tripPlans"), {
        userId: auth3.currentUser.uid,
        destination,
        startDate,
        endDate,
      });
      Alert.alert("Plani i udhëtimit u ruajt!");
      setDestination("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      Alert.alert("Gabim gjatë ruajtjes së planit.", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Destinacioni"
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        style={styles.input}
        placeholder="Data fillimit (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Data mbarimit (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />
      <Button title="Ruaj Planin" onPress={submitPlan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
});
