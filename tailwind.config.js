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
        'border': '#E0E0E0',
        'primary-color': '#483EA8',
        'purple-custom': '#6961B8',
        'background-blue': '#f8f8ff'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],  // Add Poppins to the font family
      },
    },
  },
  plugins: [],
}