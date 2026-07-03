import { Header } from '@/components/Header'

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-[#171717] dark:text-white flex flex-col antialiased relative font-['Plus_Jakarta_Sans']" role="status" aria-busy="true">
            <Header activePage="explore" />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                {/* Hero / Filter Section Skeleton */}
                <div className="mb-8 flex flex-col gap-4">
                    <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-6 w-96 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-[250px] flex flex-col gap-4 shadow-sm animate-pulse">
                            <div className="flex justify-between items-start">
                                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            </div>
                            <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded mt-2"></div>
                            <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                            <div className="mt-auto h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
