'use client';

import Image from 'next/image';

interface StatsProps {
    totalMembers: number;
    activeQuests: number;
    pendingReviews: number;
    totalPoints: number;
}

export function StatsGrid({ stats }: { stats: StatsProps }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-2">Total Members</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {stats.totalMembers.toLocaleString()}
                </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-2">Live Quests</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {stats.activeQuests}
                </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex justify-between items-start">
                    <div className="text-slate-500 text-sm font-medium mb-2">Pending Reviews</div>
                    {stats.pendingReviews > 0 && (
                        <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                    )}
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {stats.pendingReviews}
                </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                <div className="text-slate-500 text-sm font-medium mb-2">Total Sparkles</div>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        {stats.totalPoints >= 1000 ? `${(stats.totalPoints / 1000).toFixed(1)}k` : stats.totalPoints}
                    </span>
                    <span className="text-2xl">✨</span>
                </div>
            </div>
        </div>
    );
}

interface LeaderboardUser {
    id: string;
    name: string | null;
    avatar: string | null;
    points: number;
    handle: string | null;
}

export function LeaderboardPreview({ users }: { users: LeaderboardUser[] }) {
    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark shadow-sm">
            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Leaderboard Preview</h3>
                <button className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">View Full</button>
            </div>
            <div className="p-0">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-3 w-16 text-center">Rank</th>
                            <th className="px-6 py-3">Student</th>
                            <th className="px-6 py-3 text-right">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No members yet.</td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-3 text-center">
                                        {index === 0 ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 font-bold text-xs">1</span>
                                        ) : index === 1 ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">2</span>
                                        ) : index === 2 ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-xs">3</span>
                                        ) : (
                                            <span className="text-slate-400 font-medium">{index + 1}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            {user.avatar ? (
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.name || 'User'}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full border border-border-light"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                                                    {(user.name || user.handle || '?').charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            <span className="font-medium text-slate-900 dark:text-slate-100">
                                                {user.name || user.handle || 'Anonymous'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                        {user.points.toLocaleString()} ✨
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
