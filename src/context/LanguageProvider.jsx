import React, { useState } from "react";
import LanguageContext from "./LanguageContext";
import en from "../i18n/en.json";
import mr from "../i18n/mr.json";

const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  const t = (key) => {
    const dict = lang === "en" ? en : mr;
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
