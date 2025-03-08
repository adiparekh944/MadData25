/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
      cardColor: '#950000',
      buttonColor: '#E8EEF2',
      buttonHover: '#A7A7A7',
      textAccent: '#D10000',
      textHover: '#910000',//darker accent color (for hovering
      background: '#D8D8D8',
      textMain:  '#B00000', 
      },
    },
  },
  plugins: [],
};
