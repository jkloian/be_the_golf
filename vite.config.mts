import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import RubyPlugin from 'vite-plugin-rails'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/app/javascript',
    },
  },
  optimizeDeps: {
    exclude: ['@tailwindcss/vite'],
  },
  ssr: {
    external: ['@tailwindcss/vite'],
  },
})

