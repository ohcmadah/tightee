/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F4B183",
        "grayscale-100": "#000000",
        "grayscale-20": "#c0c0c0",
        "system-alert": "#ff0000",
        "system-yellow": "#FFE699",
        "system-dimyellow": "#F8F5D5",
      },
    },
  },
  plugins: [],
};
