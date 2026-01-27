
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'codequest@cyber-univ.ac.id'

    const admin = await prisma.user.findUnique({
        where: { email: adminEmail }
    })

    if (!admin) {
        console.log("Admin user not found. Aborting cleanup to prevent data loss.")
        return
    }

    console.log(`Found admin user: ${admin.email} (${admin.id})`)
    console.log("Starting cleanup...")

    // Delete related records for non-admin users first
    const deleteSnatches = await prisma.snatch.deleteMany({
        where: {
            userId: {
                not: admin.id
            }
        }
    })
    console.log(`Deleted ${deleteSnatches.count} snatches (squad memberships).`)

    const deletePenalties = await prisma.penalty.deleteMany({
        where: {
            userId: {
                not: admin.id
            }
        }
    })
    console.log(`Deleted ${deletePenalties.count} penalties.`)

    const deleteAccounts = await prisma.account.deleteMany({
        where: {
            userId: {
                not: admin.id
            }
        }
    })
    console.log(`Deleted ${deleteAccounts.count} linked accounts.`)

    // Finally delete the users
    const deleteUsers = await prisma.user.deleteMany({
        where: {
            id: {
                not: admin.id
            }
        }
    })
    console.log(`Deleted ${deleteUsers.count} non-admin users.`)

    console.log("Cleanup complete.")
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
