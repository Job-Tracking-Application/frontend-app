import { useEffect, useState } from "react";
import i18n from "../i18n";
import { LanguageContext } from "./languageContext";

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const onLanguageChanged = (lng) => {
      setLanguage(lng);
    };

    i18n.on("languageChanged", onLanguageChanged);

    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, []);

  const changeLanguage = (lng) => {
    if (lng !== language) {
      i18n.changeLanguage(lng);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t: i18n.t.bind(i18n),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}