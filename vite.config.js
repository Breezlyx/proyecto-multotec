import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    cors: true,
    // Proxy API calls to the backend to avoid CORS / mixed-content issues
    // when the frontend is accessed over HTTPS (eg. via ngrok).
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '192.168.100.6',
      'nonfactually-heathy-jaqueline.ngrok-free.dev',
      '.ngrok-free.dev'
    ]
  }
})
