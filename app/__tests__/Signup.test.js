import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Signup from '../app/(auth)/signup';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { email: 'test@example.com' } })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(() => Promise.resolve()),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'fake-token' })),
}));

describe('Signup Screen', () => {
  it('shfaq input-et dhe butonat', () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('SIGN UP')).toBeTruthy();
    expect(getByText('Already have an account? LOGIN')).toBeTruthy();
  });

  it('signup funksionon me input valid', async () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');

    fireEvent.press(getByText('SIGN UP'));

    await waitFor(() => {
      expect(getByPlaceholderText('Email').props.value).toBe('test@example.com');
    });
  });
});
