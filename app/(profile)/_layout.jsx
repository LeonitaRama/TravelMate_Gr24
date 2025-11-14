import { Stack, useSegments } from "expo-router";
import { StatusBar } from "react-native";

export default function ProfileLayout() {
  const segments = useSegments();
  const current = segments[segments.length - 1];

  const titles = {
    personalInfo: "Edit Profile",
    photos: "My Photos",
    reviews: "My Reviews",
    profile: "My Profile",
  };

  return (
    <>
     <StatusBar 
        barStyle="dark-content" 
        backgroundColor="white"
      />
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: titles[current] || "Profile",
        }}
      />
    </>
  );
}
