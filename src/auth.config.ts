import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard'); // Example protected route
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        // We can keep basic JWT/Session logic here if it doesn't use Prisma
        // Complex DB-dependent logic should stay in auth.ts or be handled carefully
    },
    providers: [], // Providers are added in auth.ts to avoid Edge incompatibility with some adapters/providers
} satisfies NextAuthConfig
