/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f7f3ee',
        parchment: '#ede8e0',
        sage: '#7a9e7e',
        'sage-light': '#a8c5ab',
        'sage-dark': '#4a6e4e',
        dusk: '#6b7fa3',
        'dusk-light': '#9aacc5',
        rose: '#c9837a',
        amber: '#d4935a',
        ink: '#2c3030',
        'ink-soft': '#4a5050',
      },
      fontFamily: {
        serif: ['DM Serif Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.glass': {
          '@apply backdrop-blur-xl bg-white/30 border border-white/60': {},
        },
        '.glass-strong': {
          '@apply backdrop-blur-xl bg-white/50 border border-white/80': {},
        },
      })
    },
  ],
}
