import React from "react";
import { useLanguage } from "../../context/useLanguage";

const LanguageSettings = () => {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">{t("Language Settings")}</h1>

      <div className="mb-3 d-flex align-items-center gap-2">
        <label className="mb-0">{t("Choose Language")}:</label>
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="form-select w-auto"
        >
          <option value="en">English</option>
          <option value="mr">मराठी</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSettings;