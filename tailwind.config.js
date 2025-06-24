/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f8f4',
          100: '#eef1e7',
          200: '#dde3d0',
          300: '#c5d088',
          400: '#b3c26b',
          500: '#9fb153',
          600: '#8b9862',
          700: '#6d7a4c',
          800: '#56623e',
          900: '#485235',
        },
        warm: {
          50: '#fdfcf8',
          100: '#fbf9f1',
          200: '#f5f1e0',
          300: '#ebe5c8',
          400: '#ded5a8',
          500: '#cfc28a',
          600: '#bfac72',
          700: '#a8965f',
          800: '#897853',
          900: '#706247',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};