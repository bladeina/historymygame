/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        byzantium: {
          night: '#0f0f1c',
          maroon: '#3b1025',
          gold: '#d4af37',
          parchment: '#f5e6c8',
        },
      },
      boxShadow: {
        gilded: '0 0 0 1px rgba(212, 175, 55, 0.5), 0 12px 24px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
