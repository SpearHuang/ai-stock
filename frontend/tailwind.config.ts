import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#071014",
        panel: "#0d171d",
        panelSoft: "#13242c",
        border: "#1f343d",
        accent: "#31d0aa",
        danger: "#ff6b6b",
        warning: "#f5b860"
      }
    }
  },
  plugins: []
};

export default config;
