import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070402',
        coal: '#100b07',
        cream: '#efe8d8',
        champagne: '#d8ad45',
        mist: '#bdb2a2',
      },
      fontFamily: {
        serif: ['var(--font-royal-serif)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-royal-sans)', 'Inter', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        royal: '0 28px 90px rgba(216, 173, 69, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
