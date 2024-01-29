/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite/**/*.js',
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {},
    colors: {
      // 'joblk-green-100': '#1DBF73',
      // 'joblk-green-200': '#1DBF73',
      // 'joblk-green-300': '#1DBF73',
      // 'joblk-green-400': '#1DBF73',
      'joblk-green-500': '#1DBF73',
      'joblk-green-600': '#009951',
      'joblk-green-700': '#007430',
      'joblk-green-800': '#005111',
      'joblk-green-900': '#003100',
    }
  },
  daisyui: {
    themes: ["light"]
  },
  plugins: [
    require("daisyui"), 
    require('flowbite/plugin')
  ],
}
