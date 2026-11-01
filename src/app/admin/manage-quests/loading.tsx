import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';

export default function Loading() {
    return (
        <div role="status" aria-label="Loading quests" aria-busy="true" className="min-w-0 flex flex-col h-full bg-surface relative font-sans">
            {/* Header Skeleton */}
            <header className="min-h-16 py-3 gap-3 flex-wrap flex-shrink-0 border-b border-border flex items-center justify-between px-4 sm:px-4 sm:px-6 lg:px-8 bg-surface z-10">
                <div className="flex items-center gap-4">
                    <MobileSidebarTrigger className="md:hidden" />
                    <div className="h-7 w-32 bg-surface-raised rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-40 bg-surface-raised rounded-md animate-pulse"></div>
                </div>
            </header>

            {/* Content Skeleton */}
            <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-content flex flex-col gap-6">
                    {/* Filters Skeleton */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="w-full sm:w-80 h-9 bg-surface rounded-md animate-pulse border border-border"></div>
                        <div className="flex gap-2">
                            <div className="h-9 w-48 bg-surface rounded-md animate-pulse border border-border"></div>
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-surface border border-border rounded-card shadow-sm overflow-hidden min-h-[400px]">
                        <div className="h-12 border-b border-border bg-surface"></div>
                        <div className="p-0">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-border">
                                    <div className="flex flex-col gap-2 w-[40%]">
                                        <div className="h-4 w-3/4 bg-surface-raised rounded animate-pulse"></div>
                                        <div className="h-3 w-1/4 bg-surface-raised rounded animate-pulse"></div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-[20%]">
                                        <div className="h-5 w-24 bg-surface-raised rounded animate-pulse"></div>
                                    </div>
                                    <div className="h-4 w-12 bg-surface-raised rounded animate-pulse"></div>
                                    <div className="h-6 w-20 bg-surface-raised rounded-full animate-pulse"></div>
                                    <div className="h-8 w-8 bg-surface-raised rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}