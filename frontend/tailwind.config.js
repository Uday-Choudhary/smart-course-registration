/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                lamaPurple: "#6B46C1",
                lamaYellow: "#F6E05E",
            },
        },
    },
    plugins: [],
}
