/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');

module.exports = {
    content: ['./pages/**/*.{html,tsx}', './components/**/*.{html,tsx}'],
    theme: {
        extend: {
            colors: {
                sky: colors.sky,
                teal: colors.teal,
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@headlessui/tailwindcss'),
        require('@tailwindcss/forms'),
    ],
};
