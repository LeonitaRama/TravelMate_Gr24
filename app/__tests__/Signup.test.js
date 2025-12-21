import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeContext } from '../../context/ThemeContext';

// ===== MOCKS =====
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { uid: 'test-user' } })
  ),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getExpoPushTokenAsync: jest.fn(() =>
    Promise.resolve({ data: 'fake-token' })
  ),
}));

// 🔥 MOCK KRITIK
jest.mock('../../firebase/firebaseConfig', () => ({
  auth1: {},
  db2: {},
}));

// ===== IMPORT KOMPONENTI =====
import Signup from '../(auth)/signup.jsx';

const wrapper = (component) => (
  <ThemeContext.Provider value={{ darkMode: false }}>
    {component}
  </ThemeContext.Provider>
);

describe('Signup Screen', () => {
  it('shfaq fushat dhe butonin SIGN UP', () => {
    const { getByPlaceholderText, getByText } =
      render(wrapper(<Signup />));

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('SIGN UP')).toBeTruthy();
  });
});
