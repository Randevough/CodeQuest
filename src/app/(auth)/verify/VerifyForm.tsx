'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { verifyEmail } from '@/actions/verify';
import { toast } from 'sonner';

export function VerifyForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleVerify = async () => {
        if (!token) {
            setErrorMsg('Missing token');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        
        try {
            const res = await verifyEmail(token);
            if (res.success) {
                setSuccess(true);
                toast.success('Email verified successfully!');
                setTimeout(() => {
                    router.push('/login?verified=true');
                }, 2000);
            } else {
                setErrorMsg(res.error || 'Verification failed');
            }
        } catch {
            setErrorMsg('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="w-full text-center p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
                No verification token found in the URL.
            </div>
        );
    }

    if (success) {
        return (
            <div className="w-full text-center p-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md font-bold">
                Verification successful! Redirecting to login...
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                Confirm Verification
            </button>
            {errorMsg && (
                <div className="w-full text-center p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">
                    {errorMsg}
                </div>
            )}
        </div>
    );
}
