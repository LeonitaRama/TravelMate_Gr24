import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ThemeContext } from "../../context/ThemeContext";

// ===== MOCKS =====
jest.mock("@expo/vector-icons", () => ({ Ionicons: "Ionicons" }));
jest.mock("expo-router", () => ({ useRouter: () => ({ push: jest.fn(), replace: jest.fn() }) }));
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { email: "test@example.com" } })
  ),
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { email: "test@example.com" } })
  ),
  signInWithCredential: jest.fn(() =>
    Promise.resolve({ user: { email: "test@example.com" } })
  ),
  GithubAuthProvider: jest.fn(),
}));
jest.mock("../../firebase/firebaseConfig", () => ({ auth1: {} }));
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));
jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: "fake-token" })),
  scheduleNotificationAsync: jest.fn(),
}));
jest.mock("react-native-webview", () => ({ WebView: () => null }));

// ===== IMPORT KOMPONENTI =====
import Login from "../(auth)/login.jsx"; // Sigurohu që rruga të jetë e saktë

// Wrapper për ThemeContext
const wrapper = (component) => (
  <ThemeContext.Provider value={{ darkMode: false }}>
    {component}
  </ThemeContext.Provider>
);

describe("Login Screen", () => {
  it("shfaq fushat dhe butonin LOGIN", () => {
    const { getByPlaceholderText, getByText } = render(wrapper(<Login />));

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("LOGIN")).toBeTruthy(); // përputhet me tekstin real në buton
  });

  it("lejon përdoruesin të shkruajë email dhe password", () => {
    const { getByPlaceholderText } = render(wrapper(<Login />));
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "123456");

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("123456");
  });
});
