import { Header } from '@/components/Header'

export default function WorkspaceLoading() {
    return (
        <div className="min-h-screen text-[#171717] dark:text-white flex flex-col antialiased relative [overflow-x:clip]" role="status" aria-busy="true">
            <div className="relative z-10 flex flex-col min-h-screen">
                <Header activePage="workspace" />

                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    {/* Workspace Header Skeleton */}
                    <div className="mb-8 md:mb-12">
                        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-3"></div>
                        <div className="h-5 w-96 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Grid Area */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-[220px] flex flex-col gap-4 shadow-sm animate-pulse">
                                    <div className="flex justify-between items-start">
                                        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                    </div>
                                    <div className="h-4 w-1/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                            <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                        </div>
                                        <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar Area */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm animate-pulse">
                                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                                <div className="flex justify-between items-end mb-4">
                                    <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-6"></div>
                                <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
