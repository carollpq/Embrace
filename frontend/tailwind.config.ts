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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'home-screen-blue': "url('/img/blue-bg.jpg')",
        'home-screen-pink': "url('/img/pink-bg.png')",
        'profile-pic-jenna': "url('/img/Jenna.png')",
        'profile-pic-marcus': "url('/img/Marcus.png')",
        'day-mode-toggle': "url('/icons/day-mode-toggle.png')",
        'night-mode-toggle': "url('/icons/night-mode-toggle.png')",
        'day-mode-screen-2': "url('/img/pink-bg-2.png')"
      },
      dropShadow: {
        'default': '10px 10px 20px rgba(0, 0, 0, 0.25)'
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.7s ease-out',
      },
      transitionProperty: {
        'colors': 'background-color, color, border-color',
      },
    },
  },
  plugins: [],
};
export default config;
