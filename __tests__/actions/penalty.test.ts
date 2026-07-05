import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { testPrisma } from '../setup'
import { joinQuest } from '@/actions/quest'
import { assignQuest } from '@/actions/assignment'
import { User, Quest } from '@prisma/client'

// Mock next-auth and next/cache
vi.mock('next-auth', () => ({
    getServerSession: vi.fn(),
}))

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}))

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

describe('Penalty Enforcement', () => {
    let user: User
    let admin: User
    let quest: Quest

    beforeEach(async () => {
        if (!process.env.DATABASE_URL_TEST) return

        user = await testPrisma.user.create({
            data: {
                name: 'Test Penalty User',
                email: 'penalty@example.com',
                handle: 'penaltyuser'
            }
        })

        admin = await testPrisma.user.create({
            data: {
                name: 'Admin',
                email: 'admin@example.com',
                handle: 'admin',
                role: 'Admin'
            }
        })

        quest = await testPrisma.quest.create({
            data: {
                title: 'Test Quest',
                description: 'A test quest',
                points: 100,
                difficulty: 'Easy',
                category: 'Frontend',
                maxSnatchers: 10,
                status: 'Active'
            }
        })

        const authMod = await import('@/auth')
        // @ts-ignore
        authMod.auth.mockResolvedValue({
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('prevents joining a quest if user has an active penalty', async () => {
        if (!process.env.DATABASE_URL_TEST) return

        // Add an active penalty
        const futureDate = new Date()
        futureDate.setHours(futureDate.getHours() + 2)

        await testPrisma.penalty.create({
            data: {
                userId: user.id,
                reason: 'Test penalty',
                expiresAt: futureDate
            }
        })

        const result = await joinQuest(quest.id)
        
        expect(result.success).toBe(false)
        expect(result.error).toContain("currently penalized")
    })

    it('allows joining a quest if penalty is expired', async () => {
        if (!process.env.DATABASE_URL_TEST) return

        // Add an expired penalty
        const pastDate = new Date()
        pastDate.setHours(pastDate.getHours() - 2)

        await testPrisma.penalty.create({
            data: {
                userId: user.id,
                reason: 'Test penalty expired',
                expiresAt: pastDate
            }
        })

        const result = await joinQuest(quest.id)
        
        expect(result.success).toBe(true)
    })

    it('prevents assigning a quest to a user with an active penalty', async () => {
        if (!process.env.DATABASE_URL_TEST) return

        const authMod = await import('@/auth')
        // @ts-ignore
        authMod.auth.mockResolvedValue({
            user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
        })

        const futureDate = new Date()
        futureDate.setHours(futureDate.getHours() + 2)

        await testPrisma.penalty.create({
            data: {
                userId: user.id,
                reason: 'Test penalty',
                expiresAt: futureDate
            }
        })

        const result = await assignQuest(user.id, quest.id)
        
        expect(result.success).toBe(false)
        expect(result.error).toContain("active penalty")
    })
})
