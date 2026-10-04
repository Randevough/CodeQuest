import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { authConfig } from "./auth.config"

class UnverifiedEmailError extends CredentialsSignin {
    code = "unverified_email"
}

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

import { cookies } from "next/headers"

const nextAuthResult = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email) return null;
                const email = credentials.email as string;
                if (!email.endsWith('@cyber-univ.ac.id')) return null;

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    if (!user.password) return null; // Passwords are now required for credentials login

                    if (!user.emailVerified) {
                        throw new UnverifiedEmailError();
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            // Initial sign-in: populate token from the user object returned by authorize()
            if (user) {
                token.sub = user.id
                token.role = user.role
                token.points = user.points
                token.avatar = user.avatar
                token.name = user.name
                token.email = user.email
                token.lastRefreshed = Date.now()
                return token
            }

            // Only re-fetch from DB when explicitly triggered (e.g., after profile update)
            // or when the cached data is older than 5 minutes
            const FIVE_MINUTES_MS = 5 * 60 * 1000
            const isStale = !token.lastRefreshed ||
                (Date.now() - (token.lastRefreshed as number)) > FIVE_MINUTES_MS

            if ((trigger === 'update' || isStale) && token.sub) {
                try {
                    const freshUser = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: {
                            name: true,
                            email: true,
                            role: true,
                            points: true,
                            avatar: true,
                        }
                    })

                    if (freshUser) {
                        token.name = freshUser.name
                        token.email = freshUser.email
                        token.role = freshUser.role
                        token.points = freshUser.points
                        token.avatar = freshUser.avatar
                        token.lastRefreshed = Date.now()
                    }
                } catch (error) {
                    console.error("Error refreshing user data in JWT callback:", error)
                }
            }

            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string
                session.user.name = token.name as string | null | undefined
                session.user.email = token.email as string
                session.user.role = token.role as string
                session.user.points = token.points as number
                session.user.avatar = token.avatar as string | null
                session.user.image = token.avatar as string | null
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
})

export const { handlers, signIn, signOut } = nextAuthResult

export const auth = (async (...args: Parameters<typeof nextAuthResult.auth>) => {
    if (process.env.NODE_ENV === 'development') {
        try {
            const cookieStore = await cookies()
            const devRole = cookieStore.get('cq_dev_role')?.value ?? 'admin'

            if (devRole === 'admin') {
                return {
                    user: {
                        id: 'dev-admin-id',
                        name: 'Admin Developer',
                        email: 'codequest@cyber-univ.ac.id',
                        role: 'Admin',
                        points: 1337,
                        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminDev',
                        image: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminDev',
                    },
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                }
            }

            if (devRole === 'member') {
                return {
                    user: {
                        id: 'dev-member-id',
                        name: 'Student Member',
                        email: 'student@cyber-univ.ac.id',
                        role: 'Member',
                        points: 450,
                        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=StudentDev',
                        image: 'https://api.dicebear.com/7.x/bottts/svg?seed=StudentDev',
                    },
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                }
            }
            // devRole === 'none' -> falls through to original auth
        } catch {
            // Ignored if cookies() is inaccessible
        }
    }

    return nextAuthResult.auth(...args)
}) as typeof nextAuthResult.auth

