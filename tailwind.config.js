/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "accent-purple": "#8B5CF6",
                "accent-mint": "#34D399",
                "bg-white": "#ffffff",
                "text-black": "#0F172A",
            },
        },
    },
    plugins: [],
}
