import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        foreground: "#FAFAFA",
        card: "#18181B",
        border: "#27272A",
        muted: "#A1A1AA",
        primary: "#F97316",
        "primary-light": "#FB923C",
        "primary-dark": "#EA580C",
        success: "#22C55E",
        warning: "#EAB308",
        danger: "#EF4444",
        info: "#06B6D4",
        "surface-1": "#0A0A0D",
        "surface-2": "#111114",
        "surface-3": "#18181B",
        "surface-4": "#1F1F23",
        "zinc-850": "#1C1C20"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(249,115,22,0.3)" },
          "50%": { boxShadow: "0 0 24px 0 rgba(249,115,22,0.45)" }
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" }
        }
      },
      animation: {
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
        slideUp: "slideUp 0.4s ease-out forwards",
        slideDown: "slideDown 0.4s ease-out forwards",
        fadeIn: "fadeIn 0.3s ease-out forwards",
        scaleIn: "scaleIn 0.3s ease-out forwards",
        shimmer: "shimmer 2s linear infinite"
      },
      boxShadow: {
        glow: "0 0 20px rgba(249,115,22,0.15)",
        "glow-lg": "0 0 40px rgba(249,115,22,0.2)",
        "inner-glow": "inset 0 0 20px rgba(249,115,22,0.05)"
      }
    }
  },
  plugins: []
};

export default config;
