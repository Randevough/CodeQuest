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
        if (loading || success) return;
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
            setErrorMsg('Email verification could not complete. Try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div role="alert" className="w-full rounded-input border border-danger bg-surface p-4 text-danger">
                No verification token found in the URL.
            </div>
        );
    }

    if (success) {
        return (
            <div role="status" className="w-full rounded-input border border-border bg-surface p-6 text-success">
                Verification successful! Redirecting to login...
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <button
                onClick={handleVerify}
                disabled={loading}
                aria-busy={loading} className="button-primary w-full"
            >
                {loading ? "Verifying..." : "Verify email"}
            </button>
            {errorMsg && (
                <div role="alert" className="w-full rounded-input border border-danger bg-surface p-4 text-danger">
                    {errorMsg}
                </div>
            )}
        </div>
    );
}
