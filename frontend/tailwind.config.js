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
        // InfoBase Custom Brand Colors
        primaryCustom: "#ef4444",      // red-500 - main brand color
        primaryCustomHover: "#dc2626", // red-600 - hover states
        secondaryCustom: "#f87171",    // red-400 - lighter accent
        secondaryCustomHover: "#ef4444", // red-500 - secondary hover
        accentCustom: "#fca5a5",       // red-300 - subtle accent
        
        // InfoBase Custom Text Colors
        textCustomPrimary: "#ffffff",  // pure white text
        textCustomSecondary: "#e5e7eb", // gray-200 - softer white
        textCustomMuted: "#9ca3af",    // gray-400 - muted text
        
        // InfoBase Custom Background Colors
        bgCustomPage: "#18191c",       // main dark background
        bgCustomCard: "#1f2937",       // gray-800 for cards
        bgCustomCardHover: "#374151",  // gray-700 for hover states
        bgCustomLight: "#111827",      // gray-900 for darker sections
        borderCustom: "#374151",       // gray-700 for borders
        
        // InfoBase Custom Black Colors
        blackCustomPure: "#1C1C1C",    // pure black
        blackCustomSoft: "#0a0a0a",    // soft black (slightly lighter)
        blackCustomMatte: "#1a1a1a",   // matte black (good for cards)
        blackCustomRich: "#0f0f0f",    // rich black (between pure and soft)
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
        colors: {
          // Keep default colors and add custom InfoBase colors
          infobase: {
            50: "#fef2f2",
            100: "#fee2e2", 
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
            DEFAULT: "#ef4444",
            foreground: "#ffffff",
          },
        },
      },
      dark: {
        colors: {
          // Keep default colors and add custom InfoBase colors
          infobase: {
            50: "#fef2f2",
            100: "#fee2e2", 
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
            DEFAULT: "#ef4444",
            foreground: "#ffffff",
          },
          // Custom background for InfoBase
          infobaseBg: "#18191c",
          infobaseCard: "#1f2937",
          infobaseCardHover: "#374151",
          // Custom black color for InfoBase
          infobaseBlack: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
            950: "#0a0a0a",
            DEFAULT: "#000000",
            foreground: "#ffffff",
          },
        },
      },
    },
  })],
};