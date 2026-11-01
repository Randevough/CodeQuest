import { Header } from '@/components/Header'

export default function QuestDetailLoading() {
    return (
        <div className="min-h-screen bg-surface font-sans text-foreground flex flex-col antialiased relative [overflow-x:clip]" role="status" aria-busy="true">
            <Header activePage="workspace" />

            <main className="page-container flex-1 py-8 md:py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
                    {/* Main Content */}
                    <div className="lg:col-span-8 min-w-0 flex flex-col gap-6">
                        <article className="bg-surface dark:bg-surface-dark rounded-card break-words border border-border overflow-hidden animate-pulse">
                            <div className="p-8 pb-6 border-b border-border">
                                <div className="flex flex-col gap-6">
                                    <div className="h-5 w-32 bg-surface rounded"></div>
                                    <div className="h-4 w-48 bg-surface rounded"></div>
                                    <div className="h-10 w-3/4 bg-surface rounded"></div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-20 bg-surface rounded"></div>
                                        <div className="h-6 w-24 bg-surface rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 pb-10 space-y-8">
                                <div className="space-y-4">
                                    <div className="h-6 w-48 bg-surface rounded"></div>
                                    <div className="h-4 w-full bg-surface rounded"></div>
                                    <div className="h-4 w-full bg-surface rounded"></div>
                                    <div className="h-4 w-5/6 bg-surface rounded"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-6 w-48 bg-surface rounded"></div>
                                    <div className="h-4 w-full bg-surface rounded"></div>
                                    <div className="h-4 w-3/4 bg-surface rounded"></div>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-surface dark:bg-surface-dark rounded-card break-words border border-border p-6 animate-pulse">
                            <div className="h-6 w-48 bg-surface rounded mb-6"></div>
                            <div className="h-12 w-full bg-surface rounded-lg mb-4"></div>
                            <div className="h-12 w-full bg-surface rounded-lg"></div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
