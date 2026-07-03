'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'

export default function GlobalError({
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
        <div className="min-h-screen bg-slate-50 dark:bg-black font-['Plus_Jakarta_Sans'] text-[#171717] dark:text-white flex flex-col antialiased relative">
            <Header activePage="explore" />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                    <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-[32px]">warning</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">System Failure</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Our servers encountered an unexpected glitch. The engineering team has been notified.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => reset()}
                            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-sm"
                        >
                            Try Again
                        </button>
                        <Link href="/" className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-lg transition-colors">
                            Return to Base
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
