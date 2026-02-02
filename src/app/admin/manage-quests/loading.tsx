import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';

export default function Loading() {
    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative font-['Plus_Jakarta_Sans']">
            {/* Header Skeleton */}
            <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-white dark:bg-slate-900 z-10">
                <div className="flex items-center gap-4">
                    <MobileSidebarTrigger className="md:hidden" />
                    <div className="h-7 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-40 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
                </div>
            </header>

            {/* Content Skeleton */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="mx-auto max-w-6xl flex flex-col gap-6">
                    {/* Filters Skeleton */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="w-full sm:w-80 h-9 bg-white dark:bg-slate-800 rounded-md animate-pulse border border-slate-200 dark:border-slate-700"></div>
                        <div className="flex gap-2">
                            <div className="h-9 w-48 bg-white dark:bg-slate-800 rounded-md animate-pulse border border-slate-200 dark:border-slate-700"></div>
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden min-h-[400px]">
                        <div className="h-12 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"></div>
                        <div className="p-0">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/50">
                                    <div className="flex flex-col gap-2 w-[40%]">
                                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                        <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-[20%]">
                                        <div className="h-5 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                    </div>
                                    <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                    <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div>
                                    <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
