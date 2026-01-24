import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const LanguageSwitcher = ({ className = "" }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <select 
        value={lang} 
        onChange={(e) => setLang(e.target.value)} 
        className="form-select form-select-sm w-auto border-0 bg-transparent"
        style={{ fontSize: "0.875rem" }}
      >
        <option value="en">ENG</option>
        <option value="mr">मराठी</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;