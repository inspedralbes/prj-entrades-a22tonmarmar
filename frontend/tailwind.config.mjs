// Tailwind configuration for Nuxt front-end
// Ensures Tailwind scans components under app/shared as well.

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: ["./app/shared/**/*.{vue,js,jsx,mjs,ts,tsx}"],
  },
};
