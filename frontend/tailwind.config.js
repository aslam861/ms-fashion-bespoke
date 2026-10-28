/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#5C1A21',
          50: '#FDF7F7',
          100: '#F9EDED',
          200: '#EFCFD1',
          300: '#E0A8AC',
          400: '#C2656C',
          500: '#8C2832',
          600: '#732129',
          700: '#5C1A21', // Primary brand maroon
          800: '#461319',
          900: '#300D11',
          950: '#1E080B'
        },
        gold: {
          DEFAULT: '#A9812F', // Antique Gold
          50: '#FAF7EE',
          100: '#F4ECD7',
          200: '#E7D8AD',
          300: '#D8C07F',
          400: '#C5A869',
          500: '#A9812F', // Antique Gold
          600: '#8F6B24',
          700: '#73541B',
          800: '#573E14',
          900: '#3D2B0E'
        },
        ivory: {
          DEFAULT: '#FBF6EC', // Warm Ivory canvas
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#FBF6EC', // Primary background
          300: '#F4ECE1', // Card background
          400: '#EADDCB',
          500: '#DECDB5',
          600: '#CBB79B',
          700: '#B09A7B',
          800: '#8E785C',
          900: '#645440'
        },
        charcoal: {
          DEFAULT: '#2B211D', // Deep rich charcoal text
          50: '#F5F4F3',
          100: '#E7E5E4',
          200: '#D0CDC9',
          300: '#B2ADA8',
          400: '#8D8781',
          500: '#69625D',
          600: '#4D4743',
          700: '#3B3632',
          800: '#2B211D', // Primary text
          900: '#1C1513'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif']
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(92, 26, 33, 0.12)',
        'luxury-hover': '0 20px 40px -15px rgba(92, 26, 33, 0.22)',
        'gold-glow': '0 0 25px rgba(169, 129, 47, 0.25)',
      }
    },
  },
  plugins: [],
}
