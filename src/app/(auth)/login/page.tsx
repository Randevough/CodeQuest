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
                <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-2 font-[Fira_Sans]">
                    Welcome back
                </h1>
                <p className="text-slate-500 text-sm">
                    Enter your credentials to access your account.
                </p>
            </div>

            <form action={dispatch} className="flex flex-col gap-5">
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1E293B]" htmlFor="email">Email address</label>
                    <input className="block w-full rounded-lg border border-slate-200 bg-white shadow-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 sm:text-sm py-3 px-4 text-slate-900 transition-all duration-200 ease-in-out hover:border-orange-500 outline-none" id="email" name="email" placeholder="example@cyber-univ.ac.id" type="email" required maxLength={255} />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-semibold text-[#1E293B]" htmlFor="password">Password</label>
                        <Link className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline transition-colors" href="#">Forgot password?</Link>
                    </div>
                    <PasswordInput id="password" name="password" required minLength={6} maxLength={128} />
                </div>

                <SubmitButton loadingText="Signing in...">Sign In</SubmitButton>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
                Don&apos;t have an account?
                <Link href="/signup" className="font-semibold text-orange-500 hover:text-orange-600 hover:underline ml-1 transition-colors">
                    Sign Up
                </Link>
            </div>
        </>
    );
}
