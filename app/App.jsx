import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import DestinationDetails from './DestinationDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'TravelMate' }} />
        <Stack.Screen name="DestinationDetails" component={DestinationDetails} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
