import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext", // Modern tarayıcılar için optimize et
    outDir: "dist", // Çıktı dizini
    rollupOptions: {
      output: {
        format: "es", // Modül formatı olarak ES kullan
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
