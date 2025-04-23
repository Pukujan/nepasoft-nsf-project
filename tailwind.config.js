/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#F9F9F9',
        'border': '#E0E0E0'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],  // Add Poppins to the font family
      },
    },
  },
  plugins: [],
}