import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { authConfig } from "./auth.config"

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

export const { handlers, auth, signIn, signOut } = NextAuth({
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

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.sub = user.id
                token.role = user.role
                token.points = user.points
                token.avatar = user.avatar
            }

            // If we have a user ID, fetch the latest data from the database
            if (token.sub) {
                try {
                    const freshUser = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: {
                            role: true,
                            points: true,
                            avatar: true,
                            // @ts-ignore: Prisma client not generated yet
                            image: true,
                            // @ts-ignore: Prisma client not generated yet
                            bio: true,
                            // @ts-ignore: Prisma client not generated yet
                            githubUrl: true,
                            // @ts-ignore: Prisma client not generated yet
                            linkedinUrl: true
                        }
                    });

                    if (freshUser) {
                        token.role = freshUser.role;
                        token.points = freshUser.points;
                        token.avatar = freshUser.avatar;
                        // @ts-ignore: Prisma client not generated yet
                        token.image = freshUser.image;
                        // @ts-ignore: Prisma client not generated yet
                        token.bio = freshUser.bio;
                        // @ts-ignore: Prisma client not generated yet
                        token.githubUrl = freshUser.githubUrl;
                        // @ts-ignore: Prisma client not generated yet
                        token.linkedinUrl = freshUser.linkedinUrl;
                    }
                } catch (error) {
                    console.error("Error fetching fresh user data in JWT callback:", error);
                }
            }

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string
                session.user.role = token.role as string
                session.user.points = token.points as number
                session.user.avatar = token.avatar as string | null
                session.user.image = (token.image as string | null) || (token.avatar as string | null)
                session.user.bio = token.bio as string | null
                session.user.githubUrl = token.githubUrl as string | null
                session.user.linkedinUrl = token.linkedinUrl as string | null
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
})
