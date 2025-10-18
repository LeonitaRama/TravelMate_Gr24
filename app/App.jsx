import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native ';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to TravelMate on App 🌍</Text>
      <Link href={"/"}>Go to index</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    color: "#000",
    justifyContent: 'center',
  },
});
