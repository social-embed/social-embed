/** @type {import('tailwindcss').Config} */
import starlightPlugin from "@astrojs/starlight-tailwind";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [starlightPlugin()],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-ibm-plex-mono)", ...defaultTheme.fontFamily.mono],
        sans: ["var(--font-ibm-plex-sans)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
