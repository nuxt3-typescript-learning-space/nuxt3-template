/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  tabWidth: 2,
  printWidth: 120,
  trailingComma: 'all',
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
};

export default config;
