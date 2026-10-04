'use client'

import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"
import { ThemeProvider } from "./ThemeProvider"

export function Providers({ children, session }: { children: React.ReactNode; session?: Session | null }) {
    return (
        <ThemeProvider>
            <SessionProvider session={session}>
                {children}
            </SessionProvider>
        </ThemeProvider>
    )
}
