/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./pages/**/*.{html,tsx}', './components/**/*.{html,tsx}'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.gravatar.com',
            },
        ],
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@headlessui/tailwindcss'),
    ],
};
