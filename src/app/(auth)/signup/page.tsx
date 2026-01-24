'use client'

import { signup } from '@/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
    const [errorMessage, dispatch] = useActionState(signup, undefined);

    return (
        <>
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black tracking-[-0.033em] leading-[1.1] mb-4 text-[#111827]">
                    Join the Quest
                </h1>
                <p className="text-[#6B7280] text-lg font-normal leading-relaxed">
                    Create your account and start your journey to mastery.
                </p>
            </div>

            <form action={dispatch} className="flex flex-col gap-5">
                <div>
                    <label className="mb-1 block text-sm font-medium text-[#111827]" htmlFor="name">Full Name</label>
                    <input className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5] sm:text-sm py-2.5 text-black" id="name" name="name" placeholder="John Doe" type="text" />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-[#111827]" htmlFor="email">Email address</label>
                    <input className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5] sm:text-sm py-2.5 text-black" id="email" name="email" placeholder="name@example.com" type="email" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1" htmlFor="password">Password</label>
                    <input className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5] sm:text-sm py-2.5 text-black" id="password" name="password" placeholder="••••••••" type="password" required minLength={6} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#111827] mb-1" htmlFor="confirmPassword">Confirm Password</label>
                    <input className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5] sm:text-sm py-2.5 text-black" id="confirmPassword" name="confirmPassword" placeholder="••••••••" type="password" required minLength={6} />
                </div>

                {errorMessage && (
                    <div className="text-red-500 text-sm font-medium text-center">
                        {errorMessage}
                    </div>
                )}

                <button className="group flex w-full items-center justify-center rounded-lg bg-[#4F46E5] px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all mt-2" type="submit">
                    Sign Up
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-[#6B7280]">
                Already have an account?
                <Link href="/login" className="font-semibold text-[#4F46E5] hover:text-indigo-500 hover:underline ml-1">
                    Sign In
                </Link>
            </div>
        </>
    );
}
