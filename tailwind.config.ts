import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',      // iPhone SE, small phones
      'sm': '640px',      // Mobile landscape, larger phones
      'md': '768px',      // Tablets, iPad
      'lg': '1024px',     // Laptop, small desktop
      'xl': '1280px',     // Desktop
      '2xl': '1536px',    // Large desktop
      // iOS specific
      'iphone': '390px',  // iPhone 12, 13, 14
      'iphone-max': '428px', // iPhone Pro Max
      'ipad': '820px',    // iPad
      'ipad-pro': '1024px', // iPad Pro
    },
    extend: {
      colors: {
        primary: {
          purple: '#6c46ff',
          pink: '#ff6ec7',
          blue: '#4dd0ff',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 70, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 110, 199, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
