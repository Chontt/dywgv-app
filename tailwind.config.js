/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        'pastel-pink': '#FFD6E0', // Soft pink for gradients/accents
        'pastel-purple': '#C6C7FF', // Soft purple for gradients
        'pastel-blue': '#C3E5FF', // Soft blue for accents
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-thai)', 'var(--font-noto-jp)', 'var(--font-noto-kr)', 'sans-serif'],
        heading: ['var(--font-outfit)', 'sans-serif'],
      },
      boxShadow: {
        'soft-glass': '0 8px 32px 0 rgba(226, 185, 219, 0.15)',
        'bubble': '0 20px 50px rgba(0, 0, 0, 0.05)',
        'executive': '0 20px 50px -12px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      }
    },
  },
  plugins: [],
}
