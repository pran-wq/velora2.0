import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090E",
        foreground: "#FAFAFA",
        card: {
          DEFAULT: "rgba(16, 16, 24, 0.6)",
          foreground: "#FAFAFA",
        },
        popover: {
          DEFAULT: "#101018",
          foreground: "#FAFAFA",
        },
        primary: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#A855F7",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1E1E2A",
          foreground: "#94A3B8",
        },
        accent: {
          DEFAULT: "#06B6D4",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FAFAFA",
        },
        border: "rgba(255, 255, 255, 0.1)",
        input: "rgba(255, 255, 255, 0.05)",
        ring: "#6366F1",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-neon": "linear-gradient(to right, #6366F1, #A855F7, #06B6D4)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(99, 102, 241, 0.3)",
        "neon-purple": "0 0 20px rgba(168, 85, 247, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
} satisfies Config;
