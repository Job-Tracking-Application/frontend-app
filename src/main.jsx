import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import AuthProvider from "./context/AuthProvider";
import LanguageProvider from "./context/LanguageProvider";
import "./i18n";
import "./index.css";

export function Root() {
    return (
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <AuthProvider>
                <LanguageProvider>
                    <Router />
                </LanguageProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("root")).render(<Root />);