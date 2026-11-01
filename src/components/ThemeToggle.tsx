"use client";
import { useTheme } from "./ThemeProvider";
export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    return <button type="button" onClick={toggleTheme} aria-label={label} title={label} className="flex size-11 items-center justify-center border border-control-border bg-surface text-foreground hover:bg-surface-raised"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{theme === "dark" ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/></> : <path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z"/>}</svg></button>;
}
