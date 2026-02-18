
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const badges = [
    // Progression
    { slug: 'novice', name: 'Novice', description: 'Completed 1 Quest', category: 'PROGRESSION', imageUrl: '/badges/novice.svg' },
    { slug: 'apprentice', name: 'Apprentice', description: 'Completed 5 Quests', category: 'PROGRESSION', imageUrl: '/badges/apprentice.svg' },
    { slug: 'journeyman', name: 'Journeyman', description: 'Completed 10 Quests', category: 'PROGRESSION', imageUrl: '/badges/journeyman.svg' },
    { slug: 'expert', name: 'Expert', description: 'Completed 25 Quests', category: 'PROGRESSION', imageUrl: '/badges/expert.svg' },
    { slug: 'master', name: 'Master', description: 'Completed 50 Quests', category: 'PROGRESSION', imageUrl: '/badges/master.svg' },

    // Points
    { slug: 'point-collector', name: 'Point Collector', description: 'Earned 100 Points', category: 'POINTS', imageUrl: '/badges/point-collector.svg' },
    { slug: 'high-scorer', name: 'High Scorer', description: 'Earned 500 Points', category: 'POINTS', imageUrl: '/badges/high-scorer.svg' },
    { slug: 'score-leader', name: 'Score Leader', description: 'Earned 1,000 Points', category: 'POINTS', imageUrl: '/badges/score-leader.svg' },
    { slug: 'legend', name: 'Legend', description: 'Earned 5,000 Points', category: 'POINTS', imageUrl: '/badges/legend.svg' },

    // Categories
    { slug: 'web-weaver', name: 'Web Weaver', description: 'Completed 5 Web quests', category: 'CATEGORY', imageUrl: '/badges/web-weaver.svg' },
    { slug: 'ai-architect', name: 'AI Architect', description: 'Completed 5 AI quests', category: 'CATEGORY', imageUrl: '/badges/ai-architect.svg' },
    { slug: 'mobile-maestro', name: 'Mobile Maestro', description: 'Completed 5 Mobile quests', category: 'CATEGORY', imageUrl: '/badges/mobile-maestro.svg' },

    // Difficulty
    { slug: 'challenger', name: 'Challenger', description: 'Completed an Intermediate quest', category: 'DIFFICULTY', imageUrl: '/badges/challenger.svg' },
    { slug: 'conqueror', name: 'Conqueror', description: 'Completed an Advanced quest', category: 'DIFFICULTY', imageUrl: '/badges/conqueror.svg' },
]

async function main() {
    console.log('Seeding badges...')

    for (const badge of badges) {
        await prisma.badge.upsert({
            where: { slug: badge.slug },
            update: badge,
            create: badge,
        })
    }

    console.log('Badges seeded successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
