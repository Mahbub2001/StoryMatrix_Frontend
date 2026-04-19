/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        neon: {
          purple: "#9D4EDD",
          blue: "#4CC9F0",
          pink: "#F72585",
          cyan: "#00F5FF",
        },
        dark: {
          900: "#03010A",
          800: "#07030F",
          700: "#0D0820",
          600: "#120F2E",
          500: "#1A1535",
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        scan: "scan 3s linear infinite",
        tilt: "tilt 10s ease-in-out infinite",
        "gradient-x": "gradient-x 4s ease infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(157,78,221,0.3), 0 0 60px rgba(76,201,240,0.1)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(157,78,221,0.6), 0 0 80px rgba(76,201,240,0.3)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        tilt: {
          "0%, 50%, 100%": { transform: "rotate(-1deg)" },
          "25%": { transform: "rotate(1deg)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(157,78,221,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(157,78,221,0.05) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse at 20% 50%, rgba(157,78,221,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(76,201,240,0.1) 0%, transparent 50%)",
      },
      backgroundSize: {
        grid: "50px 50px",
      },
    },
  },
  plugins: [],
};
module.exports = config;
