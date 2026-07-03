import { Header } from '@/components/Header'

export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background-dark font-['Plus_Jakarta_Sans']" role="status" aria-busy="true">
            <Header activePage="leaderboard" />

            <main className="flex-1 px-4 sm:px-6 py-8 md:py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Sidebar Skeleton */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm animate-pulse flex flex-col items-center">
                                <div className="h-24 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-4"></div>
                                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-6"></div>
                                <div className="w-full flex justify-between gap-4 mb-6">
                                    <div className="flex-1 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                                    <div className="flex-1 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                                </div>
                                <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            </div>
                        </div>

                        {/* Tabs Skeleton */}
                        <div className="lg:col-span-8">
                            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm animate-pulse overflow-hidden">
                                <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-4 gap-6">
                                    <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-t-lg"></div>
                                    <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 rounded-t-lg"></div>
                                    <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 rounded-t-lg"></div>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
