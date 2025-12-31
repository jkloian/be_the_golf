/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/javascript/**/*.{js,jsx,ts,tsx}',
    './app/views/**/*.html.erb',
  ],
  theme: {
    extend: {
      colors: {
        // Premium golf-inspired palette - flat structure for Tailwind v4
        'golf-deep': '#0F3D2E',
        'golf-emerald': '#1F6F54',
        'golf-light': '#E8F5F0',
        'golf-soft': '#D4EDE4',
        // Neutrals (calm, premium)
        'neutral-offwhite': '#F7F9F8',
        'neutral-surface': '#FFFFFF',
        'neutral-text': '#0B1F17',
        'neutral-textSecondary': '#5F6F68',
        'neutral-border': '#E5EAE8',
        'neutral-borderHover': '#D1D9D5',
        // Accent (sparingly used)
        'accent-gold': '#C9A24D',
        // DISC colors (refined)
        'disc-drive': '#c2410c',
        'disc-inspire': '#d97706',
        'disc-steady': '#16a34a',
        'disc-control': '#2563eb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(15, 61, 46, 0.08)',
        'card': '0 2px 8px 0 rgba(15, 61, 46, 0.06)',
        'cardHover': '0 4px 12px 0 rgba(15, 61, 46, 0.1)',
        'elevated': '0 8px 24px 0 rgba(15, 61, 46, 0.12)',
      },
      borderRadius: {
        'golf': '0.75rem',
      },
      transitionDuration: {
        'golf': '300ms',
      },
      maxWidth: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
}

