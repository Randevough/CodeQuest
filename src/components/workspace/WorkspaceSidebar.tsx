export function WorkspaceSidebar() {
    return (
        <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">#42</div>
                        <div className="text-xs text-gray-500">Current Rank</div>
                        <div className="text-[10px] text-green-600 font-medium mt-1">Top 5%</div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">450</div>
                        <div className="text-xs text-gray-500">Total Points</div>
                        <div className="text-[10px] text-green-600 font-medium mt-1">+50 this week</div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Submission History</h3>
                        <a className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline" href="#">View All</a>
                    </div>
                    <div className="space-y-0 relative">
                        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-100 dark:bg-gray-800"></div>
                        <div className="flex gap-4 relative">
                            <div className="mt-1 h-4 w-4 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center justify-center shrink-0 z-10">
                                <span className="material-symbols-outlined text-[10px] text-green-600 dark:text-green-400">check</span>
                            </div>
                            <div className="pb-6">
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Intro to Python</p>
                                <p className="text-[10px] text-gray-500">Completed • 2 days ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4 relative">
                            <div className="mt-1 h-4 w-4 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center justify-center shrink-0 z-10">
                                <span className="material-symbols-outlined text-[10px] text-red-600 dark:text-red-400">priority_high</span>
                            </div>
                            <div className="pb-6">
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">React Kanban</p>
                                <p className="text-[10px] text-gray-500">Requested Revision • 3 days ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4 relative">
                            <div className="mt-1 h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 z-10">
                                <span className="material-symbols-outlined text-[10px] text-blue-600 dark:text-blue-400">arrow_upward</span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Data Scraper</p>
                                <p className="text-[10px] text-gray-500">Submitted • 1 week ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-sm mb-2">Need a teammate?</h3>
                    <p className="text-xs text-indigo-100 mb-4 leading-relaxed">Most advanced quests are easier with a partner. Check Discord to find a buddy.</p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-medium transition-colors">
                        Join Discord Server
                    </button>
                </div>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </div>
        </aside>
    )
}
