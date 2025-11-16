// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add your keyframes here
      keyframes: {
        move: {
          '100%': { transform: 'translate3d(0, 0, 1px) rotate(360deg)' }
        },
        modalPop: {
          'from': { transform: 'scale(0.7)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' }
        },
        modalRotatingImg: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        }
      },
      // Add your animation definitions here
      animation: {
        'move': 'move 100s linear infinite', // Default duration, can be overridden
        'modal-pop': 'modalPop 0.3s ease-out',
        'modal-rotate': 'modalRotatingImg 4s linear infinite',
      }
    },
  },
  plugins: [],
}