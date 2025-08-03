import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.tsx",
  },
  server: {
    proxy: {
      "/query": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/upload": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/sessions": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
