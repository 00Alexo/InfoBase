/** @type {import('tailwindcss').Config} */
const {heroui} = require("@heroui/theme");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      },
      keyframes: {
      },
      animation: {
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    defaultTheme: "dark",
    defaultExtendTheme: "dark",
    themes: {
      light: {
        colors: {},
      },
      dark: {
        colors: {},
      },
    },
  })],
};