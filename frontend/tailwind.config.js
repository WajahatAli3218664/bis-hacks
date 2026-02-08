/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          primary: '#9333EA',
          light: '#A855F7',
          dark: '#7E22CE',
          bg: '#F3E8FF',
          text: '#581C87',
        },
      },
    },
  },
  plugins: [],
}
