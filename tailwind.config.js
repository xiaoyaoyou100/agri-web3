/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                agri: {
                    50:  "#f0f9f2",
                    100: "#dcf2e2",
                    200: "#b9e6c5",
                    300: "#8dd7a3",
                    400: "#5cc97f",
                    500: "#35b861",
                    600: "#26964d",
                    700: "#1f7540",
                    800: "#1b5b35",
                    900: "#15472c",
                }
            },
            boxShadow: {
                soft: "0 10px 20px -10px rgba(0,0,0,.15)"
            }
        },
    },
    plugins: [],
};
