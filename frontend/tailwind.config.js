/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F5F3F5',
          subtle: '#F0EFF0',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#FAFAF8',
          elevated: '#FFFFFF',
        },
        primary: {
          DEFAULT: '#191923',
          hover: '#2A2A35',
          pressed: '#101017',
        },
        brand: {
          DEFAULT: '#191923',
        },
        content: {
          primary: '#191923',
          secondary: '#55555C',
          muted: '#848389',
          inverse: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E3E2E3',
          subtle: '#EFEDEF',
        },
        positive: {
          DEFAULT: '#168A55',
          bg: '#EAF7F0',
          border: '#CDECDE',
        },
        negative: {
          DEFAULT: '#D94A45',
          bg: '#FDEEEE',
          border: '#F5D2D0',
        },
      },
      fontFamily: {
        sans: ['var(--font-current)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Noto Serif Bengali"', 'serif'],
        bengali: ['"Noto Serif Bengali"', 'serif'],
        english: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        brand: ['"FN Nill Sakawoat"', '"Noto Serif Bengali"', 'serif'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'float': '0 10px 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

