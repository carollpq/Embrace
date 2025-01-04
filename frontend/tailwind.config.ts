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
        'home-screen-pink': "url('/img/pink-bg.jpg')",
        'profile-pic-jenna': "url('/img/Jenna.png')",
        'profile-pic-marcus': "url('/img/Marcus.png')",
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
      }
    },
  },
  plugins: [],
};
export default config;
