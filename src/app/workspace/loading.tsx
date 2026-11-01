import { Header } from '@/components/Header'

export default function WorkspaceLoading() {
    return (
        <div className="min-h-screen text-foreground flex flex-col antialiased relative [overflow-x:clip]" role="status" aria-busy="true">
            <div className="relative z-10 flex flex-col min-h-screen">
                <Header activePage="workspace" />

                <main className="page-container flex-1 py-8 md:py-12">
                    {/* Workspace Header Skeleton */}
                    <div className="mb-8 md:mb-12">
                        <div className="h-10 w-64 bg-surface rounded animate-pulse mb-3"></div>
                        <div className="h-5 w-96 max-w-full bg-surface rounded animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Grid Area */}
                        <div className="lg:col-span-8 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-surface dark:bg-surface-dark border border-border rounded-card break-words p-6 h-[220px] flex flex-col gap-4 animate-pulse">
                                    <div className="flex justify-between items-start">
                                        <div className="h-6 w-3/4 bg-surface rounded"></div>
                                        <div className="h-6 w-16 bg-surface rounded-full"></div>
                                    </div>
                                    <div className="h-4 w-1/4 bg-surface rounded"></div>
                                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 bg-surface rounded-full"></div>
                                            <div className="h-4 w-20 bg-surface rounded"></div>
                                        </div>
                                        <div className="h-9 w-24 bg-surface rounded-lg"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar Area */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-surface dark:bg-surface-dark border border-border rounded-card break-words p-6 animate-pulse">
                                <div className="h-6 w-32 bg-surface rounded mb-6"></div>
                                <div className="flex justify-between items-end mb-4">
                                    <div className="h-10 w-24 bg-surface rounded"></div>
                                    <div className="h-5 w-16 bg-surface rounded"></div>
                                </div>
                                <div className="h-2 w-full bg-surface rounded-full mb-6"></div>
                                <div className="h-10 w-full bg-surface rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
