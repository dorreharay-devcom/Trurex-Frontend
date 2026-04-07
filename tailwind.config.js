/** @type {import('tailwindcss').Config} */
module.exports = {
  // Required for NativeWind on web: avoids "Cannot manually set color scheme" when dark mode is `media`.
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#F5F5F5', // hsl(0 0% 96%)
        foreground: '#171717', // hsl(0 0% 9%)
        card: '#FAFAFA', // hsl(0 0% 98%)
        'card-foreground': '#171717',
        primary: '#E9560C', // hsl(20 90% 48%)
        'primary-foreground': '#FFF4EB', // hsl(33 100% 96%)
        secondary: '#525252', // hsl(0 0% 32%)
        'secondary-foreground': '#FAFAFA',
        muted: '#A1A1A1', // hsl(0 0% 63%)
        'muted-foreground': '#737373', // secondary body / links (was wrongly near-black)
        accent: '#FFFBEB', // hsl(47 100% 96%)
        'accent-foreground': '#F59B0A', // hsl(37 92% 50%)
        destructive: '#DB2424', // hsl(0 72% 50%)
        border: '#D4D4D4', // hsl(0 0% 83%)
        ring: '#D4D4D4',
        gold: '#CCAB66',
        sand: '#E4DBCD', // hsl(35 30% 85%)
        'sand-dark': '#3D3529', // hsl(35 20% 20%)
        'sand-muted': '#9E8F7B', // hsl(35 15% 55%)
      },
      borderRadius: {
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        elevated: '0 12px 24px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
