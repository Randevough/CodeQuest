import { Header } from '@/components/Header'

export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-surface dark:bg-background-dark font-sans" role="status" aria-busy="true">
            <Header activePage="leaderboard" />

            <main className="page-container flex-1 py-8 md:py-12">
                <div className="max-w-content mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Sidebar Skeleton */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-surface dark:bg-surface-dark border border-border rounded-card break-words p-6 animate-pulse flex flex-col items-center">
                                <div className="h-24 w-24 bg-surface rounded-full mb-4"></div>
                                <div className="h-6 w-48 bg-surface rounded mb-2"></div>
                                <div className="h-4 w-32 bg-surface rounded mb-6"></div>
                                <div className="w-full flex justify-between gap-4 mb-6">
                                    <div className="flex-1 h-16 bg-surface rounded-lg"></div>
                                    <div className="flex-1 h-16 bg-surface rounded-lg"></div>
                                </div>
                                <div className="w-full h-10 bg-surface rounded-lg"></div>
                            </div>
                        </div>

                        {/* Tabs Skeleton */}
                        <div className="lg:col-span-8 min-w-0">
                            <div className="bg-surface dark:bg-surface-dark border border-border rounded-card break-words animate-pulse overflow-hidden">
                                <div className="flex border-b border-border px-6 pt-4 gap-6">
                                    <div className="h-10 w-24 bg-surface rounded-t-lg"></div>
                                    <div className="h-10 w-24 bg-surface rounded-t-lg"></div>
                                    <div className="h-10 w-24 bg-surface rounded-t-lg"></div>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-48 bg-surface rounded-card break-words"></div>
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
