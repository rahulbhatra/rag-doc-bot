import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/query": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false
      },
      "/upload": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false
      }
    }
  }
})
