import Link from 'next/link';
import { getAdminDashboardStats } from '@/actions/admin-dashboard';
import { StatsGrid, LeaderboardPreview } from '@/components/admin/AdminStats';
import { ActivityTrendChart, DifficultyDistributionChart } from '@/components/admin/AdminCharts';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
    const statsResult = await getAdminDashboardStats();

    // Default empty state if fetch fails
    const stats = statsResult.success && statsResult.data ? statsResult.data : {
        totalMembers: 0,
        totalAdmins: 0,
        activeQuests: 0,
        pendingReviews: 0,
        totalPoints: 0,
        activityTrend: [],
        difficultyDistribution: [],
        leaderboard: []
    };

    return (
        <>
            <header className="h-16 flex-shrink-0 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-8 z-10 transition-colors">
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Dashboard Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span>Last 30 Days</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark transition-colors">
                <div className="mx-auto max-w-7xl flex flex-col gap-6">
                    {/* Stats Grid */}
                    <StatsGrid
                        stats={{
                            totalMembers: stats.totalMembers,
                            activeQuests: stats.activeQuests,
                            pendingReviews: stats.pendingReviews,
                            totalPoints: stats.totalPoints
                        }}
                    />

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Productivity Trend */}
                        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Monthly Productivity Trend</h3>
                                <div className="text-xs text-slate-400 font-medium">Last 30 Days</div>
                            </div>
                            {stats.activityTrend.length > 0 ? (
                                <ActivityTrendChart data={stats.activityTrend} />
                            ) : (
                                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                                    No activity data available
                                </div>
                            )}
                        </div>

                        {/* Difficulty Distribution */}
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark shadow-sm flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Difficulty Distribution</h3>
                            <div className="flex-1 flex items-center justify-center relative">
                                {stats.difficultyDistribution.length > 0 ? (
                                    <DifficultyDistributionChart data={stats.difficultyDistribution} />
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                                        No active quests
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Leaderboard Preview */}
                        <div className="lg:col-span-2">
                            <LeaderboardPreview users={stats.leaderboard} />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark shadow-sm flex flex-col">
                            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Quick Actions</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 gap-4 flex-1">
                                <Link href="/admin/manage-quests/create" className="group flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-accent hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all text-left">
                                    <div className="h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                        <span className="material-symbols-outlined">add_circle</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">Create Quest</span>
                                        <span className="text-xs text-slate-500">Draft new challenge</span>
                                    </div>
                                </Link>
                                <Link href="/admin/submissions" className="group flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-accent hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all text-left">
                                    <div className="h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                        <span className="material-symbols-outlined">rate_review</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">Review Submissions</span>
                                        <span className="text-xs text-slate-500">{stats.pendingReviews} Pending items</span>
                                    </div>
                                </Link>
                                <Link href="/admin/members" className="group flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-accent hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all text-left">
                                    <div className="h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                        <span className="material-symbols-outlined">manage_accounts</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">Manage Members</span>
                                        <span className="text-xs text-slate-500">View user directory</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
