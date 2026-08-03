import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-clash)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-pattern":
          "linear-gradient(135deg, rgba(22, 67, 119, 0.92) 0%, rgba(30, 95, 163, 0.94) 100%)",
        "card-gradient":
          "linear-gradient(145deg, #ffffff 0%, #eef5fd 100%)",
        "brand-gradient":
          "linear-gradient(135deg, #164377 0%, #1e5fa3 50%, #2671c4 100%)",
        "brand-gradient-hover":
          "linear-gradient(135deg, #123661 0%, #164377 50%, #1e5fa3 100%)",
        "brand-gradient-r":
          "linear-gradient(to right, #164377, #1e5fa3)",
        "text-gradient":
          "linear-gradient(90deg, #164377, #1e5fa3)",
      },
      colors: {
        // Primary Purple System - CHANGE THESE TO ADJUST THE ENTIRE APP THEME
        primary: {
          50: "#eef5fd",
          100: "#d4e4f7",
          200: "#adccf0",
          300: "#7aafe6",
          400: "#468dd8",
          500: "#2570c2",
          600: "#164377",
          700: "#133766",
          800: "#102d54",
          900: "#0c2240",
          950: "#08162b",
        },
        // Neutral scale
        surface: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
        // Accent colors
        accent: {
          rose: "#f43f5e",
          emerald: "#10b981",
          amber: "#f59e0b",
          sky: "#0ea5e9",
        },
        // Legacy colors for backwards compat
        stitchSky: "#C3EBFA",
        stitchSkyLight: "#EDF9FD",
        stitchOffWhite: "#F6F8FF",
        stitchOffWhiteLight: "#F1F0FF",
        stitchYellow: "#FAE27C",
        stitchYellowLight: "#FEFCE8",
      },
      boxShadow: {
        elegant:
          "0 1px 3px rgba(0,0,0,0.05), 0 10px 30px -5px rgba(0,0,0,0.08)",
        "elegant-hover":
          "0 1px 3px rgba(0,0,0,0.05), 0 15px 40px -5px rgba(0,0,0,0.12)",
        card: "0 2px 8px rgba(22, 67, 119, 0.06), 0 8px 24px -4px rgba(22, 67, 119, 0.1)",
        "card-hover":
          "0 4px 12px rgba(22, 67, 119, 0.08), 0 12px 32px -4px rgba(22, 67, 119, 0.14)",
        glow: "0 0 20px rgba(22, 67, 119, 0.3)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
