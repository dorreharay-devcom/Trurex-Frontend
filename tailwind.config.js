/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#8E8E93',
        gold: '#CCAB66',
        surface: '#F2F2F7',
      },
      borderRadius: {
        xl: '20px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};
