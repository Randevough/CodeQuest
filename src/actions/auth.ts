'use server'

import { signIn } from '@/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function authenticate(prevState: string | undefined, formData: FormData) {
    const ip = (await headers()).get('x-forwarded-for') || 'unknown';
    if (!(await rateLimit(`login:${ip}`, 5, 60000))) {
        return 'Too many login attempts. Please try again later.';
    }
    const email = formData.get('email') as string;
    let redirectTo = '/?loggedIn=true';

    // Check if admin login to redirect to dashboard
    if (email === 'codequest@cyber-univ.ac.id') {
        redirectTo = '/admin/members';
    }

    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo });
    } catch (e: unknown) {
        if (e instanceof AuthError) {
            if (e.type === 'CredentialsSignin') {
                const errorWithCode = e as AuthError & { code?: string; cause?: { err?: { code?: string; message?: string } } };
                const errCode = errorWithCode.code || errorWithCode.cause?.err?.code || errorWithCode.cause?.err?.message;
                if (errCode === 'unverified_email' || errCode === 'UnverifiedEmailError') {
                    return 'Please check your email and verify your account before logging in.';
                }
                return 'Invalid credentials.';
            }
            return 'Something went wrong.';
        }
        throw e;
    }
}

export async function signup(prevState: string | undefined, formData: FormData) {
    const ip = (await headers()).get('x-forwarded-for') || 'unknown';
    if (!(await rateLimit(`signup:${ip}`, 3, 3600000))) { // 3 signups per hour per IP to prevent spam
        return 'Too many signup attempts. Please try again later.';
    }
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string;

    if (!email || !password) return "Missing fields";
    if (!email.endsWith('@cyber-univ.ac.id')) return "Invalid domain. Only @cyber-univ.ac.id emails are allowed.";
    if (password !== confirmPassword && confirmPassword) return "Passwords do not match";

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) return "User already exists";

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: name || email.split('@')[0],
        }
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires
        }
    });

    await sendVerificationEmail(email, token);

    // Manual redirect for UX flow requested
    redirect('/login?signedUp=true');
}
