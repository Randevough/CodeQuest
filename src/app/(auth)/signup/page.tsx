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
            <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-2 font-[Fira_Sans]">
                    Create an account
                </h1>
                <p className="text-slate-500 text-sm">
                    All accounts must use a valid <span className="font-mono text-orange-600 bg-orange-50 px-1 py-0.5 rounded">@student.ac.id</span> email.
                </p>
            </div>

            <form action={dispatch} className="flex flex-col gap-5">
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1E293B]" htmlFor="name">Nickname</label>
                    <input className="block w-full rounded-lg border border-slate-200 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-3 px-4 text-slate-900 transition-all duration-200 ease-in-out hover:border-orange-500 outline-none focus:ring-1" id="name" name="name" placeholder="SuperCoder99" type="text" />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1E293B]" htmlFor="email">Email address</label>
                    <input className="block w-full rounded-lg border border-slate-200 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-3 px-4 text-slate-900 transition-all duration-200 ease-in-out hover:border-orange-500 outline-none focus:ring-1" id="email" name="email" placeholder="student@student.ac.id" type="email" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#1E293B] mb-1.5" htmlFor="password">Password</label>
                        <PasswordInput id="password" name="password" required minLength={6} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#1E293B] mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
                        <PasswordInput id="confirmPassword" name="confirmPassword" required minLength={6} />
                    </div>
                </div>

                <div className="mt-2">
                    <SubmitButton loadingText="Creating account...">Create Account</SubmitButton>
                </div>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
                Already have an account?
                <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-600 hover:underline ml-1 transition-colors">
                    Sign In
                </Link>
            </div>
        </>
    );
}
