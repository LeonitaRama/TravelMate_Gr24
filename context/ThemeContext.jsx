import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

 useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem("@theme");
      if (savedTheme !== null) {
        setDarkMode(savedTheme === "dark");
      }
    })();
  }, []);

  const toggleTheme = async (value) => {
    setDarkMode(value);
    await AsyncStorage.setItem("@theme", value ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
  
};

