import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeContext } from '../../context/ThemeContext';
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null); // nuk ka user
    return jest.fn(); // unsubscribe
  }),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ empty: true })),
}));

// --- Mock Firebase dhe modulë të tjerë jashtë ---
jest.mock('../../firebase/firebaseConfig', () => {
  return {
    auth1: { currentUser: null },
    db2: {},
    onAuthStateChanged: jest.fn((auth, callback) => {
      callback(null); // nuk ka user gjatë testit
      return jest.fn(); // unsubscribe
    }),
    collection: jest.fn(),
    addDoc: jest.fn(() => Promise.resolve()),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(() => Promise.resolve({ empty: true })),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-linking', () => ({ openURL: jest.fn() }));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../utils/localNotifications', () => ({
  scheduleLocalNotification: jest.fn(() => Promise.resolve()),
}));

// --- Importo komponentin pasi mocks janë vendosur ---
import Details from '../(tabs)/explore.jsx';

const themeProvider = (component) => (
  <ThemeContext.Provider value={{ darkMode: false }}>
    {component}
  </ThemeContext.Provider>
);

describe('Explore (Details) Screen', () => {

  it('shfaq titullin dhe fushën e kërkimit', () => {
    const { getByText, getByPlaceholderText } = render(themeProvider(<Details />));

    expect(getByText('details.title')).toBeTruthy();
    expect(getByPlaceholderText('details.search.placeholder')).toBeTruthy();
  });

  it('filtrat e destinacioneve funksionojnë kur shkruajmë në kërkim', () => {
    const { getByPlaceholderText, queryByText } = render(themeProvider(<Details />));
    const searchInput = getByPlaceholderText('details.search.placeholder');

    fireEvent.changeText(searchInput, 'Budva');

    expect(queryByText('Budva, Montenegro')).toBeTruthy();
    expect(queryByText('Zermatt, Switzerland')).toBeNull();
  });

});
