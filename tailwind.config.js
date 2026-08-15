/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        rose: {
          50: '#fff1f3',
          100: '#ffe0e5',
          200: '#ffc6d0',
          300: '#ff9fb1',
          400: '#fb6a86',
          500: '#f13c60',
          600: '#dd1f47',
          700: '#b9143a',
          800: '#9a1436',
          900: '#831434',
          950: '#490718',
        },
        gold: {
          50: '#fdf9ed',
          100: '#f9edc9',
          200: '#f3da97',
          300: '#ecbf5c',
          400: '#e6a733',
          500: '#d98a20',
          600: '#bc6a18',
          700: '#974e18',
          800: '#7b3f19',
          900: '#673518',
          950: '#3b1a0b',
        },
        ink: {
          50: '#f5f6f7',
          100: '#e7e9ec',
          200: '#cdd2d9',
          300: '#a5aebb',
          400: '#758297',
          500: '#57647b',
          600: '#454f63',
          700: '#394151',
          800: '#252a35',
          900: '#15171f',
          950: '#0a0b10',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(221, 31, 71, 0.45)',
      },
    },
  },
  plugins: [],
};
