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
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 font-['Plus_Jakarta_Sans']">
            <div className="max-w-md w-full bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[24px]">gavel</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Admin Command Failed</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                    An error occurred while accessing the admin controls.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-bold rounded-lg transition-colors text-sm"
                    >
                        Retry Command
                    </button>
                    <Link href="/admin" className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-lg transition-colors text-sm">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
