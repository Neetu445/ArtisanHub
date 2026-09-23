/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        terra: { 50:'#fdf5f0',100:'#fae8dc',200:'#f4cdb4',300:'#ecab83',400:'#e28150',500:'#d9622e',600:'#b5532d',700:'#963f23',800:'#7a3521', 900:'#642e1f' },
        cream: '#fbf6ef',
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'], serif: ['Georgia','serif'] },
    },
  },
  plugins: [],
}
