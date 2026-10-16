import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'uniswap-pink': '#FF37C7',
        'uniswap-pink-accessible': '#F500B4',
        surface: '#FFFFFF',
        'surface-2': '#F9F9F9',
        'neutral-1': '#222222',
        'neutral-2': '#666666',
        'neutral-3': '#F2F2F2',
        'state-overlay-hover': 'rgba(0,0,0,0.04)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        swap: '0 0 10px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'swap-card': '20px',
        card: '20px',
        'pill': '9999px',
      },
      letterSpacing: {
        uniswap: '-0.02em',
      },
      spacing: {
        72: '18rem',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        pulse: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
