/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        taller: {
          50:  '#fff2ee',
          100: '#ffd9cc',
          400: '#f06030',
          500: '#e8461a',
          600: '#d13d14',
          700: '#b53310',
        },
      },
    },
  },
  plugins: [],
}

