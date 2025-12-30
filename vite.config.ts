import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-rails'

export default defineConfig({
  plugins: [
    RubyPlugin(),
  ],
  resolve: {
    alias: {
      '@': '/app/javascript',
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
})
