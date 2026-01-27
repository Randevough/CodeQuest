
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'codequest@cyber-univ.ac.id'
    // Secure default password - user should change this
    const password = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'Admin', // Ensure role is verified if user exists
            points: 450,   // Reset points to spec
        },
        create: {
            email,
            name: 'Admin User',
            role: 'Admin',
            points: 450,
            completedQuests: 12,
            password,
            handle: 'admin_user',
        },
    })

    console.log({ admin })
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
