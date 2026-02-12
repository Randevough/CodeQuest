'use client';

import Image from 'next/image';
import { useState } from 'react';

// ... (StatsGrid and StatsProps remain unchanged)

// ... (LeaderboardPreview remains unchanged, just need to ensure UserAvatar is defined before or after)

// Define UserAvatar at the end or before LeaderboardPreview. 
// Since I can't easily target "End of file" without a distinct anchor, I'll replace the last closing brace of LeaderboardPreview and append MemberAvatar.
// Wait, replacing the whole file content is expensive/risky.
// I'll replace the import first.


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
                    {stats.totalMembers.toLocaleString('en-US')}
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
                <div className="text-slate-500 text-sm font-medium mb-2">Total Points</div>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        {stats.totalPoints >= 1000 ? `${(stats.totalPoints / 1000).toFixed(1)}k` : stats.totalPoints}
                    </span>
                    <Image src="/icon.png" alt="Points" width={24} height={24} className="object-contain" />
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
    // Helper to get initials
    const getInitials = (name: string | null, handle: string | null) => {
        const displayName = name || handle || '?';
        const parts = displayName.split(' ').filter(Boolean);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return displayName.substring(0, 2).toUpperCase();
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark shadow-sm">
            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Leaderboard Preview</h3>
                <button className="text-sm text-slate-500 hover:text-orange-500 transition-colors">View Full</button>
            </div>
            <div className="p-0">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-3 w-16 text-center">Rank</th>
                            <th className="px-6 py-3">User</th>
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
                                            <UserAvatar name={user.name} handle={user.handle} avatar={user.avatar} />
                                            <span className="font-medium text-slate-900 dark:text-slate-100">
                                                {user.name || user.handle || 'Anonymous'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                        <div className="flex items-center justify-end gap-1">
                                            {user.points.toLocaleString('en-US')}
                                            <Image src="/icon.png" alt="Points" width={16} height={16} className="object-contain" />
                                        </div>
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

function UserAvatar({ name, handle, avatar }: { name: string | null, handle: string | null, avatar: string | null }) {
    const [imageError, setImageError] = useState(false);

    const getInitials = (name: string | null, handle: string | null) => {
        const displayName = name || handle || '?';
        const parts = displayName.split(' ').filter(Boolean);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return displayName.substring(0, 2).toUpperCase();
    };

    if (avatar && !imageError) {
        return (
            <Image
                src={avatar}
                alt={name || 'User'}
                width={32}
                height={32}
                className="rounded-full border border-border-light object-cover aspect-square"
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200 dark:border-slate-700">
            {getInitials(name, handle)}
        </div>
    );
}
