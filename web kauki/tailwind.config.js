/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        accent: {
          DEFAULT: '#EDE9FE',
          50: '#FAF5FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
        },
        bg: '#F8FAFC',
        darkText: '#1E1B4B',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(30, 27, 75, 0.06), 0 2px 8px -1px rgba(30, 27, 75, 0.04)',
        'elevated': '0 20px 40px -10px rgba(59, 130, 246, 0.15), 0 8px 16px -4px rgba(139, 92, 246, 0.1)',
        'glow-primary': '0 0 30px rgba(59, 130, 246, 0.3)',
        'glow-secondary': '0 0 30px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
