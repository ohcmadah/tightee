/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F4B183",
        "grayscale-20": "#c0c0c0",
      },
    },
  },
  plugins: [],
};
