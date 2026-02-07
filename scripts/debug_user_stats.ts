
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        include: {
            snatches: true
        }
    })

    console.log('User Stats (Only with Snatches):')
    const activeUsers = users.filter(u => u.snatches.length > 0)

    activeUsers.forEach(u => {
        const counts = u.snatches.reduce((acc, s) => {
            acc[s.status] = (acc[s.status] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        console.log(`User: ${u.email} (${u.name})`)
        console.log('  Active Snatches:', counts['ACTIVE'] || 0)
        console.log('  Total Snatches (Interacted):', u.snatches.length)
        console.log('  Breakdown:', JSON.stringify(counts))
        console.log('---')
    })

    const totalQuests = await prisma.quest.count({ where: { status: 'Active' } })
    console.log('Total Active Quests in System:', totalQuests)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
