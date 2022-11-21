/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F4B183",
        "primary-peach": "#FBE5D6",
        "grayscale-100": "#000000",
        "grayscale-80": "#696969",
        "grayscale-60": "#808080",
        "grayscale-20": "#c0c0c0",
        "grayscale-10": "#D7D7D7",
        "system-alert": "#ff0000",
        "system-yellow": "#FFE699",
        "system-dimyellow": "#F8F5D5",
        "kakao-container": "#FEE500",
        "question-not-today": "#EAE4E9",
      },
      zIndex: {
        popup: "100",
        nav: "99",
      },
      height: {
        nav: "58px",
      },
    },
  },
  plugins: [],
};
