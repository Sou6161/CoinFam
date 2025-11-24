/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xsmall: "480px",
      small: "640px",
      medium: "768px",
      large: "1024px",
      xlarge: "1280px",
      "2xlarge": "1536px",
    },
    extend: {
      fontFamily: {
        "roboto-medium": ["Roboto-Medium", "sans-serif"],
        "roboto-black": ["Roboto-Black", "sans-serif"],
        "roboto-bold": ["Roboto-Bold", "sans-serif"],
        "roboto-black-italic": ["Roboto-BlackItalic", "sans-serif"],
      },
      animation: {
        "subtle-shift": "subtle-shift 10s ease-in-out infinite",
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        matrix: "matrix 1s infinite linear",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "subtle-shift": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(5px, 5px) rotate(1deg)" },
          "50%": { transform: "translate(-5px, 5px) rotate(-1deg)" },
          "75%": { transform: "translate(5px, -5px) rotate(1deg)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        matrix: {
          "0%": { backgroundPosition: "0% 100%, 50% 100%, 100% 100%" },
          "100%": { backgroundPosition: "0% 0%, 50% 0%, 100% 0%" },
        },
      },
    },
  },
  plugins: [],
};
