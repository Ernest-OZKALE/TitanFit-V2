/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Convert this to "presets" compatible with NativeWind v4
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        titanium: {
          500: "#D4AF37", // Gold
        },
      },
    },
  },
  plugins: [],
}

