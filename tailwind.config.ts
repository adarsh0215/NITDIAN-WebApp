// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", "[data-theme='dark']"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: { borderRadius: { "2xl": "1rem" } } },
  plugins: [],
} satisfies Config;
