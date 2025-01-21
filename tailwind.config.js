// tailwind.config.js
module.exports = {
  darkMode: 'class', // essential for using "dark:" variants
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Page background
        page: {
          DEFAULT: '#FFFFFF', // Light mode background
          dark: '#000000', // Dark mode background
        },
        // Card background
        card: {
          DEFAULT: '#F9F9F9', // Light "card" or "panel" background
          dark: '#1A1A1A', // Dark "card" or "panel" background
        },
        // Main text color
        mainText: {
          DEFAULT: '#000000', // Light mode text
          dark: '#FFFFFF', // Dark mode text
        },
        // Muted/secondary text color
        mutedText: {
          DEFAULT: '#6B7280', // e.g. Tailwind's gray-600
          dark: '#9CA3AF', // e.g. Tailwind's gray-400
        },
        // (Optional) If you want a separate “border” color slot
        borderColor: {
          DEFAULT: '#D1D5DB', // e.g. Tailwind's gray-300
          dark: '#4B5563', // e.g. Tailwind's gray-700
        },

        // You can add more if needed, for instance "overlay", "accent", etc.
        // or keep using Tailwind defaults (like `bg-purple-600`) if desired.
      },
    },
  },
  plugins: [],
}
