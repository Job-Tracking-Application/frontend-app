/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["job-tracking-application-frontend.onrender.com"],
    host: "0.0.0.0",
    port: import.meta.env.PORT ? Number(import.meta.env.PORT) : 5173
  }
});