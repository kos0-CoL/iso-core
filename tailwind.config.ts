import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Space Grotesk', 'sans-serif'],
        code: ['Source Code Pro', 'monospace'],
      },
      colors: {
        background: 'hsl(222, 18%, 11%)', // Deep Laboratory Navy
        foreground: 'hsl(210, 40%, 98%)',
        card: {
          DEFAULT: 'hsl(222, 18%, 13%)',
          foreground: 'hsl(210, 40%, 98%)',
        },
        popover: {
          DEFAULT: 'hsl(222, 18%, 13%)',
          foreground: 'hsl(210, 40%, 98%)',
        },
        primary: {
          DEFAULT: 'hsl(217, 91%, 60%)', // Scientific Digital Blue
          foreground: 'hsl(222, 18%, 11%)',
        },
        secondary: {
          DEFAULT: 'hsl(215, 25%, 27%)',
          foreground: 'hsl(210, 40%, 98%)',
        },
        muted: {
          DEFAULT: 'hsl(215, 25%, 20%)',
          foreground: 'hsl(215, 20%, 65%)',
        },
        accent: {
          DEFAULT: 'hsl(188, 86%, 37%)', // Cybernetic Cyan
          foreground: 'hsl(210, 40%, 98%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          foreground: 'hsl(210, 40%, 98%)',
        },
        border: 'hsl(215, 25%, 20%)',
        input: 'hsl(215, 25%, 20%)',
        ring: 'hsl(217, 91%, 60%)',
        sidebar: {
          DEFAULT: 'hsl(222, 18%, 9%)',
          foreground: 'hsl(215, 20%, 75%)',
          primary: 'hsl(217, 91%, 60%)',
          'primary-foreground': 'hsl(222, 18%, 11%)',
          accent: 'hsl(215, 25%, 20%)',
          'accent-foreground': 'hsl(210, 40%, 98%)',
          border: 'hsl(215, 25%, 20%)',
          ring: 'hsl(217, 91%, 60%)',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
