/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E4D2B',
        'primary-light': '#4A7C59',
        accent: '#8B6914',
        background: '#F5F0E8',
      },
    },
  },
  plugins: [],
}
