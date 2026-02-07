import { getLeaderboardStanding } from "@/actions/user"
import Image from "next/image"

export async function WorkspaceSidebar() {
    const standing = await getLeaderboardStanding()

    return (
        <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col justify-center h-[88px]">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white leading-none mb-1">
                            {standing ? `#${standing.rank}` : '-'}
                        </div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Current Rank</div>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 flex flex-col justify-center h-[88px]">
                        <div className="flex items-center gap-2 mb-1">
                            <Image
                                src="/icon.png"
                                alt="Points"
                                width={20}
                                height={20}
                                className="object-contain"
                            />
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-mono leading-none">
                                {standing ? standing.points.toLocaleString() : '0'}
                            </div>
                        </div>
                        <div className="text-xs text-orange-600/80 dark:text-orange-400/80 font-medium uppercase tracking-wide">Total Points</div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-400 rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-sm mb-2 text-white">Need a teammate?</h3>
                    <p className="text-xs text-white mb-4 leading-relaxed">Most advanced quests are easier with a partner. Check Discord to find a buddy.</p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-medium transition-colors text-white">
                        Join Discord Server
                    </button>
                </div>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </div>
        </aside>
    )
}
