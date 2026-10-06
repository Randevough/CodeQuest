import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Cleaning up all user data...")
    await prisma.notification.deleteMany({})
    await prisma.userBadge.deleteMany({})
    await prisma.penalty.deleteMany({})
    await prisma.snatch.deleteMany({})
    await prisma.squad.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.verificationToken.deleteMany({})
    const deletedUsers = await prisma.user.deleteMany({})
    console.log(`Successfully deleted ${deletedUsers.count} users.`)
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
