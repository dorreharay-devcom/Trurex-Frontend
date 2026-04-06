/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['HankenGrotesk_400Regular'],
        'hk-light': ['HankenGrotesk_300Light'],
        'hk-regular': ['HankenGrotesk_400Regular'],
        'hk-medium': ['HankenGrotesk_500Medium'],
        'hk-semibold': ['HankenGrotesk_600SemiBold'],
        'hk-bold': ['HankenGrotesk_700Bold'],
        'hk-extrabold': ['HankenGrotesk_800ExtraBold'],
      },
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
        'muted-foreground': '#171717', // hsl(0 0% 9%)
        accent: '#FFFBEB', // hsl(47 100% 96%)
        'accent-foreground': '#F59B0A', // hsl(37 92% 50%)
        destructive: '#DB2424', // hsl(0 72% 50%)
        border: '#D4D4D4', // hsl(0 0% 83%)
        gold: '#CCAB66',
        sand: '#E4DBCD', // hsl(35 30% 85%)
        'sand-dark': '#3D3529', // hsl(35 20% 20%)
        'sand-muted': '#9E8F7B', // hsl(35 15% 55%)
      },
      borderRadius: {
        xl: '20px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};
