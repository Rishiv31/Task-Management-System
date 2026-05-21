/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#030303",
          card: "rgba(10, 10, 15, 0.7)",
          border: "rgba(255, 255, 255, 0.08)",
          accent: "#6366f1", // indigo
          glow: "#8b5cf6", // purple
          textMuted: "#94a3b8" // slate-400
        }
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease infinite',
        'pulse-slow': 'pulseGlow 4s ease-in-out infinite',
        'float-slow': 'floatAnimation 6s ease-in-out infinite',
        'float-delayed': 'floatAnimation 6s ease-in-out infinite 3s',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        floatAnimation: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
