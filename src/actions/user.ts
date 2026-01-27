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

    for (const user of usersToCreate) {
        // Upsert to prevent unique constraint errors on email
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: user
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
