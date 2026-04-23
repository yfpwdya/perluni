/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bcddff',
          300: '#91c7ff',
          400: '#60abff',
          500: '#3c8df4',
          600: '#1f76de',
          700: '#1c62c4',
          800: '#1d539f',
          900: '#1d4882',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 40px rgba(31, 118, 222, 0.12)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1f76de 0%, #3c8df4 56%, #6cb6ff 100%)',
      },
    },
  },
  plugins: [],
};
