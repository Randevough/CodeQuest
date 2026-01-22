import Link from 'next/link'

export function WorkspaceQuestGrid() {
    return (
        <div className="lg:col-span-8 space-y-6">
            {/* Quest 1 */}
            <article className="group bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
                <div className="h-1 w-full bg-red-500"></div>
                <div className="p-6 flex flex-col gap-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold border border-red-100 dark:border-red-800">
                                    Revision Needed
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    Submitted 2 days ago
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Build a React Kanban Board</h3>
                        </div>
                        <div className="relative group/menu">
                            <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-lg flex gap-3">
                        <div className="shrink-0 text-red-500">
                            <span className="material-symbols-outlined">rate_review</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-red-800 dark:text-red-300 mb-1">Feedback from Admin</p>
                            <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                                "Great work on the UI components! However, the drag-and-drop state persistence seems buggy on refresh. Please fix the local storage sync logic and resubmit."
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-surface-dark bg-gray-200" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2e6OM7insIdK_EKhQDkLRlPQhcSdbaNSOvRTahV6XUtynx8JnFLg3-_wsnZwN8Q-_DrOqSmSvenRsPooT0R6N2AefpNs-9A_shAcqosZ7q3ted9FaaQGEbqKK_Og84p3LoZh4evLnZMyQTyBLwiBUCbo6Htlp_9Pm0bQ_Ih14bMxPwJgG3Hi8loRBXFRfaPCQP6f_u-AQe3z9CZTAzk0hp5GkWgWNnXRGf0THiI3EZcyOmSWZLfEr2qiW66X4id8vf8TDmDqFomwp')", backgroundSize: "cover" }}></div>
                                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-surface-dark bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-700">JD</div>
                            </div>
                            <a className="flex items-center gap-1 text-xs font-medium text-[#5865F2] hover:underline" href="#">
                                <span className="material-symbols-outlined text-[16px]">forum</span>
                                <span>#kanban-team-4</span>
                            </a>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                View Brief
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">link</span>
                            <input
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all placeholder:text-gray-400"
                                placeholder="Paste updated GitHub link..." type="text"
                            />
                        </div>
                        <button className="shrink-0 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-sm">
                            Resubmit
                        </button>
                    </div>
                </div>
            </article>

            {/* Quest 2 */}
            <article className="group bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
                <div className="h-1 w-full bg-blue-500"></div>
                <div className="p-6 flex flex-col gap-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-800">
                                    In Progress
                                </span>
                                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-800/50 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">timer</span>
                                    Due in 5 hours
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Algorithm Optimization Challenge</h3>
                        </div>
                        <div className="relative group/menu">
                            <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-surface-dark bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">ME</div>
                                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-surface-dark bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold">+2</div>
                            </div>
                            <a className="flex items-center gap-1 text-xs font-medium text-[#5865F2] hover:underline" href="#">
                                <span className="material-symbols-outlined text-[16px]">forum</span>
                                <span>#algo-squad</span>
                            </a>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                View Brief
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">link</span>
                            <input
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all placeholder:text-gray-400"
                                placeholder="https://github.com/..." type="text"
                            />
                        </div>
                        <button className="shrink-0 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-sm">
                            Submit
                        </button>
                    </div>
                </div>
            </article>

            {/* Empty Slot */}
            <article className="flex flex-col items-center justify-center gap-4 h-[240px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-surface-dark/30 hover:bg-gray-50 dark:hover:bg-surface-dark/50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-gray-400">add_circle</span>
                </div>
                <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Empty Slot Available</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">You can take on one more quest this week.</p>
                </div>
                <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center gap-1">
                    Browse New Quests <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
            </article>
        </div>
    )
}
