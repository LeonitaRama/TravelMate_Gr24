import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ThemeContext } from '../../context/ThemeContext';

// --- Mock AsyncStorage ---
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// --- Mock Firebase Auth ---
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({ uid: 'test-user-123' }); 
    return jest.fn(); 
  }),
}));

// --- Mock Firebase Firestore ---
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    docs: [
      {
        id: '1',
        data: () => ({ 
          name: 'Produkti Test', 
          desc: 'Pershkrimi i produktit', 
          image: 'https://test.com/img.jpg' 
        })
      }
    ]
  })),
  deleteDoc: jest.fn(() => Promise.resolve()),
  doc: jest.fn(),
}));

// --- Mock Firebase Config ---
jest.mock('../../firebase/firebaseConfig', () => {
  return {
    auth1: { currentUser: { uid: 'test-user-123' } },
    db2: {},
  };
});

// --- Mock të tjerë ---
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// --- Import komponenti ---
import WishlistScreen from '../(tabs)/wishlist.jsx'; 

const themeProvider = (component) => (
  <ThemeContext.Provider value={{ darkMode: false }}>
    {component}
  </ThemeContext.Provider>
);

describe('Wishlist Screen Tests', () => {

  it('ngarkon dhe shfaq listen e te preferuarave pa gabime AsyncStorage', async () => {
    const { getByText } = render(themeProvider(<WishlistScreen />));

    await waitFor(() => {
      expect(getByText('Produkti Test')).toBeTruthy();
    });
  });

  it('shfaq titullin kryesor', async () => {
    const { getByText } = render(themeProvider(<WishlistScreen />));

    expect(getByText('title')).toBeTruthy();
  });

});
