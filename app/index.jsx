import { View, Text, Button, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Welcome to TravelMate on Index 🌍</Text>
            <Link style={styles.text} href={"/App"}>Go to App</Link>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        backgroundColor: "#000"
    },
    text: {
        color: "#fff",
    }
});
