'use server'

import { signIn } from '@/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/?loggedIn=true' });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function signup(prevState: string | undefined, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string;

    if (!email || !password) return "Missing fields";
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

    // Manual redirect for UX flow requested
    redirect('/login?signedUp=true');
}
