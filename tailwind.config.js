/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {  
    colors:{
      'legacyBlue':'#062044',
      'button':'#28EAE9'
    },
    extend: {},
  },
  plugins: [require('daisyui')],
}

