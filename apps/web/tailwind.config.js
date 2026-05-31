/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0b0f19',
          card: '#161d30',
          darker: '#090d16',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          accent: '#5c8bf7',
        },
        border: {
          DEFAULT: '#1e293b',
          glass: 'rgba(255, 255, 255, 0.05)',
        }
      },
    },
  },
  plugins: [],
}
