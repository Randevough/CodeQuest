'use server';

import { prisma } from '@/lib/db';

export async function verifyEmail(token: string) {
    if (!token) {
        return { success: false, error: 'Token is required' };
    }

    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: { token }
        });

        if (!verificationToken) {
            return { success: false, error: 'Invalid or expired token' };
        }

        if (verificationToken.expires < new Date()) {
            await prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: verificationToken.identifier,
                        token: verificationToken.token,
                    }
                }
            });
            return { success: false, error: 'Token has expired' };
        }

        const user = await prisma.user.findUnique({
            where: { email: verificationToken.identifier }
        });

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (user.emailVerified) {
            return { success: true, message: 'Email already verified' };
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { email: verificationToken.identifier },
                data: { emailVerified: new Date() }
            }),
            prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier: verificationToken.identifier,
                        token: verificationToken.token,
                    }
                }
            })
        ]);

        return { success: true, message: 'Email verified successfully' };
    } catch (error) {
        console.error('Verification error:', error);
        return { success: false, error: 'Something went wrong during verification' };
    }
}
