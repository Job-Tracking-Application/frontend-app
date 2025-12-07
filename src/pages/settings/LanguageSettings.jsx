import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const LanguageSettings = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Language Settings</h1>

      <div className="mb-3 d-flex align-items-center gap-2">
        <label className="mb-0">Choose Language:</label>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="form-select w-auto">
          <option value="en">English</option>
          <option value="mr">मराठी</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSettings;
