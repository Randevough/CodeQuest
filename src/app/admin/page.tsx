import { MobileSidebarTrigger } from '@/components/admin/MobileSidebarTrigger';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';
import { getAdminDashboardStats } from '@/actions/admin-dashboard';
import { StatsGrid, LeaderboardPreview } from '@/components/admin/AdminStats';
import { Calendar, PlusCircle, FileEdit, Users } from 'lucide-react';

const ActivityTrendChart = dynamicImport(
    () => import('@/components/admin/AdminCharts').then((m) => m.ActivityTrendChart),
    {
        loading: () => <div className="h-64 w-full bg-surface-raised rounded animate-pulse" />,
    }
);

const DifficultyDistributionChart = dynamicImport(
    () => import('@/components/admin/AdminCharts').then((m) => m.DifficultyDistributionChart),
    {
        loading: () => <div className="h-64 w-full bg-surface-raised rounded animate-pulse" />,
    }
);

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
            <header className="min-h-16 py-3 gap-3 flex-wrap flex-shrink-0 bg-background border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 transition-colors">
                <div className="flex items-center gap-3">
                    <MobileSidebarTrigger className="md:hidden" />
                    <h1 className="text-2xl sm:text-3xl text-foreground">Dashboard Overview</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted flex items-center gap-2">
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        <span>Last 30 Days</span>
                    </div>
                </div>
            </header>

            <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background transition-colors">
                <div className="mx-auto max-w-content flex flex-col gap-6">
                    {!statsResult.success && <p role="alert" className="border border-control-border bg-surface p-4 text-danger">Dashboard data could not load. Counts below use fallback values. Refresh to retry.</p>}
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
                        <div className="lg:col-span-2 bg-surface p-6 rounded-card border border-border shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-foreground">Monthly Productivity Trend</h3>
                                <div className="text-xs text-muted font-medium">Last 30 Days</div>
                            </div>
                            {stats.activityTrend.length > 0 ? (
                                <ActivityTrendChart data={stats.activityTrend} />
                            ) : (
                                <div className="h-64 flex items-center justify-center text-muted text-sm">
                                    No activity data available
                                </div>
                            )}
                        </div>

                        {/* Difficulty Distribution */}
                        <div className="bg-surface p-6 rounded-card border border-border shadow-sm flex flex-col">
                            <h3 className="text-lg font-bold text-foreground mb-6">Difficulty Distribution</h3>
                            <div className="flex-1 flex items-center justify-center relative">
                                {stats.difficultyDistribution.length > 0 ? (
                                    <DifficultyDistributionChart data={stats.difficultyDistribution} />
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-muted text-sm">
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
                        <div className="bg-surface rounded-card border border-border shadow-sm flex flex-col">
                            <div className="px-6 py-4 border-b border-border">
                                <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 gap-4 flex-1">
                                <Link href="/admin/manage-quests/create" className="group flex items-center gap-4 p-4 rounded-card border border-control-border hover:border-control-border hover:bg-surface transition-all text-left">
                                    <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0  transition-transform shadow-sm text-secondary-foreground">
                                        <PlusCircle className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-foreground group-hover:text-foreground transition-colors">Create Quest</span>
                                        <span className="text-xs text-muted">Draft new challenge</span>
                                    </div>
                                </Link>
                                <Link href="/admin/submissions" className="group flex items-center gap-4 p-4 rounded-card border border-control-border hover:border-control-border hover:bg-surface transition-all text-left">
                                    <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0  transition-transform shadow-sm text-secondary-foreground">
                                        <FileEdit className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-foreground group-hover:text-foreground transition-colors">Review Submissions</span>
                                        <span className="text-xs text-muted">{stats.pendingReviews} Pending items</span>
                                    </div>
                                </Link>
                                <Link href="/admin/members" className="group flex items-center gap-4 p-4 rounded-card border border-control-border hover:border-control-border hover:bg-surface transition-all text-left">
                                    <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0  transition-transform shadow-sm text-secondary-foreground">
                                        <Users className="w-5 h-5" aria-hidden="true" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-foreground group-hover:text-foreground transition-colors">Manage Members</span>
                                        <span className="text-xs text-muted">View user directory</span>
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