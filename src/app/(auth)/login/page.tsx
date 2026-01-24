'use client'

import { authenticate } from '@/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const router = useRouter();

    // Simple client-side redirect if we want, but NextAuth usually handles this.
    // We'll rely on server action validation.

    return (
        <>
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black tracking-[-0.033em] leading-[1.1] mb-4 text-[#111827]">
                    Enter the Forge
                </h1>
                <p className="text-[#6B7280] text-lg font-normal leading-relaxed">
                    Transforming beginners into competent developers through real-world projects.
                </p>
            </div>

            <div className="mb-6 flex justify-center w-full">
                <span className="material-symbols-outlined text-[#4F46E5]/80 animate-pulse text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>spark</span>
            </div>

            {/* Social Login Button (Stubbed for now) */}
            <button type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-[#111827] transition-all hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2">
                {/* Google Icon SVG */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="text-base font-semibold">Sign in with Google (Coming Soon)</span>
            </button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">or</span>
                </div>
            </div>

            <form action={dispatch} className="flex flex-col gap-5">
                <div>
                    <label className="mb-1 block text-sm font-medium text-[#111827]" htmlFor="email">Email address</label>
                    <input className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5] sm:text-sm py-2.5 text-black" id="email" name="email" placeholder="name@example.com" type="email" required />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-[#111827]" htmlFor="password">Password</label>
                        <a className="text-sm font-medium text-[#4F46E5] hover:text-indigo-500" href="#">Forgot password?</a>
                    </div>
                    <input className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5] sm:text-sm py-2.5 text-black" id="password" name="password" placeholder="••••••••" type="password" required minLength={6} />
                </div>

                {errorMessage && (
                    <div className="text-red-500 text-sm font-medium text-center">
                        {errorMessage}
                    </div>
                )}

                <button className="group flex w-full items-center justify-center rounded-lg bg-[#4F46E5] px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all mt-2" type="submit">
                    Sign In
                </button>
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
