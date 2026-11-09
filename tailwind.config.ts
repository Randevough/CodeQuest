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
                background: "rgb(var(--color-bg-rgb) / <alpha-value>)",
                foreground: "rgb(var(--color-text-rgb) / <alpha-value>)",
                surface: {
                    DEFAULT: "rgb(var(--color-surface-rgb) / <alpha-value>)",
                    raised: "rgb(var(--color-surface-raised-rgb) / <alpha-value>)",
                },
                inset: "rgb(var(--color-inset-rgb) / <alpha-value>)",
                border: "rgb(var(--color-border-rgb) / <alpha-value>)",
                "control-border": "rgb(var(--color-control-border-rgb) / <alpha-value>)",
                muted: "rgb(var(--color-text-muted-rgb) / <alpha-value>)",
                primary: {
                    DEFAULT: "rgb(var(--color-primary-rgb) / <alpha-value>)",
                    hover: "rgb(var(--color-primary-hover-rgb) / <alpha-value>)",
                    edge: "rgb(var(--color-primary-edge-rgb) / <alpha-value>)",
                    foreground: "rgb(var(--color-on-primary-rgb) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "rgb(var(--color-secondary-rgb) / <alpha-value>)",
                    hover: "rgb(var(--color-secondary-hover-rgb) / <alpha-value>)",
                    edge: "rgb(var(--color-secondary-edge-rgb) / <alpha-value>)",
                    foreground: "rgb(var(--color-on-secondary-rgb) / <alpha-value>)",
                },
                focus: "rgb(var(--color-focus-rgb) / <alpha-value>)",
                info: {
                    DEFAULT: "rgb(var(--color-info-rgb) / <alpha-value>)",
                    edge: "var(--color-info-edge)",
                },
                warning: "rgb(var(--color-warning-rgb) / <alpha-value>)",
                success: {
                    DEFAULT: "rgb(var(--color-success-rgb) / <alpha-value>)",
                    edge: "var(--color-success-edge)",
                },
                danger: {
                    DEFAULT: "rgb(var(--color-danger-rgb) / <alpha-value>)",
                    edge: "var(--color-danger-edge)",
                },
                // Compatibility aliases resolve through the active theme.
                "background-light": "rgb(var(--color-bg-rgb) / <alpha-value>)",
                "background-dark": "rgb(var(--color-bg-rgb) / <alpha-value>)",
                "surface-light": "rgb(var(--color-surface-rgb) / <alpha-value>)",
                "surface-dark": "rgb(var(--color-surface-rgb) / <alpha-value>)",
                "border-light": "rgb(var(--color-border-rgb) / <alpha-value>)",
                "border-dark": "rgb(var(--color-border-rgb) / <alpha-value>)",
                "text-subtle": "rgb(var(--color-text-muted-rgb) / <alpha-value>)",
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "Geist Sans", "system-ui", "sans-serif"],
                display: ["var(--font-bungee)", "Bungee", "var(--font-geist-sans)", "system-ui", "sans-serif"],
                mono: ["var(--font-geist-mono)", "Geist Mono", "ui-monospace", "monospace"],
            },
            borderRadius: {
                input: "var(--radius-input)",
                button: "var(--radius-button)",
                card: "var(--radius-card)",
                dialog: "var(--radius-dialog)",
            },
            boxShadow: {
                primary: "var(--shadow-primary)",
                secondary: "var(--shadow-secondary)",
                panel: "var(--shadow-panel)",
                "arcade-gold": "var(--shadow-podium-gold)",
                "arcade-silver": "var(--shadow-podium-silver)",
                "arcade-bronze": "var(--shadow-podium-bronze)",
            },
            zIndex: {
                sticky: "30",
                dropdown: "40",
                overlay: "50",
                modal: "60",
                toast: "70",
                tooltip: "80",
            },
            transitionTimingFunction: {
                "out-expo": "var(--ease-out-expo)",
            },
            maxWidth: { content: "var(--content-max)" },
            spacing: { gutter: "var(--page-gutter)" },
            transitionDuration: { fast: "var(--motion-fast)" },
            animation: {
                "fade-in-up": "fadeInUp 160ms ease-out both",
            },
            keyframes: {
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(6px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
