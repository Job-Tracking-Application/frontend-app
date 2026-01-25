import React from "react";
import { useLanguage } from "../../context/useLanguage";


const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="form-select form-select-sm w-auto"
    >
      <option value="en">ENG</option>
      <option value="mr">मराठी</option>
    </select>
  );
};

export default LanguageSwitcher;