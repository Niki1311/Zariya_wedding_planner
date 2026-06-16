import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm ivory / cream backgrounds
        ivory: {
          50: "#FEFCF8",
          100: "#FBF7F0",
          200: "#F5EEE2",
          300: "#EFE5D3",
          400: "#E7D8BF",
        },
        // Gold / amber accents
        gold: {
          50: "#FBF6EA",
          100: "#F4E9CC",
          200: "#E9D29C",
          300: "#DDBA6C",
          400: "#CDA24A",
          500: "#C49A4A",
          600: "#B8860B",
          700: "#996F12",
          800: "#7A5810",
        },
        // Deep ink for serif headings
        ink: {
          DEFAULT: "#2B2A3A",
          light: "#4A4860",
          muted: "#6E6B82",
        },
        // Soft pastel status colors
        sage: { bg: "#E7F0E4", text: "#4B7B4A", ring: "#9FC79B" },
        amberc: { bg: "#FBEFD6", text: "#9A7012", ring: "#E6C77A" },
        rose: { bg: "#F8E3E1", text: "#A8473F", ring: "#E3A9A2" },
        slatec: { bg: "#ECEAF1", text: "#5C5A6E", ring: "#C3C0CF" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 12px -4px rgba(120, 88, 16, 0.10), 0 1px 4px -2px rgba(120, 88, 16, 0.06)",
        card: "0 4px 24px -8px rgba(120, 88, 16, 0.12), 0 2px 8px -4px rgba(43, 42, 58, 0.05)",
        lift: "0 12px 36px -10px rgba(120, 88, 16, 0.22), 0 4px 12px -6px rgba(43, 42, 58, 0.10)",
      },
      borderRadius: {
        "2xl": "1.1rem",
        "3xl": "1.6rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
