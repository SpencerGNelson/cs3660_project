import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/cs3660_project/Project/flaskapp/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/professional': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/category': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/service': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
}))
