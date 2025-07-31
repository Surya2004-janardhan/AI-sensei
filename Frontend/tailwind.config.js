/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: "#4A90E2", // Blue shade — reminiscent of calm Japanese aesthetics
        secondary: "#F7CAC9", // Pale pink (cherry blossom vibe)
        accent: "#D26A6A",
        background: "#FCFBF9", // Light/off-white background
        textPrimary: "#2D2D2D", // Dark text for readability
      },
      fontFamily: {
        japanese: ["Noto Sans JP", "sans-serif"], // Use Google Fonts later
        serifJapanese: ["Yu Mincho", "serif"], // Elegant style for headings
      },
    },
  },
  plugins: [],
};
