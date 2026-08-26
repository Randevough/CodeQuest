import { Suspense } from 'react';
import { VerifyForm } from './VerifyForm';

export const metadata = {
    title: 'Verify Email - CodeQuest',
    description: 'Verify your email to start your CodeQuest journey',
};

export default function VerifyPage() {
    return (
        <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verify Your Email</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
                Click the button below to complete your registration.
            </p>
            <Suspense fallback={<div className="animate-pulse h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-md"></div>}>
                <VerifyForm />
            </Suspense>
        </div>
    );
}
