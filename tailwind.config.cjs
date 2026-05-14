module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          25: '#f4fbff',
          50: '#f7fbfd',
          100: '#eef7fb',
          200: '#d7eef8',
          300: '#b5dbef',
          500: '#0b3b6f',
          600: '#0a335f',
          700: '#082949'
        },
        gold: '#d4af37',
        accent: '#6ee7ff',
        success: '#16a34a'
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}
