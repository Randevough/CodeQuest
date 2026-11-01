import { Header } from '@/components/Header'

export default function LeaderboardLoading() {
    return (
        <div className="min-h-screen bg-surface text-foreground flex flex-col antialiased relative font-sans" role="status" aria-busy="true">
            <Header activePage="leaderboard" />

            <main className="page-container flex-1 py-8 relative">
                <div className="mb-8">
                    <div className="h-10 w-64 bg-surface rounded animate-pulse mb-2"></div>
                    <div className="h-6 w-96 max-w-full bg-surface rounded animate-pulse"></div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-10 w-24 bg-surface rounded-lg animate-pulse"></div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    <div className="lg:col-span-3 min-w-0 space-y-6">
                        {/* Table */}
                        <div className="bg-surface dark:bg-surface-dark rounded-card break-words border border-border overflow-hidden animate-pulse min-h-[500px]">
                            <div className="h-12 border-b border-border bg-surface"></div>
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex items-center px-6 py-4 border-b border-border gap-4">
                                    <div className="h-6 w-8 bg-surface rounded"></div>
                                    <div className="h-10 w-10 bg-surface rounded-full"></div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="h-4 w-32 bg-surface rounded"></div>
                                        <div className="h-3 w-20 bg-surface rounded"></div>
                                    </div>
                                    <div className="h-4 w-24 bg-surface rounded"></div>
                                    <div className="h-5 w-16 bg-surface rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Standing Sidebar */}
                    <div className="lg:col-span-1 min-w-0">
                        <div className="bg-surface dark:bg-surface-dark rounded-card break-words border border-border p-6 animate-pulse flex flex-col items-center">
                            <div className="h-6 w-32 bg-surface rounded mb-6 self-start"></div>
                            <div className="h-20 w-20 bg-surface rounded-full mb-4"></div>
                            <div className="h-5 w-32 bg-surface rounded mb-2"></div>
                            <div className="h-4 w-20 bg-surface rounded mb-6"></div>
                            <div className="w-full h-px bg-surface mb-6"></div>
                            <div className="flex w-full justify-between items-center mb-4">
                                <div className="h-8 w-16 bg-surface rounded"></div>
                                <div className="h-8 w-16 bg-surface rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
