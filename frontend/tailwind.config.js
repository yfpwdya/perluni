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
                    50: '#fbf8eb',
                    100: '#f5eccd',
                    200: '#eddba3',
                    300: '#e4c978',
                    400: '#d4af37', /* Classic Gold */
                    500: '#c5a028',
                    600: '#a08020',
                    DEFAULT: '#d4af37',
                },
                secondary: {
                    900: '#121212', /* Black */
                    800: '#1a1a1a',
                    700: '#2a2a2a',
                    DEFAULT: '#121212',
                },
                background: {
                    light: '#ffffff',
                    offwhite: '#f9fafb',
                    dark: '#121212', /* Keep for footer/ contrast */
                },
                surface: {
                    white: '#ffffff',
                    light: '#f3f4f6',
                }
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                display: ['"DM Serif Display"', 'serif'],
            },
            backgroundImage: {
                'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #f3e5ab 100%)',
            }
        },
    },
    plugins: [],
}
