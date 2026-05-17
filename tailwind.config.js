/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          light: '#A855F7',
        },
        secondary: {
          DEFAULT: '#F97316',
        },
        success: {
          DEFAULT: '#10B981',
        },
        pink: {
          DEFAULT: '#F472B6',
        },
        foreground: '#1E1B4B',
        'body-text': '#64748B',
        caption: '#94A3B8',
        background: '#FFFBF5',
        'card-sub': '#F5F0FF',
        border: '#E2E8F0',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'btn': '9999px',
      },
      boxShadow: {
        'card': 'rgba(124, 58, 237, 0.08) 0px 2px 12px',
        'card-sm': 'rgba(124, 58, 237, 0.08) 0px 2px 8px, rgba(0, 0, 0, 0.05) 0px 1px 3px',
        'btn-primary': 'rgba(124, 58, 237, 0.2) 0px 4px 12px',
        'btn-secondary': 'rgba(124, 58, 237, 0.08) 0px 2px 8px',
        'card-lg': '0 4px 40px rgba(124, 58, 237, 0.08)',
        'soft': '0 4px 30px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
