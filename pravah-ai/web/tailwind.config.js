/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07080b',
          900: '#0e1017',
          850: '#141620',
          800: '#1a1e2b',
          750: '#212638',
          700: '#2b3248',
          600: '#3d4766',
        },
        gold: {
          300: '#fde047',
          400: '#facc15',
          500: '#f5c518',
          600: '#eab308',
          700: '#ca8a04',
          glow: 'rgba(245, 197, 24, 0.25)',
        },
        brand: {
          red: '#ef4444',
          purple: '#a855f7',
          emerald: '#10b981',
          blue: '#3b82f6',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(245, 197, 24, 0.3)',
        'red-glow': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
        'purple-glow': '0 0 25px -5px rgba(168, 85, 247, 0.3)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
};
