/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/javascript/**/*.{js,jsx,ts,tsx}',
    './app/views/**/*.{html,haml,erb}',
  ],
  // In Tailwind v4, theme configuration is done via @theme in CSS
  // This config file is only for content paths and plugins
}

