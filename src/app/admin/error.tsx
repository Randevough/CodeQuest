'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-surface font-sans">
            <div className="max-w-md w-full bg-surface p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-border text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-surface"></div>
                <div className="mx-auto w-12 h-12 bg-surface text-danger rounded-full flex items-center justify-center mb-6">
                    <span aria-hidden="true" className="material-symbols-outlined text-[24px]">gavel</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Admin Command Failed</h2>
                <p className="text-sm text-muted mb-8">
                    An error occurred while accessing the admin controls.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full py-2.5 px-4 bg-surface hover:bg-surface text-foreground font-bold rounded-card transition-colors text-sm"
                    >
                        Retry Command
                    </button>
                    <Link href="/admin" className="w-full py-2.5 px-4 bg-surface-raised text-foreground hover:bg-surface-raised font-bold rounded-card transition-colors text-sm">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}