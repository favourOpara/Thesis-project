import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '169.254.37.188',   // <--- use LAN IP here
    port: 5173,
    strictPort: true},
  build: {
    sourcemap: false, // This disables source maps for the build
  },
  css: {
    devSourcemap: false, // This disables CSS source maps in development
  }
})
