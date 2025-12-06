import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import AuthProvider from "./context/AuthContext";
import LanguageProvider from "./context/LanguageContext";
import './index.css';


function Root(){
return (
<BrowserRouter>
<AuthProvider>
<LanguageProvider>
<Router />
</LanguageProvider>
</AuthProvider>
</BrowserRouter>
);
}


createRoot(document.getElementById('root')).render(<Root />);