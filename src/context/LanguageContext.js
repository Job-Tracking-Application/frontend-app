import { createContext } from "react";

// Keep contexts in a non-JSX file so HMR / fast-refresh rules don't trigger.
export const LanguageContext = createContext();

export default LanguageContext;
