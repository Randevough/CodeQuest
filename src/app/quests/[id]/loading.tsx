import { Header } from '@/components/Header'

export default function QuestDetailLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-['Plus_Jakarta_Sans'] text-[#171717] dark:text-white flex flex-col antialiased relative [overflow-x:clip]" role="status" aria-busy="true">
            <Header activePage="workspace" />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
                    {/* Main Content */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <article className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
                            <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col gap-6">
                                    <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 pb-10 space-y-8">
                                <div className="space-y-4">
                                    <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 animate-pulse">
                            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                            <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
                            <div className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}
