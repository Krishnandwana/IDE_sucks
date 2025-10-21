/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1e1e1e',
          sidebar: '#252526',
          editor: '#1e1e1e',
          text: '#d4d4d4',
          border: '#3e3e42',
        },
      },
    },
  },
  plugins: [],
}
