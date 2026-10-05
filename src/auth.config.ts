import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request }) {
            const { nextUrl, cookies } = request
            const isLoggedIn = !!auth?.user
            const isAdmin = auth?.user?.role === 'Admin'
            const { pathname } = nextUrl

            // Dev mode bypass support
            if (process.env.NODE_ENV === 'development') {
                const devRole = cookies?.get('cq_dev_role')?.value ?? 'admin'
                if (devRole === 'admin') {
                    // Admin can preview all pages
                    return true
                }
                if (devRole === 'member') {
                    // Member restricted from admin routes
                    if (pathname.startsWith('/admin')) {
                        return Response.redirect(new URL('/explore', nextUrl))
                    }
                    return true
                }
                // If devRole === 'none', fall through to normal production authorization checks
            }

            // Auth routes (/login, /signup) — redirect logged-in users to /explore
            if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
                if (isLoggedIn) return Response.redirect(new URL('/explore', nextUrl))
                return true
            }

            // Admin routes — Admin role required
            if (pathname.startsWith('/admin')) {
                if (isLoggedIn && isAdmin) return true
                // Logged in but not admin → redirect to /explore
                if (isLoggedIn && !isAdmin) return Response.redirect(new URL('/explore', nextUrl))
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
