import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isAdmin = auth?.user?.role === 'Admin'
            const { pathname } = nextUrl

            // Auth routes (/login, /signup) — redirect logged-in users to home
            if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
                if (isLoggedIn) return Response.redirect(new URL('/', nextUrl))
                return true
            }

            // Admin routes — Admin role required
            if (pathname.startsWith('/admin')) {
                if (isLoggedIn && isAdmin) return true
                // Logged in but not admin → redirect to home
                if (isLoggedIn && !isAdmin) return Response.redirect(new URL('/', nextUrl))
                // Not logged in → redirect to login (handled by NextAuth internally)
                return false
            }

            // Protected user routes — must be logged in
            const protectedPrefixes = ['/workspace', '/profile']
            const isProtected = protectedPrefixes.some(p => pathname.startsWith(p))
            if (isProtected) {
                return isLoggedIn
            }

            // All other routes are public
            return true
        },
    },
    providers: [], // Providers added in auth.ts to avoid Edge incompatibility
} satisfies NextAuthConfig
