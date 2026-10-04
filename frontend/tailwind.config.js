/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#ea580c',
          600: '#c2410c',
          700: '#9a3412',
          900: '#7c2d12',
        },
        danger:  '#dc2626',
        warning: '#d97706',
        safe:    '#059669',
        surface: '#faf8f5',       // Warm cream / soft ivory background
        surfaceSubtle: '#f3efe8', // Warm sand secondary
        card:    '#ffffff',       // Crisp card
        cardSubtle: '#fbf9f6',   // Inner card surface
        cardBorder: '#e5dfd5',   // Warm soft border
        ink: {
          primary: '#1c1917',    // Deep warm ink (Stone 900)
          secondary: '#57534e',  // Warm charcoal (Stone 600)
          muted: '#78716c',      // Warm muted stone
        },
        muted:   '#e5dfd5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(249,115,22,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(249,115,22,0.7)' },
        },
      },
    },
  },
  plugins: [],
}
