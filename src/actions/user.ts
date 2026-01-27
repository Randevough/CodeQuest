'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const ROLES = ['Master Coder', 'Bug Hunter', 'Algo Expert', 'Frontend Wizard', 'Backend Guru', 'Fullstack Hero']
import { auth } from '@/auth'
const NAMES = [
    'Alex Chen', 'Sarah Jenkins', 'Michael Ross', 'Jenny Wilson', 'Robert Fox',
    'Kristin Watson', 'Esther Howard', 'Cody Fisher', 'Brooklyn Sim', 'Cameron McClane',
    'Guy Hawkins', 'Jane Cooper', 'Jacob Jones', 'Savannah Nguyen', 'Bessie Cooper',
    'Ralph Edwards', 'Jerome Bell', 'Albert Flores', 'Darlene Robertson', 'Arlene McCoy'
]

export async function seedUsers(formData?: FormData) {
    // FORCE ADD 20 users regardless of existing count
    // const count = await prisma.user.count()
    // if (count >= 20) return { success: true, message: 'Users already seeded' }

    const usersToCreate = NAMES.map((name) => {
        const randomSuffix = Math.floor(Math.random() * 1000)
        const handle = `@${name.toLowerCase().replace(' ', '_')}${randomSuffix}`
        const role = 'Member'
        const points = Math.floor(Math.random() * 10000) + 500 // 500 - 10500
        const completedQuests = Math.floor(points / 100) + Math.floor(Math.random() * 5)
        // Use Dicebear for predictable avatars
        const avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${handle}`
        const email = `${handle.substring(1)}@cyber-univ.ac.id`

        return {
            name,
            email,
            handle,
            role,
            points,
            completedQuests,
            avatar
        }
    })

    // Create a Quest to snatch if none exists, or use existing
    let quest = await prisma.quest.findFirst()
    if (!quest) {
        quest = await prisma.quest.create({
            data: {
                title: 'Welcome Quest',
                description: 'First stepping stone.',
                points: 100,
                difficulty: 'Beginner',
                category: 'Web'
            }
        })
    }

    for (const user of usersToCreate) {
        // Upsert User
        const createdUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                name: user.name,
                email: user.email,
                handle: user.handle,
                role: user.role,
                avatar: user.avatar,
                // We will calculate points from snatches, let's init with 0 and update after
                points: 0,
                completedQuests: 0
            }
        })

        // Create random Snatches to simulate history and points
        // Matches the "Points displayed... from approved quests" logic
        const numSnatches = Math.floor(Math.random() * 10) + 1
        let totalPoints = 0

        // Generate snatches over the last year
        for (let i = 0; i < numSnatches; i++) {
            const daysAgo = Math.floor(Math.random() * 365)
            const approvedAt = new Date()
            approvedAt.setDate(approvedAt.getDate() - daysAgo)

            // Re-use same quest for simplicity or create dummy quest relations logic if strict unique check on [userId, questId] allows
            // Since unique constraint exists, we need unique quest IDs. 
            // For seed simplicity, let's create a dynamic quest for each snatch or reuse if we had many.
            // Let's create a lightweight quest per snatch to be safe on unique constraints for now.
            const tempQuest = await prisma.quest.create({
                data: {
                    title: `Quest ${Math.random().toString(36).substring(7)}`,
                    description: 'Generated quest',
                    points: Math.floor(Math.random() * 500) + 50,
                    category: ['Web', 'AI', 'Mobile'][Math.floor(Math.random() * 3)]
                }
            })

            await prisma.snatch.create({
                data: {
                    userId: createdUser.id,
                    questId: tempQuest.id,
                    status: 'COMPLETED',
                    approvedAt: approvedAt,
                    updatedAt: approvedAt
                }
            })
            totalPoints += tempQuest.points
        }

        // Update user total points cache
        await prisma.user.update({
            where: { id: createdUser.id },
            data: {
                points: totalPoints,
                completedQuests: numSnatches
            }
        })
    }

    revalidatePath('/leaderboard')
    return { success: true, message: 'Users seeded successfully' }
}

export async function getLeaderboardUsers(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            orderBy: {
                points: 'desc'
            },
            skip,
            take: pageSize
        }),
        prisma.user.count()
    ])

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
