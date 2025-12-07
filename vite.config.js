/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    preview: {
      allowedHosts: ["job-tracking-application-frontend.onrender.com"],
      host: "0.0.0.0",
      // Render gives PORT only at runtime, so fallback for local
      port: command === "preview" ? (process.env.PORT ? Number(process.env.PORT) : 5173) : 5173
    }
  };
});