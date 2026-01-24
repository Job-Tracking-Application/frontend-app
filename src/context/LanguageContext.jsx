import { createContext, useContext, useState } from "react";
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export function useLanguage() { return useContext(LanguageContext); }

export default function LanguageProvider({ children }) {
    const { i18n } = useTranslation();
    const [lang, setLang] = useState(i18n.language || "en");

    const toggle = () => {
        const newLang = lang === "en" ? "mr" : "en";
        setLang(newLang);
        i18n.changeLanguage(newLang);
    };

    const changeLang = (newLang) => {
        setLang(newLang);
        i18n.changeLanguage(newLang);
    };

    // Enhanced translation helper with fallback
    const t = (key, options = {}) => {
        return i18n.t(key, { ...options, fallbackLng: 'en' });
    };

    return (
        <LanguageContext.Provider value={{ 
            lang, 
            setLang: changeLang, 
            toggle, 
            t,
            isLoading: !i18n.isInitialized 
        }}>
            {children}
        </LanguageContext.Provider>
    );
}