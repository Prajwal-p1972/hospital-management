import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Proxy all /api requests to the Laravel backend
      '/api': {
        target: process.env.BACKEND_URL || 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true,
      // Ignore .env files so auto-saving them in the editor doesn't trigger a full page reload
      ignored: ['**/.env*', '**/node_modules/**'],
    },
  },
})
