import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://expense-tracker-be-3-zayd.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
