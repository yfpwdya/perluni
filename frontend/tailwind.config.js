/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDFBF7',
          100: '#F7F2E6',
          200: '#EEDFB8',
          300: '#C9A84C', // emas utama
          400: '#B5903E',
          500: '#A07830', // emas gelap
          600: '#8A6326',
          700: '#6C4A1C',
          800: '#4F3514',
          900: '#38250E',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 40px rgba(201, 168, 76, 0.12)',
        glow: '0 0 15px rgba(201, 168, 76, 0.3)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)',
      },
    },
  },
  plugins: [],
};
