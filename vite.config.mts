import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-rails'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/app/javascript',
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  optimizeDeps: {
    exclude: ['@tailwindcss/vite'],
  },
  ssr: {
    external: ['@tailwindcss/vite'],
  },
})

