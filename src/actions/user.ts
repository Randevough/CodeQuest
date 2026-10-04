'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { LeaderboardUser } from '@/types/user'

export async function getLeaderboardUsers(page: number = 1, pageSize: number = 20): Promise<{ users: LeaderboardUser[]; total: number }> {
    const skip = (page - 1) * pageSize

    try {
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

        const users: LeaderboardUser[] = usersData.map(user => ({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            role: user.role || 'Member',
            handle: user.handle || '@unknown',
            points: user.points,
            completedQuests: user._count.snatches,
            email: user.email
        }))

        return { users, total }
    } catch (error) {
        console.error('getLeaderboardUsers DB fetch notice (fallback used):', error)
        if (process.env.NODE_ENV === 'development') {
            const mockUsers: LeaderboardUser[] = [
                {
                    id: 'dev-admin-id',
                    name: 'Admin Developer',
                    handle: 'admin_dev',
                    email: 'codequest@cyber-univ.ac.id',
                    points: 1337,
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminDev',
                    role: 'Admin',
                    completedQuests: 12,
                },
                {
                    id: 'dev-member-id',
                    name: 'Student Member',
                    handle: 'student_pro',
                    email: 'student@cyber-univ.ac.id',
                    points: 850,
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=StudentDev',
                    role: 'Member',
                    completedQuests: 6,
                },
                {
                    id: 'dev-alex-id',
                    name: 'Alex Rivera',
                    handle: 'alex_cyber',
                    email: 'alex@cyber-univ.ac.id',
                    points: 620,
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
                    role: 'Member',
                    completedQuests: 4,
                }
            ]
            return { users: mockUsers, total: mockUsers.length }
        }
        return { users: [], total: 0 }
    }
}

export async function getLeaderboardStanding() {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
        return null; // Or handle not logged in
    }

    try {
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, points: true, avatar: true, name: true }
        });

        if (currentUser) {
            // Rank: Count users with more points
            const rank = await prisma.user.count({
                where: { points: { gt: currentUser.points } }
            }) + 1;

            // Next Rank User (The one just above)
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
    } catch (error) {
        console.error('getLeaderboardStanding DB fetch notice (fallback used):', error)
    }

    if (process.env.NODE_ENV === 'development') {
        const role = session.user.role || 'Member'
        const isAdm = role === 'Admin'
        return {
            id: session.user.id || (isAdm ? 'dev-admin-id' : 'dev-member-id'),
            name: session.user.name || (isAdm ? 'Admin Developer' : 'Student Member'),
            points: session.user.points || (isAdm ? 1337 : 450),
            avatar: session.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${isAdm ? 'AdminDev' : 'StudentDev'}`,
            rank: isAdm ? 1 : 2,
            pointsToNext: isAdm ? 0 : 400,
            isTop: isAdm,
        };
    }

    return null;
}
