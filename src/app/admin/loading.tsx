import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';

export default function AdminDashboardLoading() {
    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative font-['Plus_Jakarta_Sans']" role="status" aria-busy="true">
            {/* Header Skeleton */}
            <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 z-10 transition-colors">
                <div className="flex items-center gap-4">
                    <MobileSidebarTrigger className="md:hidden" />
                    <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="mx-auto max-w-7xl flex flex-col gap-6">
                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse flex flex-col gap-4">
                                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm h-80 animate-pulse">
                            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                            <div className="h-full w-full bg-slate-100 dark:bg-slate-900/50 rounded"></div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm h-80 animate-pulse">
                            <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                            <div className="h-full w-full bg-slate-100 dark:bg-slate-900/50 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
