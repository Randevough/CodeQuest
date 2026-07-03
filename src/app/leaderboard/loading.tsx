import { Header } from '@/components/Header'

export default function LeaderboardLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-[#171717] dark:text-white flex flex-col antialiased relative font-['Plus_Jakarta_Sans']" role="status" aria-busy="true">
            <Header activePage="leaderboard" />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                <div className="mb-8">
                    <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2"></div>
                    <div className="h-6 w-96 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse"></div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    <div className="lg:col-span-3 space-y-6">
                        {/* Table */}
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-pulse min-h-[500px]">
                            <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"></div>
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 gap-4">
                                    <div className="h-6 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    </div>
                                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Standing Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-pulse flex flex-col items-center">
                            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-6 self-start"></div>
                            <div className="h-20 w-20 bg-slate-200 dark:bg-slate-700 rounded-full mb-4"></div>
                            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                            <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded mb-6"></div>
                            <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-6"></div>
                            <div className="flex w-full justify-between items-center mb-4">
                                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
