/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#D41920", // الأحمر
          secondary: "#1D1A1B", // الأسود
          light: "#F5F5F5", // خلفية فاتحة
          white: "#FFFFFF",

          gold: "#FBD05D", // لون النسر
          goldDark: "#D4A937",

          gray: "#E5E7EB",

          text: "#2B2B2B",

          success: "#16A34A",
          danger: "#DC2626",
        },
      },

      boxShadow: {
        brand: "0 10px 25px rgba(212,25,32,0.25)",
      },
    },
  },
  plugins: [],
}