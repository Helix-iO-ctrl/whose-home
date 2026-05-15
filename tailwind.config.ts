import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Whose Home — Option C, recolored to Green & Gold
        spruce:    "#0B1F14", // app background
        pine:      "#10301F", // elevated surface
        "pine-2":  "#163A26", // hover surface
        forest:    "#14532D", // primary brand
        moss:      "#1E7A45", // secondary / success
        gold:      "#C9A227", // accent / CTA
        "gold-2":  "#E8C36A", // highlight / italic accents
        parchment: "#F7F1E1", // light neutral / cream
        ink:       "#0E1A12", // text on cream
        // Semantic
        line:      "rgba(247,241,225,0.10)",
        "line-2":  "rgba(247,241,225,0.18)",
        muted:     "rgba(247,241,225,0.60)",
        subtle:    "rgba(247,241,225,0.42)",
        danger:    "#E5564D",
        "danger-soft": "rgba(229,86,77,0.15)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Libre Baskerville", "serif"],
        sans:    ["var(--font-sans)", "DM Sans", "system-ui", "sans-serif"],
        mono:    ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.25)",
        ring: "0 0 0 1px rgba(247,241,225,0.08)",
      },
      keyframes: {
        slideUp: {
          "0%":   { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)",     opacity: "1" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
        "fade-in":  "fadeIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
