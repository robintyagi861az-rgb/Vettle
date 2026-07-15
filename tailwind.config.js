/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px -4px rgba(129, 90, 250, 0.55)",
        "glow-lg": "0 0 45px -8px rgba(129, 90, 250, 0.55)",
        "glow-emerald": "0 0 20px -4px rgba(52, 211, 153, 0.5)",
        "glow-rose": "0 0 20px -4px rgba(251, 113, 133, 0.5)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        floatUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.2s infinite linear",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        "float-up": "floatUp 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
