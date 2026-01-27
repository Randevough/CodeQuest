import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#000000",
                    hover: "#333333",
                },
                "background-light": "#ffffff",
                "background-dark": "#000000",
                "surface-light": "#ffffff",
                "surface-dark": "#111111",
                "border-light": "#eaeaea",
                "border-dark": "#333333",
                "text-subtle": "#666666",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
                mono: [
                    "ui-monospace",
                    "SFMono-Regular",
                    "Menlo",
                    "Monaco",
                    "Consolas",
                    "Liberation Mono",
                    "Courier New",
                    "monospace",
                ],
            },
            borderRadius: {
                lg: "0.5rem",
                xl: "0.75rem",
            },
            boxShadow: {
                soft: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0,0,0,0.1)",
                hover: "0 8px 30px rgba(0,0,0,0.12)",
            },
            animation: {
                "fade-in-up": "fadeInUp 0.5s ease-out forwards",
            },
            keyframes: {
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
