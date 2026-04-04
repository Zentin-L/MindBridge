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
      boxShadow: {
        '3d': '0 10px 30px -10px rgba(0,0,0,0.1), 0 4px 8px -4px rgba(0,0,0,0.06)',
        '3d-hover': '0 20px 40px -10px rgba(0,0,0,0.15), 0 10px 20px -5px rgba(0,0,0,0.1)',
        'inner-3d': 'inset 0 4px 6px -1px rgba(0,0,0,0.08), inset 0 2px 4px -1px rgba(0,0,0,0.04)',
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
