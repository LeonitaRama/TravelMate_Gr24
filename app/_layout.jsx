import { Slot } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import '../i18n';
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </AuthProvider>
  );
}
