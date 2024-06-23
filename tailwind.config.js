/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        light: "#F4F6F9",
        dark: "#1B1B1B",
        global: "#D8DADD",
        inner: "#F4F6F9",
        design: "#D4D6D8",
        disappeared: "#EBEEF1",
        orange: "#FF8C21",
        green: "#62D639",
        blue: "#99E382",
        gray: "#E2E4E8"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
