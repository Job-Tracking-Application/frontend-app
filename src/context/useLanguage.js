import { useContext } from "react";
import { LanguageContext } from "./languageContext";

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return ctx;
};