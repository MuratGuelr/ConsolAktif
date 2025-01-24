import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    outDir: "dist",
    rollupOptions: {
      output: {
        format: "es",
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    // Add MIME type configuration
    mimeTypes: {
      "application/javascript": ["js"],
    },
  },
});
