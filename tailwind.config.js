/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          lavender: '#E0C3FC',
          mint: '#C2F9BB',
          peach: '#FFDAC1',
          glass: 'rgba(255, 255, 255, 0.7)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-thai)', 'var(--font-noto-jp)', 'var(--font-noto-kr)', 'sans-serif'],
        heading: ['var(--font-outfit)', 'sans-serif'],
      },
      boxShadow: {
        'soft-glow': '0 0 20px rgba(224, 195, 252, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
