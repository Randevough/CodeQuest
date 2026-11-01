import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';

export default function AdminDashboardLoading() {
    return (
        <div className="min-w-0 flex flex-col h-full bg-surface relative font-sans" role="status" aria-busy="true">
            {/* Header Skeleton */}
            <header className="min-h-16 py-3 gap-3 flex-wrap flex-shrink-0 bg-surface border-b border-border flex items-center justify-between px-4 sm:px-4 sm:px-6 lg:px-8 z-10 transition-colors">
                <div className="flex items-center gap-4">
                    <MobileSidebarTrigger className="md:hidden" />
                    <div className="h-7 w-48 bg-surface-raised rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-5 w-32 bg-surface-raised rounded animate-pulse"></div>
                </div>
            </header>

            <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-content flex flex-col gap-6">
                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-surface p-6 rounded-card border border-border shadow-sm animate-pulse flex flex-col gap-4">
                                <div className="h-5 w-24 bg-surface-raised rounded"></div>
                                <div className="h-10 w-16 bg-surface-raised rounded"></div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-surface p-6 rounded-card border border-border shadow-sm h-80 animate-pulse">
                            <div className="h-6 w-48 bg-surface-raised rounded mb-6"></div>
                            <div className="h-full w-full bg-surface-raised rounded"></div>
                        </div>
                        <div className="bg-surface p-6 rounded-card border border-border shadow-sm h-80 animate-pulse">
                            <div className="h-6 w-40 bg-surface-raised rounded mb-6"></div>
                            <div className="h-full w-full bg-surface-raised rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}