import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to TravelMate 🌍</Text>
      <Link href="/details">Go to Destination Details</Link>
    </View>
  );
}
