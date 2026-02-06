/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        'primary-text': 'var(--primary-color-text)',
        surface: {
          ground: 'var(--surface-ground)',
          card: 'var(--surface-card)',
          overlay: 'var(--surface-overlay)',
          border: 'var(--surface-border)',
        },
        'text-color': 'var(--text-color)',
        'text-secondary': 'var(--text-color-secondary)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
