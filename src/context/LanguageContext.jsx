import React, { createContext, useContext, useState } from "react";
const LanguageContext = createContext();
export function useLanguage() { return useContext(LanguageContext); }
export default function LanguageProvider({ children }){
const [lang, setLang] = useState("en");
const toggle = () => setLang((l) => (l === "en" ? "mr" : "en"));
return (
<LanguageContext.Provider value={{ lang, toggle }}>
{children}
</LanguageContext.Provider>
);
}