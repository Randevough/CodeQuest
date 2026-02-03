import { getLeaderboardStanding } from "@/actions/user";
import Link from "next/link";
import { PointsInfoModal } from "./PointsInfoModal";
import Image from "next/image";

export async function UserStanding({ timeframe = 'all' }: { timeframe?: string }) {
    const standing = await getLeaderboardStanding(timeframe);

    if (!standing) {
        return (
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center">
                    <p className="text-slate-500">Sign in to see your standing</p>
                    <Link href="/login" className="mt-4 block w-full py-2 bg-primary text-white rounded-lg">Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Standing</h2>
                    <PointsInfoModal />
                </div>
                <div className="flex flex-col items-center mb-6">
                    <div className="size-16 rounded-full border-2 border-primary p-0.5 mb-3 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        {standing.avatar ? (
                            <img className="w-full h-full object-cover rounded-full" src={standing.avatar} alt="Your Avatar" />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {standing.name?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                        {standing.rank}<span className="text-lg align-top text-slate-400">
                            {['st', 'nd', 'rd'][((standing.rank + 90) % 100 - 10) % 10 - 1] || 'th'}
                        </span>
                    </div>
                    <div className="text-sm text-slate-500">Global Rank</div>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800/30">
                        <span className="text-xs font-semibold text-orange-800 dark:text-orange-200 uppercase tracking-wider mb-1">Current Points</span>
                        <div className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
                            <Image src="/icon.png" alt="Points" width={24} height={24} className="object-contain" />
                            <span className="text-2xl font-mono font-bold">{standing.points.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-100 dark:border-indigo-900/30">
                        <div className="flex gap-2">
                            {standing.isTop ? (
                                <>
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">emoji_events</span>
                                    <div>
                                        <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">You are at the top!</p>
                                        <div className="flex items-center gap-1 text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
                                            <span>Defend your throne</span>
                                            <Image src="/icon.png" alt="Points" width={12} height={12} className="object-contain" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">rocket_launch</span>
                                    <div>
                                        <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-100">Keep climbing!</p>
                                        <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">You need <span className="font-bold">{standing.pointsToNext.toLocaleString()} pts</span> to overtake the next rank.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <Link href={`/profile/${standing.id}`} className="block w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 text-sm font-semibold rounded-lg transition-all active:scale-95 text-center">
                        View Full Profile
                    </Link>
                </div>
            </div>
        </div>
    )
}
