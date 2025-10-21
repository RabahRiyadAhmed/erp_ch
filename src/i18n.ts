import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector'; 
import { initReactI18next } from "react-i18next";

import translationEn from "./locales/en/translation.json";
import translationFr from "./locales/fr/translation.json";
import translationAr from "./locales/ar/translation.json";


//translations
const resources = {
  en: {
    translation: translationEn,
  },
  fr: {
    translation: translationFr,
  },
  ar: {
    translation: translationAr,
  },

};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false, // Affiche la clé si la traduction est manquante
  });
