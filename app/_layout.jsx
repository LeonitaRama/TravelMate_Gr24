import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
 
  const [isAppReady, setIsAppReady] = useState(false);
  
  const isAuthenticated = false; 

  useEffect(() => {

    setIsAppReady(true);
    SplashScreen.hideAsync();
  }, []);

  if (!isAppReady) {
    return null; 
  }


  if (!isAuthenticated) {
    return (
      <Stack>
       <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, presentation: 'modal' }} redirect />
      </Stack>
    );
  }

  return (
 <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}