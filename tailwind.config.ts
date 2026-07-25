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
          "linear-gradient(135deg, rgba(99, 102, 241, 0.92) 0%, rgba(139, 92, 246, 0.94) 100%)",
        "card-gradient":
          "linear-gradient(145deg, #ffffff 0%, #f5f3ff 100%)",
        "brand-gradient":
          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
        "brand-gradient-hover":
          "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
        "brand-gradient-r":
          "linear-gradient(to right, #6366f1, #8b5cf6)",
        "text-gradient":
          "linear-gradient(90deg, #6366f1, #a855f7)",
      },
      colors: {
        // Primary Purple System - CHANGE THESE TO ADJUST THE ENTIRE APP THEME
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
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
        card: "0 2px 8px rgba(109, 40, 217, 0.06), 0 8px 24px -4px rgba(109, 40, 217, 0.1)",
        "card-hover":
          "0 4px 12px rgba(109, 40, 217, 0.08), 0 12px 32px -4px rgba(109, 40, 217, 0.14)",
        glow: "0 0 20px rgba(139, 92, 246, 0.3)",
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
