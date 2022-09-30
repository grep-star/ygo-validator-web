import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ygo-validator-web/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000,
  }
})
