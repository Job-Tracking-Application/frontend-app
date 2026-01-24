import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from "./en.json";
import mr from "./mr.json";

const resources = {
  en: { translation: en },
  mr: { translation: mr }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
export const languages = { en, mr };