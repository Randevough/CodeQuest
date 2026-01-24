'use client'

import { authenticate } from '@/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { toast } from 'sonner';

// Wrapper to intercept form action and clear toast if needed?
// Actually server action redirects on success.
// If error, we show toast.

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const router = useRouter();

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

    // Detect if we just signed up (optional, if we redirect to login with query param)
    // Detect if we just signed up
    const toastedRef = useRef(false);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('signedUp') && !toastedRef.current) {
            toast.success("Account created! Please sign in.");
            toastedRef.current = true;
            // Clean up url
            router.replace('/login');
        }
    }, [router]);

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-[#111827] mb-2">
                    Welcome back
                </h1>
                <p className="text-[#6B7280] text-sm">
                    Enter your credentials to access your account.
                </p>
            </div>

            <form action={dispatch} className="flex flex-col gap-5">
                <div>
                    <label className="mb-1 block text-sm font-medium text-[#111827]" htmlFor="email">Email address</label>
                    <input className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5] sm:text-sm py-2.5 text-black" id="email" name="email" placeholder="name@example.com" type="email" required />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-[#111827]" htmlFor="password">Password</label>
                        <Link className="text-sm font-medium text-[#4F46E5] hover:text-indigo-500" href="#">Forgot password?</Link>
                    </div>
                    <PasswordInput id="password" name="password" required minLength={6} />
                </div>

                <SubmitButton loadingText="Signing in...">Sign In</SubmitButton>
            </form>

            <div className="mt-8 text-center text-sm text-[#6B7280]">
                Don&apos;t have an account?
                <Link href="/signup" className="font-semibold text-[#4F46E5] hover:text-indigo-500 hover:underline ml-1">
                    Sign Up
                </Link>
            </div>
        </>
    );
}
