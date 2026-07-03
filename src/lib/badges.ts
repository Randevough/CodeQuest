
import { prisma } from "@/lib/db"

export async function checkBadges(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            snatches: {
                where: { status: 'ACCEPTED' },
                include: { quest: true }
            },
            badges: {
                include: { badge: true }
            }
        }
    })

    if (!user) return

    const earnedBadges: string[] = []
    const existingBadgeSlugs = new Set(user.badges.map(ub => ub.badge.slug))

    // Helper to grant badge
    const grantBadge = async (slug: string) => {
        if (existingBadgeSlugs.has(slug)) return

        const badge = await prisma.badge.findUnique({ where: { slug } })
        if (!badge) return

        await prisma.userBadge.create({
            data: {
                userId,
                badgeId: badge.id
            }
        })
        earnedBadges.push(badge.name)
    }

    // 1. Progression Badges (Quest Count)
    const completedCount = user.completedQuests
    if (completedCount >= 1) await grantBadge('novice')
    if (completedCount >= 5) await grantBadge('apprentice')
    if (completedCount >= 10) await grantBadge('journeyman')
    if (completedCount >= 25) await grantBadge('expert')
    if (completedCount >= 50) await grantBadge('master')

    // 2. Point Milestones
    const points = user.points
    if (points >= 100) await grantBadge('point-collector')
    if (points >= 500) await grantBadge('high-scorer')
    if (points >= 1000) await grantBadge('score-leader')
    if (points >= 5000) await grantBadge('legend')

    // 3. Category Specialists
    const webQuests = user.snatches.filter(s => s.quest.category === 'Web').length
    const aiQuests = user.snatches.filter(s => s.quest.category === 'AI').length
    const mobileQuests = user.snatches.filter(s => s.quest.category === 'Mobile').length

    if (webQuests >= 5) await grantBadge('web-weaver')
    if (aiQuests >= 5) await grantBadge('ai-architect')
    if (mobileQuests >= 5) await grantBadge('mobile-maestro')

    // 4. Difficulty Badges
    const hasIntermediate = user.snatches.some(s => s.quest.difficulty === 'Intermediate')
    const hasAdvanced = user.snatches.some(s => s.quest.difficulty === 'Advanced')

    if (hasIntermediate) await grantBadge('challenger')
    if (hasAdvanced) await grantBadge('conqueror')

    return earnedBadges
}
