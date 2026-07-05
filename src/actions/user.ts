'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/auth'

export async function getLeaderboardUsers(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize

    const [usersData, total] = await Promise.all([
        prisma.user.findMany({
            orderBy: {
                points: 'desc'
            },
            include: {
                _count: {
                    select: {
                        snatches: {
                            where: { status: { in: ['ACCEPTED', 'ARCHIVED'] } }
                        }
                    }
                }
            },
            skip,
            take: pageSize
        }),
        prisma.user.count()
    ])

    const users = usersData.map(user => ({
        ...user,
        completedQuests: user._count.snatches
    }))

    return { users, total }
}

export async function getLeaderboardStanding() {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
        return null; // Or handle not logged in
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, points: true, avatar: true, name: true }
    });

    if (!currentUser) return null;

    // Rank: Count users with more points
    const rank = await prisma.user.count({
        where: { points: { gt: currentUser.points } }
    }) + 1;

    // Next Rank User (The one just above)
    // Find users with more points, order by points ASC (closest to current user), take 1
    const nextRankUser = await prisma.user.findFirst({
        where: { points: { gt: currentUser.points } },
        orderBy: { points: 'asc' },
        select: { points: true }
    });

    const pointsToNext = nextRankUser ? (nextRankUser.points - currentUser.points + 1) : 0;

    return {
        ...currentUser,
        rank,
        pointsToNext,
        isTop: rank === 1
    };
}
