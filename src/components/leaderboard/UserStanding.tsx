export function UserStanding() {
    return (
        <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Standing</h2>
                    <span className="flex items-center justify-center size-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        <span className="material-symbols-outlined text-[16px]">info</span>
                    </span>
                </div>
                <div className="flex flex-col items-center mb-6">
                    <div className="size-16 rounded-full border-2 border-primary p-0.5 mb-3 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img className="w-full h-full object-cover rounded-full" src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="Your Avatar" />
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">42<span className="text-lg align-top text-slate-400">nd</span></div>
                    <div className="text-sm text-slate-500">Global Rank</div>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Points</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">2,450</span>
                        </div>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-100 dark:border-indigo-900/30">
                        <div className="flex gap-2">
                            <span className="material-symbols-outlined text-primary text-sm mt-0.5">rocket_launch</span>
                            <div>
                                <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">Keep climbing!</p>
                                <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">You need <span className="font-bold">150 pts</span> to overtake the next rank.</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                        View Full Profile
                    </button>
                </div>
            </div>
        </div>
    )
}
