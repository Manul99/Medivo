import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "https://medivo-api-production.up.railway.app",//"http://localhost:8081",//"https://localhost:54335",//
        changeOrigin: true,
        secure: false,
      },
    },
  },
});