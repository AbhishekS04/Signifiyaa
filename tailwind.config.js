/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#8B3DFF",
        background: "#F3E6F5",
        yellow: "#FFE900",
        cyan: "#A5F3FC",
        blue: "#3B82F6",
        black: "#000000",
        white: "#FFFFFF",
      },
      boxShadow: {
        neo: "4px 4px 0px 0px rgba(0,0,0,1)",
        "neo-sm": "2px 2px 0px 0px rgba(0,0,0,1)",
        "neo-lg": "6px 6px 0px 0px rgba(0,0,0,1)",
      },
      fontFamily: {
        heading: ["ArchivoBlack_400Regular"],
        body: ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
}

