import type { Config } from "tailwindcss";

const config: Config = {
  // BAGIAN INI WAJIB ADA AGAR WARNA MUNCUL:
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;