
import { prisma } from '../src/lib/db'

async function main() {
    const users = await prisma.user.findMany({
        include: {
            snatches: {
                include: {
                    quest: true
                }
            }
        }
    })

    console.log('--- Debugging Snatches ---')
    for (const user of users) {
        if (user.snatches.length > 0) {
            console.log(`User: ${user.name} (${user.email})`)
            for (const snatch of user.snatches) {
                console.log(`  - Quest: ${snatch.quest.title} | Status: '${snatch.status}' | Quest Status: '${snatch.quest.status}'`)
            }
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
