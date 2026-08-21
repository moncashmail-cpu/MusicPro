import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0D14",
        surface: {
          50: "#1E222D",
          100: "#161922",
          200: "#12141C",
          300: "#0E1017",
        },
        border: {
          subtle: "#1F2432",
          strong: "#2B3245",
        },
        accent: {
          DEFAULT: "#6366F1", // Indigo Electric
          hover: "#4F46E5",
          light: "#818CF8",
          glow: "rgba(99, 102, 241, 0.25)",
        },
        cyan: {
          neon: "#06B6D4",
          glow: "rgba(6, 182, 212, 0.25)",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        'glow-accent': '0 0 20px -3px rgba(99, 102, 241, 0.35)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
