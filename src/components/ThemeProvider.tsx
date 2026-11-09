'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    toggleTheme: () => { },
})

export function useTheme() {
    return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark')

    function applyTheme(t: Theme) {
        const root = document.documentElement
        if (t === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }

    // On mount: read the persisted preference. Dark is the default.
    useEffect(() => {
        const stored = localStorage.getItem('cq-theme') as Theme | null
        const resolved: Theme = stored === 'light' ? 'light' : 'dark'
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
