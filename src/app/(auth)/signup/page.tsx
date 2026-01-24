'use client'

import { signup } from '@/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function SignupPage() {
    const [errorMessage, dispatch] = useActionState(signup, undefined);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

    return (
        <>
            <div className="mb-6 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-[#111827] mb-2">
                    Create an account
                </h1>
                <p className="text-[#6B7280] text-sm">
                    All accounts must use a valid <span className="font-mono text-[#4F46E5]">@student.ac.id</span> domain.
                </p>
            </div>

            <form action={dispatch} className="flex flex-col gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-[#111827]" htmlFor="name">Full Name</label>
                    <input className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5] sm:text-sm py-2.5 text-black" id="name" name="name" placeholder="John Doe" type="text" />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-[#111827]" htmlFor="email">Email address</label>
                    <input className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5] sm:text-sm py-2.5 text-black" id="email" name="email" placeholder="student@student.ac.id" type="email" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-1" htmlFor="password">Password</label>
                        <PasswordInput id="password" name="password" required minLength={6} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#111827] mb-1" htmlFor="confirmPassword">Confirm Password</label>
                        <PasswordInput id="confirmPassword" name="confirmPassword" required minLength={6} />
                    </div>
                </div>

                <div className="mt-2">
                    <SubmitButton loadingText="Creating account...">Create Account</SubmitButton>
                </div>
            </form>

            <div className="mt-6 text-center text-sm text-[#6B7280]">
                Already have an account?
                <Link href="/login" className="font-semibold text-[#4F46E5] hover:text-indigo-500 hover:underline ml-1">
                    Sign In
                </Link>
            </div>
        </>
    );
}
