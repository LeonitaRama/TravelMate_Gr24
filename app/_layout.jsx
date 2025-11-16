import { Slot } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import '../i18n';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
