'use server';

import { prisma } from "@/lib/db";
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

export async function getAdminDashboardStats() {
    try {
        // 1. Basic Stats
        const [totalMembers, activeQuests, pendingReviews, acceptedSnatches] = await Promise.all([
            prisma.user.count({ where: { role: 'Member' } }),
            prisma.quest.count({ where: { status: 'Active' } }),
            prisma.snatch.count({ where: { status: 'SUBMITTED' } }),
            prisma.snatch.findMany({
                where: { status: 'ACCEPTED' },
                select: {
                    quest: {
                        select: { points: true }
                    }
                }
            })
        ]);

        const totalPoints = acceptedSnatches.reduce((acc, snatch) => acc + (snatch.quest?.points || 0), 0);

        // 2. Activity Trend (Last 30 Days)
        // Group snatches by date. Since SQLite doesn't support complex date grouping easily in Prisma,
        // we might need to fetch and process, or use raw query.
        // For simplicity and small scale, let's fetch last 30 days snatches and group in JS.
        const thirtyDaysAgo = subDays(new Date(), 30);
        const last30DaysSnatches = await prisma.snatch.findMany({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                }
            },
            select: {
                createdAt: true
            }
        });

        // Initialize map with all 30 days to ensure 0s are present
        const activityMap = new Map<string, number>();
        for (let i = 0; i < 30; i++) {
            const date = subDays(new Date(), i);
            activityMap.set(format(date, 'yyyy-MM-dd'), 0);
        }

        last30DaysSnatches.forEach(snatch => {
            const dateStr = format(snatch.createdAt, 'yyyy-MM-dd');
            if (activityMap.has(dateStr)) {
                activityMap.set(dateStr, activityMap.get(dateStr)! + 1);
            }
        });

        // Convert to array and reverse to show oldest first
        const activityTrend = Array.from(activityMap.entries())
            .map(([date, count]) => ({ date, count }))
            .reverse();


        // 3. Difficulty Distribution
        const questsByDifficulty = await prisma.quest.groupBy({
            by: ['difficulty'],
            _count: {
                id: true
            },
            where: {
                status: 'Active' // Only count active quests? Or all? Let's do all for now or just active.
                // Usually stats show "Available" distribution.
            }
        });

        // Format for Recharts (e.g., [{ name: 'Easy', value: 10 }, ...])
        const difficultyDistribution = questsByDifficulty.map(item => ({
            name: item.difficulty,
            value: item._count.id
        }));


        // 4. Leaderboard (Top 5 Members)
        const leaderboard = await prisma.user.findMany({
            where: { role: 'Member' },
            orderBy: { points: 'desc' },
            take: 5,
            select: {
                id: true,
                name: true,
                avatar: true,
                points: true,
                handle: true
            }
        });

        return {
            success: true,
            data: {
                totalMembers,
                activeQuests,
                pendingReviews,
                totalPoints,
                activityTrend,
                difficultyDistribution,
                leaderboard
            }
        };

    } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
        return { success: false, error: "Failed to fetch stats" };
    }
}
