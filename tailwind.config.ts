// tailwind.config.ts (Configure Outfit Font & Typography Plugin)

import type { Config } from 'tailwindcss';
// Import the default theme font families
const defaultTheme = require('tailwindcss/defaultTheme');

const config: Config = {
  // Configure content paths to scan for Tailwind classes
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Your components folder
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',      // Your app folder (App Router)
  ],
  // Configure dark mode strategy (use 'media' for OS preference)
  darkMode: 'media',
  theme: {
    extend: {
      // Extend the default font families provided by Tailwind
      fontFamily: {
        // Set the 'sans' font family to use 'Outfit' first,
        // then fall back to Tailwind's default sans-serif fonts
        sans: ['Outfit', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  // Include necessary plugins
  plugins: [
    require('@tailwindcss/typography'), // Requires the plugin to be installed
  ],
};
export default config;