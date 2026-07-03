'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-slate-50 dark:bg-black font-['Plus_Jakarta_Sans'] text-[#171717] dark:text-white flex flex-col items-center justify-center p-4 antialiased">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                        <h2 className="text-2xl font-bold mb-2">Critical System Failure</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            A severe error occurred preventing the application from loading.
                        </p>
                        <button
                            onClick={() => reset()}
                            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-sm"
                        >
                            Hard Reboot
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
