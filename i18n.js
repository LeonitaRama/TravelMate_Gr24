// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translation/eng.json';
import al from './translation/alb.json';

i18n
  .use(initReactI18next) // Integrates i18n with React
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: false, // Set to true for debugging
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    resources: {
      en: { translation: en },
      al: { translation: al },
    },
  });

export default i18n;
