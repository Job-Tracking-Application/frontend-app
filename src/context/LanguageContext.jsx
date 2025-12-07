import React, { createContext, useContext, useState } from "react";
import { languages } from "../i18n";

const LanguageContext = createContext();

export function useLanguage() { return useContext(LanguageContext); }

export default function LanguageProvider({ children }) {
    const [lang, setLang] = useState("en");

    const toggle = () => setLang((l) => (l === "en" ? "mr" : "en"));

    // Translation helper
    const t = (key) => {
        return languages[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
            {children}
        </LanguageContext.Provider>
    );
}