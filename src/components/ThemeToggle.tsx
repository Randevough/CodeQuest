'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center size-8 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200"
        >
            <span
                className="material-symbols-outlined text-[20px] transition-transform duration-300"
                style={{ transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)' }}
            >
                {isDark ? 'light_mode' : 'dark_mode'}
            </span>
        </button>
    )
}
