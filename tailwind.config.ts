import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        malayalam: ['var(--font-malayalam)'],
      },
      animation: {
        'shimmer': 'shimmer 6s linear infinite',
        'ring': 'ring 2.5s ease-in-out infinite',
        'marquee': 'marquee 60s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        ring: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '4%, 12%': { transform: 'rotate(15deg)' },
          '8%, 16%': { transform: 'rotate(-15deg)' },
          '20%': { transform: 'rotate(0deg)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0%, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
