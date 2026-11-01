'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'light',
    toggleTheme: () => { },
})

export function useTheme() {
    return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')

    function applyTheme(t: Theme) {
        const root = document.documentElement
        if (t === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }

    // On mount: read persisted preference, fall back to OS preference
    useEffect(() => {
        const stored = localStorage.getItem('cq-theme') as Theme | null
        let resolved: Theme = 'light'
        if (stored === 'dark' || stored === 'light') {
            resolved = stored
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            resolved = prefersDark ? 'dark' : 'light'
        }
        applyTheme(resolved)
        queueMicrotask(() => {
            setTheme(resolved)
        })
    }, [])


    function toggleTheme() {
        setTheme(prev => {
            const next: Theme = prev === 'dark' ? 'light' : 'dark'
            applyTheme(next)
            localStorage.setItem('cq-theme', next)
            return next
        })
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
