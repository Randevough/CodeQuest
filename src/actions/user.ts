'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { LeaderboardUser } from '@/types/user'

export async function getLeaderboardUsers(page: number = 1, pageSize: number = 20): Promise<{ users: LeaderboardUser[]; total: number }> {
    const validPage = Math.max(1, page)
    const validPageSize = Math.max(1, pageSize)
    const skip = (validPage - 1) * validPageSize

    try {
        const [usersData, total] = await Promise.all([
            prisma.user.findMany({
                orderBy: [
                    { points: 'desc' },
                    { completedQuests: 'desc' },
                    { createdAt: 'asc' }
                ],
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
                take: validPageSize
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
    if (!session?.user || (!session.user.email && !session.user.id)) {
        return null; // Or handle not logged in
    }

    try {
        let currentUser = session.user.id
            ? await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { id: true, points: true, avatar: true, name: true, completedQuests: true, createdAt: true }
            })
            : null;

        if (!currentUser && session.user.email) {
            currentUser = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true, points: true, avatar: true, name: true, completedQuests: true, createdAt: true }
            });
        }

        if (currentUser) {
            const completed = currentUser.completedQuests ?? 0;
            const created = currentUser.createdAt ?? new Date(0);

            // Tie-breaker: 1) points desc, 2) completedQuests desc, 3) createdAt asc
            const rank = await prisma.user.count({
                where: {
                    OR: [
                        { points: { gt: currentUser.points } },
                        {
                            points: currentUser.points,
                            completedQuests: { gt: completed }
                        },
                        {
                            points: currentUser.points,
                            completedQuests: completed,
                            createdAt: { lt: created }
                        }
                    ]
                }
            }) + 1;

            const isTop = rank === 1;

            // Next Rank User (The one just above)
            const nextRankUser = isTop
                ? null
                : await prisma.user.findFirst({
                    where: {
                        OR: [
                            { points: { gt: currentUser.points } },
                            {
                                points: currentUser.points,
                                completedQuests: { gt: completed }
                            },
                            {
                                points: currentUser.points,
                                completedQuests: completed,
                                createdAt: { lt: created }
                            }
                        ]
                    },
                    orderBy: [
                        { points: 'asc' },
                        { completedQuests: 'asc' },
                        { createdAt: 'desc' }
                    ],
                    select: { points: true }
                });

            const pointsToNext = isTop || !nextRankUser
                ? 0
                : Math.max(1, nextRankUser.points - currentUser.points + (nextRankUser.points > currentUser.points ? 1 : 0));

            return {
                ...currentUser,
                rank,
                pointsToNext,
                isTop,
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
