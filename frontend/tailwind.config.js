const usedColors = [  'red', 'blue', 'green', 'orange', 'purple',
                              'cyan', 'pink', 'lime', 'yellow', 'zinc', 'black']

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    safelist: usedColors.map((c) => `border-${c}${c !== "black" ? "-500" : ""}`),
    plugins: [],
}