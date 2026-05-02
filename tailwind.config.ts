import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F3EA",
        warm: "#EFE6D8",
        charcoal: "#252321",
        sage: "#7C8F61",
        lavender: "#A57CA6",
        gold: "#B5965B"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(37, 35, 33, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
