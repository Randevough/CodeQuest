"use client";
import { MoonIcon, SunIcon } from "@/components/ui/ArcadeIcons";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
            className="flex size-11 items-center justify-center rounded-button border-2 border-control-border bg-surface text-foreground hover:bg-surface-raised"
        >
            {theme === "dark" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
        </button>
    );
}
