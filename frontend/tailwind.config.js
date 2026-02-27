/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/navigation/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#db1f2f',
        'background-light': '#f8f6f6',
        'background-dark': '#211113',
        border: '#E0E0E0',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
