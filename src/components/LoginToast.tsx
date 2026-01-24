'use client'

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginToast() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const toasted = useRef(false);

    useEffect(() => {
        if (toasted.current) return;

        if (searchParams.get('loggedIn')) {
            toast.success("Welcome aboard! Ready to forge your legacy?");
            toasted.current = true;
            // Clean up the URL
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('loggedIn');
            router.replace(`/?${newParams.toString()}`);
        }
    }, [searchParams, router]);

    return null;
}
