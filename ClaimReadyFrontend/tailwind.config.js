/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cardColor: '#950000',
        buttonColor: '#E8EEF2',
        buttonHover: '#A7A7A7',
        red: '#950000',
        background: '#161616' //darker accent color (for hovering
      },
      
    },
  },
  plugins: [],
};